import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
  Platform,
  Image,
  Dimensions,
  Share,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { OBRA_TYPES, COMPANIES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth, User } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.667);
const HERO_IMAGE = require('../../assets/hero-estimar.png');

const SQ_FT_PER_M2 = 10.7639;
type UnitType = 'm2' | 'sqft';
type LangKey = 'pt' | 'en' | 'es';

// Currency and unit config per language
const LANG_CONFIG: Record<LangKey, { symbol: string; locale: string; currency: string; unit: UnitType }> = {
  pt: { symbol: 'R$',  locale: 'pt-BR', currency: 'BRL', unit: 'm2'   },
  en: { symbol: 'US$', locale: 'en-US', currency: 'USD', unit: 'sqft' },
  es: { symbol: 'US$', locale: 'es-MX', currency: 'USD', unit: 'm2'   },
};

interface Result {
  totalAreaM2: number;
  totalCost: number;
  costPerM2: number;
  timeMonths: number;
  panels: number;
  type: string;
  unit: UnitType;
  lang: LangKey;
}

// ─── Neon Icon ────────────────────────────────────────────────────────────────
function NeonIcon({ name, color, size = 18 }: { name: string; color: string; size?: number }) {
  return (
    <View style={[neon.wrap, { borderColor: color + '40', backgroundColor: color + '15' }]}>
      <Ionicons name={name as any} size={size} color={color} />
    </View>
  );
}
const neon = StyleSheet.create({
  wrap: { width: 36, height: 36, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});

// ─── Multi-Lead Modal ─────────────────────────────────────────────────────────
const PARTNER_COMPANIES = COMPANIES.slice(0, 3);
// ML_PROJECT_TYPES is now sourced from translations via t('estimar.modal.projectTypes')

function mapObraToProjectTypeIndex(value: string): number {
  if (value.startsWith('residencial')) return 0;
  if (value === 'comercial')   return 1;
  if (value === 'industrial')  return 2;
  if (value === 'corporativo') return 3;
  return 5; // Outro / Other / Otro
}

function MultiLeadModal({
  visible, onClose, result, user, initialAddress, initialArea, initialProjectType,
}: {
  visible: boolean; onClose: () => void;
  result: Result | null; user: User | null;
  initialAddress?: string;
  initialArea?: string;
  initialProjectType?: string;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const mlTypes: string[] = t('estimar.modal.projectTypes');

  const [name,        setName]        = useState('');
  const [phone,       setPhone]       = useState('');
  const [email,       setEmail]       = useState('');
  const [projectType, setProjectType] = useState(mlTypes[0] ?? 'Residencial');
  const [showTypes,   setShowTypes]   = useState(false);
  const [city,        setCity]        = useState('');
  const [area,        setArea]        = useState('');
  const [deadline,    setDeadline]    = useState('');
  const [description, setDescription] = useState('');
  const [photos,      setPhotos]      = useState<string[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [sent,        setSent]        = useState(false);

  // Pré-preenche com dados da calculadora toda vez que abre
  useEffect(() => {
    if (visible) {
      setName(user?.name ?? '');
      setPhone(user?.phone ?? '');
      setEmail(user?.email ?? '');
      setProjectType(initialProjectType ?? mlTypes[0] ?? 'Residencial');
      setCity(initialAddress ?? user?.location ?? '');
      setArea(initialArea ?? '');
      setDeadline('');
      setDescription('');
      setPhotos([]);
      setSent(false);
      setShowTypes(false);
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const pickPhoto = async () => {
    if (photos.length >= 3) { Alert.alert(t('estimar.modal.alertLimit'), t('estimar.modal.alertLimitDesc')); return; }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('estimar.modal.alertPermRequired'), t('estimar.modal.alertPermDesc')); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) setPhotos((prev) => [...prev, res.assets[0].uri]);
  };

  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleSend = async () => {
    if (!name.trim())        { Alert.alert(t('estimar.modal.alertNameRequired'), t('estimar.modal.alertNameDesc')); return; }
    if (!phone.trim())       { Alert.alert(t('estimar.modal.alertPhoneRequired'), t('estimar.modal.alertPhoneDesc')); return; }
    if (!description.trim()) { Alert.alert(t('estimar.modal.alertDescRequired'), t('estimar.modal.alertDescDesc')); return; }
    if (!result) return;

    setLoading(true);
    try {
      for (const company of PARTNER_COMPANIES) {
        const { error } = await supabase.from('leads').insert({
          company_id:   company.id,
          company_name: company.name,
          user_name:    name.trim(),
          user_phone:   phone.trim() || null,
          user_email:   user?.email || email.trim() || null,
          project_type: projectType,
          city:         city.trim() || null,
          area_m2:      area.trim() || String(result.totalAreaM2),
          deadline:     deadline.trim() || null,
          description:  description.trim() || null,
          photos:       photos.length > 0 ? photos : null,
          status:       'new',
          unlocked:     false,
        } as any);
        if (error) throw error;
      }
      setSent(true);
    } catch (err: any) {
      Alert.alert(t('estimar.modal.alertError'), err?.message ?? t('estimar.modal.alertErrorDesc'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={ml.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[ml.sheet, { paddingBottom: insets.bottom + 16 }]}>
                <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={28} />
                <View style={ml.handle} />

                {sent ? (
                  <View style={ml.successWrap}>
                    <View style={[ml.successIcon, { borderColor: Colors.cyan + '50', backgroundColor: Colors.cyan + '18' }]}>
                      <Ionicons name="checkmark-circle-outline" size={40} color={Colors.cyan} />
                    </View>
                    <Text style={ml.successTitle}>{t('estimar.modal.successTitle')}</Text>
                    <Text style={ml.successSub}>
                      {t('estimar.modal.successSub').replace('{n}', String(PARTNER_COMPANIES.length))}
                    </Text>
                    <View style={ml.sentCompanies}>
                      {PARTNER_COMPANIES.map((c) => (
                        <View key={c.id} style={[ml.sentCompanyRow, { borderColor: c.logoColor + '30' }]}>
                          <View style={[ml.sentLogo, { backgroundColor: c.logoColor + '20', borderColor: c.logoColor + '40' }]}>
                            <Text style={[ml.sentLogoText, { color: c.logoColor }]}>{c.logoInitial}</Text>
                          </View>
                          <Text style={ml.sentCompanyName}>{c.name}</Text>
                          <Ionicons name="checkmark-outline" size={16} color={Colors.cyan} />
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={ml.closeBtn}
                      onPress={() => { handleClose(); navigation.navigate('Profile' as never); }}
                      activeOpacity={0.85}
                    >
                      <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
                      <Text style={ml.closeBtnText}>{t('estimar.modal.viewMyRequests')}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    {/* Header */}
                    <View style={ml.header}>
                      <TouchableOpacity onPress={handleClose} style={ml.headerBtn} activeOpacity={0.7}>
                        <Text style={ml.cancelText}>{t('estimar.modal.cancel')}</Text>
                      </TouchableOpacity>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={ml.headerTitle}>{t('estimar.modal.title')}</Text>
                        <Text style={ml.headerSub}>{PARTNER_COMPANIES.length} {t('estimar.modal.partnerCompanies')}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={handleSend}
                        style={[ml.sendTopBtn, (!name.trim() || !phone.trim() || !description.trim()) && ml.sendTopBtnDisabled]}
                        activeOpacity={0.85}
                        disabled={loading || !name.trim() || !phone.trim() || !description.trim()}
                      >
                        {loading
                          ? <ActivityIndicator size="small" color={Colors.white} />
                          : <Text style={ml.sendTopBtnText}>{t('estimar.modal.send')}</Text>
                        }
                      </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                      {/* Info banner */}
                      <View style={ml.infoBanner}>
                        <Grad colors={['rgba(76,201,240,0.08)', 'rgba(123,97,255,0.06)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                        <Ionicons name="shield-checkmark-outline" size={16} color={Colors.cyan} />
                        <Text style={ml.infoText}>{t('estimar.modal.dataProtected')}</Text>
                      </View>

                      {/* Companies */}
                      <Text style={ml.sectionLabel}>{t('estimar.modal.selectedCompanies')}</Text>
                      <View style={ml.companiesPreview}>
                        {PARTNER_COMPANIES.map((c) => (
                          <View key={c.id} style={ml.companyChip}>
                            <View style={[ml.chipLogo, { backgroundColor: c.logoColor + '20' }]}>
                              <Text style={[ml.chipLogoText, { color: c.logoColor }]}>{c.logoInitial}</Text>
                            </View>
                            <Text style={ml.chipName} numberOfLines={1}>{c.name}</Text>
                            {c.verified && <Ionicons name="shield-checkmark-outline" size={12} color={Colors.cyan} />}
                          </View>
                        ))}
                      </View>

                      {/* Dados pessoais */}
                      <Text style={[ml.sectionLabel, { marginTop: 20 }]}>{t('estimar.modal.yourData')}</Text>

                      <View style={ml.fieldWrap}>
                        <Text style={ml.fieldLabel}>{t('estimar.modal.fullName')} *</Text>
                        <TextInput style={ml.input} value={name} onChangeText={setName} placeholder={t('estimar.modal.namePlaceholder')} placeholderTextColor={Colors.textDim} returnKeyType="next" autoCapitalize="words" />
                      </View>

                      <View style={ml.rowFields}>
                        <View style={[ml.fieldWrap, { flex: 1 }]}>
                          <Text style={ml.fieldLabel}>{t('estimar.modal.phone')} *</Text>
                          <TextInput style={ml.input} value={phone} onChangeText={setPhone} placeholder={t('estimar.modal.phonePlaceholder')} placeholderTextColor={Colors.textDim} keyboardType="phone-pad" returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />
                        </View>
                        <View style={[ml.fieldWrap, { flex: 1 }]}>
                          <Text style={ml.fieldLabel}>{t('estimar.modal.emailOptional')}</Text>
                          <TextInput style={ml.input} value={email} onChangeText={setEmail} placeholder={t('estimar.modal.optional')} placeholderTextColor={Colors.textDim} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
                        </View>
                      </View>

                      {/* Projeto */}
                      <Text style={[ml.sectionLabel, { marginTop: 20 }]}>{t('estimar.modal.yourProject')}</Text>

                      <View style={ml.fieldWrap}>
                        <Text style={ml.fieldLabel}>{t('estimar.modal.projectType')}</Text>
                        <TouchableOpacity style={ml.select} activeOpacity={0.8} onPress={() => { Keyboard.dismiss(); setShowTypes((v) => !v); }}>
                          <Text style={ml.selectValue}>{projectType}</Text>
                          <Ionicons name={showTypes ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textDim} />
                        </TouchableOpacity>
                        {showTypes && (
                          <View style={ml.dropdown}>
                            <Grad colors={['#0D1F42', '#07111F']} style={StyleSheet.absoluteFill} borderRadius={12} />
                            {mlTypes.map((type) => (
                              <TouchableOpacity key={type} style={[ml.dropdownItem, type === projectType && ml.dropdownItemActive]} onPress={() => { setProjectType(type); setShowTypes(false); }} activeOpacity={0.8}>
                                {type === projectType && <Grad colors={Colors.gradients.cyan} style={StyleSheet.absoluteFill} borderRadius={8} />}
                                <Text style={[ml.dropdownText, type === projectType && { color: Colors.white }]}>{type}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <View style={ml.rowFields}>
                        <View style={[ml.fieldWrap, { flex: 1 }]}>
                          <Text style={ml.fieldLabel}>{t('estimar.modal.city')}</Text>
                          <TextInput style={ml.input} value={city} onChangeText={setCity} placeholder={t('estimar.modal.cityPlaceholder')} placeholderTextColor={Colors.textDim} returnKeyType="next" />
                        </View>
                        <View style={[ml.fieldWrap, { flex: 1 }]}>
                          <Text style={ml.fieldLabel}>{t('estimar.modal.area')}</Text>
                          <TextInput style={ml.input} value={area} onChangeText={setArea} placeholder={t('estimar.modal.areaPlaceholder')} placeholderTextColor={Colors.textDim} keyboardType="numeric" returnKeyType="done" onSubmitEditing={Keyboard.dismiss} />
                        </View>
                      </View>

                      <View style={ml.fieldWrap}>
                        <Text style={ml.fieldLabel}>{t('estimar.modal.deadline')}</Text>
                        <TextInput style={ml.input} value={deadline} onChangeText={setDeadline} placeholder={t('estimar.modal.deadlinePlaceholder')} placeholderTextColor={Colors.textDim} returnKeyType="next" />
                      </View>

                      <View style={ml.fieldWrap}>
                        <Text style={ml.fieldLabel}>{t('estimar.modal.description')} *</Text>
                        <TextInput
                          style={[ml.input, ml.textarea]}
                          value={description}
                          onChangeText={(v) => v.length <= 500 && setDescription(v)}
                          placeholder={t('estimar.modal.descPlaceholder')}
                          placeholderTextColor={Colors.textDim}
                          multiline
                          maxLength={500}
                          textAlignVertical="top"
                        />
                        <Text style={ml.charCount}>{description.length}/500</Text>
                      </View>

                      {/* Fotos */}
                      <Text style={[ml.sectionLabel, { marginTop: 8 }]}>{t('estimar.modal.photos')}</Text>
                      <View style={ml.photosRow}>
                        {photos.map((uri, i) => (
                          <View key={i} style={ml.photoThumb}>
                            <Image source={{ uri }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                            <TouchableOpacity style={ml.photoRemove} onPress={() => removePhoto(i)} activeOpacity={0.8}>
                              <Ionicons name="close-circle" size={20} color={Colors.white} />
                            </TouchableOpacity>
                          </View>
                        ))}
                        {photos.length < 3 && (
                          <TouchableOpacity style={ml.photoAdd} onPress={pickPhoto} activeOpacity={0.8}>
                            <Grad colors={['rgba(76,201,240,0.1)', 'rgba(123,97,255,0.08)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                            <Ionicons name="camera-outline" size={22} color={Colors.cyan} />
                            <Text style={ml.photoAddText}>{t('estimar.modal.addPhoto')}</Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <View style={{ height: 16 }} />
                    </ScrollView>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const ml = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(4,8,15,0.8)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: 'rgba(76,201,240,0.12)', paddingHorizontal: 16, paddingTop: 12, overflow: 'hidden', maxHeight: '94%' },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'center', marginBottom: 16 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerBtn: { padding: 4, minWidth: 64 },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.textMuted },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white, textAlign: 'center' },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, textAlign: 'center', marginTop: 2 },
  sendTopBtn: { backgroundColor: Colors.cyan, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, minWidth: 64, alignItems: 'center' },
  sendTopBtnDisabled: { backgroundColor: 'rgba(76,201,240,0.25)' },
  sendTopBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },

  // Info
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(76,201,240,0.15)', marginBottom: 20, overflow: 'hidden' },
  infoText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  // Section labels
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.textDim, letterSpacing: 1, marginBottom: 12 },

  // Companies
  companiesPreview: { gap: 8, marginBottom: 4 },
  companyChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 12, paddingVertical: 10 },
  chipLogo: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chipLogoText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  chipName: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.white },

  // Fields
  fieldWrap: { marginBottom: 12 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  input: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  textarea: { minHeight: 100, paddingTop: 12, lineHeight: 21 },
  charCount: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, textAlign: 'right', marginTop: 4 },
  rowFields: { flexDirection: 'row', gap: 10 },

  // Dropdown
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  selectValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white },
  dropdown: { marginTop: 6, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(76,201,240,0.15)' },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 11, overflow: 'hidden' },
  dropdownItemActive: {},
  dropdownText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted },

  // Photos
  photosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  photoThumb: { width: 90, height: 90, borderRadius: 12, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  photoRemove: { position: 'absolute', top: 4, right: 4 },
  photoAdd: { width: 90, height: 90, borderRadius: 12, borderWidth: 1.5, borderColor: 'rgba(76,201,240,0.25)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden' },
  photoAddText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.cyan },

  // Success
  successWrap: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  successIcon: { width: 72, height: 72, borderRadius: 36, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  successSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  sentCompanies: { alignSelf: 'stretch', gap: 8, marginTop: 4 },
  sentCompanyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.03)' },
  sentLogo: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sentLogoText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  sentCompanyName: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.white },
  closeBtn: { height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 40, marginTop: 8 },
  closeBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff', zIndex: 1 },
});

// ─── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const { t } = useLanguage();
  const rows = [
    { key: 'time',           label: t('estimar.comparison.time'),           scip: `30 ${t('estimar.comparison.days')}`, masonry: `90 ${t('estimar.comparison.days')}`, wood: `45 ${t('estimar.comparison.days')}` },
    { key: 'fire',           label: t('estimar.comparison.fire'),           scip: 'A1 ★★★★★', masonry: 'B ★★★☆☆', wood: 'C ★★☆☆☆' },
    { key: 'hurricane',      label: t('estimar.comparison.hurricane'),      scip: 'Cat. 5 ✓',  masonry: '✗', wood: '✗' },
    { key: 'thermal',        label: t('estimar.comparison.thermal'),        scip: 'A+ ★★★★★', masonry: 'C ★★☆☆☆', wood: 'B ★★★☆☆' },
    { key: 'sustainability', label: t('estimar.comparison.sustainability'), scip: 'A+ ★★★★★', masonry: 'C ★★☆☆☆', wood: 'B ★★★☆☆' },
    { key: 'weight',         label: t('estimar.comparison.weight'),         scip: `40% ${t('estimar.comparison.lighter')}`, masonry: 'Base', wood: `20% ${t('estimar.comparison.lighter')}` },
  ];

  return (
    <View style={styles.comparisonCard}>
      <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={24} />
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonTitle}>{t('estimar.comparison.title')}</Text>
        <Text style={styles.comparisonSubtitle}>{t('estimar.comparison.subtitle')}</Text>
      </View>
      <View style={styles.compTableHead}>
        <View style={styles.compRowLabel} />
        <View style={[styles.compColHead, styles.compColScip]}>
          <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={8} />
          <Text style={styles.compColHeadTextScip}>{t('estimar.comparison.scip')}</Text>
        </View>
        <View style={styles.compColHead}><Text style={styles.compColHeadText}>{t('estimar.comparison.masonry')}</Text></View>
        <View style={styles.compColHead}><Text style={styles.compColHeadText}>{t('estimar.comparison.woodFrame')}</Text></View>
      </View>
      {rows.map((row, idx) => (
        <View key={row.key} style={[styles.compTableRow, idx % 2 === 0 && styles.compTableRowAlt]}>
          <Text style={styles.compRowLabel}>{row.label}</Text>
          <View style={[styles.compCell, styles.compCellScip]}><Text style={styles.compCellTextScip}>{row.scip}</Text></View>
          <View style={styles.compCell}><Text style={styles.compCellText}>{row.masonry}</Text></View>
          <View style={styles.compCell}><Text style={styles.compCellText}>{row.wood}</Text></View>
        </View>
      ))}
      <View style={styles.compFooter}>
        <View style={styles.compFooterBadge}><Text style={styles.compFooterText}>30% {t('estimar.comparison.saveVsConv')}</Text></View>
        <View style={styles.compFooterBadge}><Text style={styles.compFooterText}>3× {t('estimar.comparison.faster')}</Text></View>
      </View>
    </View>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result, onSendToPartner }: { result: Result; onSendToPartner: () => void }) {
  const { t } = useLanguage();
  const cfg = LANG_CONFIG[result.lang];

  const displayArea = result.unit === 'sqft'
    ? `${(result.totalAreaM2 * SQ_FT_PER_M2).toFixed(1)} sq ft`
    : `${result.totalAreaM2} m²`;

  const costPerUnit = result.unit === 'sqft'
    ? result.costPerM2 / SQ_FT_PER_M2
    : result.costPerM2;
  const unitLabel = result.unit === 'sqft' ? 'sq ft' : 'm²';

  const fmtCurrency = (val: number) =>
    `${cfg.symbol} ${val.toLocaleString(cfg.locale, { maximumFractionDigits: 0 })}`;

  const handleSave = async () => {
    const msg =
      `ESTIMATIVA SCIP WORLD\n\n` +
      `Tipo: ${result.type}\n` +
      `Área: ${displayArea}\n` +
      `Custo por ${unitLabel}: ${cfg.symbol} ${costPerUnit.toFixed(2)}\n` +
      `Valor total estimado: ${fmtCurrency(result.totalCost)}\n` +
      `Tempo estimado: ${result.timeMonths} ${result.timeMonths === 1 ? 'mês' : 'meses'}\n` +
      `Painéis necessários: ${result.panels.toLocaleString(cfg.locale)}\n\n` +
      `Estimativa indicativa — fase estrutural apenas.\n` +
      `Gerado por SCIP WORLD`;
    try { await Share.share({ message: msg, title: 'Estimativa SCIP WORLD' }); } catch {}
  };

  const metrics = [
    { label: displayArea.includes('sq ft') ? 'Área total' : 'Área total',
      value: displayArea,
      ionicon: 'home-outline', color: Colors.blue },
    { label: `Custo por ${unitLabel}`,
      value: `${cfg.symbol} ${costPerUnit.toLocaleString(cfg.locale, { maximumFractionDigits: 2 })}`,
      ionicon: 'grid-outline', color: Colors.cyan },
    { label: 'Valor total estimado',
      value: fmtCurrency(result.totalCost),
      ionicon: 'cash-outline', color: Colors.amber, highlight: true },
    { label: 'Tempo médio de obra',
      value: `${result.timeMonths} ${result.timeMonths === 1 ? t('estimar.metrics.month') : t('estimar.metrics.months')}`,
      ionicon: 'time-outline', color: Colors.purple },
    { label: 'Qtd. de painéis SCIP',
      value: `${result.panels.toLocaleString(cfg.locale)} un.`,
      ionicon: 'layers-outline', color: '#00C48C' },
  ];

  return (
    <View style={styles.resultCard}>
      <Grad colors={['rgba(123,97,255,0.1)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={24} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.resultHeader}>
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>{t('estimar.estimateGenerated')}</Text>
        </View>
        <Text style={styles.resultType}>{result.type}</Text>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.metricItem,
              (m as any).highlight && styles.metricHighlight,
              idx === 2 && { width: '100%' },
            ]}
          >
            {(m as any).highlight && (
              <Grad colors={['rgba(123,97,255,0.15)', 'rgba(30,144,255,0.06)']} style={StyleSheet.absoluteFill} borderRadius={16} />
            )}
            <NeonIcon name={m.ionicon} color={m.color} size={15} />
            <Text style={[styles.metricValue, (m as any).highlight && styles.metricValueHighlight]}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Indicative disclaimer */}
      <View style={styles.indicativeNote}>
        <Grad colors={['rgba(47,107,255,0.08)', 'rgba(47,107,255,0.03)']} style={StyleSheet.absoluteFill} borderRadius={14} />
        <Ionicons name="information-circle-outline" size={16} color={Colors.blue} style={{ flexShrink: 0, marginTop: 1 }} />
        <Text style={styles.indicativeText}>
          <Text style={{ color: Colors.white, fontFamily: 'Inter_500Medium' }}>Estimativa indicativa. </Text>
          Os valores consideram apenas a fase estrutural (painéis SCIP, fundação e estrutura) e podem variar conforme a região, disponibilidade de materiais e empresa executora. Para uma estimativa precisa,{' '}
          <Text style={{ color: Colors.cyan }}>solicite um orçamento às empresas parceiras</Text>.
        </Text>
      </View>

      <TouchableOpacity style={styles.shareCTA} activeOpacity={0.85} onPress={onSendToPartner}>
        <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
        <Ionicons name="send-outline" size={18} color="#fff" />
        <Text style={styles.shareCTAText}>{t('estimar.sendToPartner')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
        <Ionicons name="share-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.saveBtnText}>{t('estimar.saveEstimate')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Estimativa Screen ────────────────────────────────────────────────────────
export default function EstimarScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Estimar'>>();
  const params = route.params;
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const lang = (language as LangKey) in LANG_CONFIG ? (language as LangKey) : 'pt';
  const cfg = LANG_CONFIG[lang];

  const [address, setAddress] = useState('');
  const [area, setArea] = useState(params?.initialArea ?? '');
  const [unit, setUnit] = useState<UnitType>(cfg.unit);
  const [floors, setFloors] = useState(params?.initialFloors ?? '1');

  // Sync unit with language changes
  useEffect(() => { setUnit(cfg.unit); }, [language]);

  const obraTypeLabels: string[] = t('obraTypeLabels');
  const translatedObraTypes = OBRA_TYPES.map((o, i) => ({ ...o, label: obraTypeLabels[i] ?? o.label }));
  const [selectedTypeValue, setSelectedTypeValue] = useState(params?.initialTypeValue ?? OBRA_TYPES[0].value);
  const selectedType = translatedObraTypes.find(o => o.value === selectedTypeValue) ?? translatedObraTypes[0];

  const [showDropdown, setShowDropdown] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [showMultiLead, setShowMultiLead] = useState(false);

  // Scroll refs
  const scrollRef = useRef<ScrollView>(null);
  const resultYRef = useRef<number>(0);


  const isValid = parseFloat(area) > 0;

  const getCostPerM2 = (type: typeof selectedType) => type.costs[lang] ?? type.costs.pt;

  const handleCalculate = () => {
    const areaNum = parseFloat(area) || 0;
    const floorsNum = parseInt(floors) || 1;
    if (areaNum <= 0) return;

    const areaInM2 = unit === 'sqft' ? areaNum / SQ_FT_PER_M2 : areaNum;
    const totalAreaM2 = Math.round(areaInM2 * floorsNum);
    const costPerM2 = getCostPerM2(selectedType);
    const totalCost = totalAreaM2 * costPerM2;
    const timeMonths = Math.max(1, Math.ceil(totalAreaM2 / 80));
    // ~0.55 painéis SCIP (1.22m × 2.44m) por m² de área construída,
    // estimando paredes externas + internas com altura padrão de 2.6m
    const panels = Math.ceil(totalAreaM2 * 0.55);

    setResult({ totalAreaM2, totalCost, costPerM2, timeMonths, panels, type: selectedType.label, unit, lang });

    // Auto-scroll to result after render
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: resultYRef.current - 16, animated: true });
    }, 180);
  };

  const displayUnitLabel = unit === 'sqft' ? 'sq ft' : 'm²';
  const previewAreaM2 = unit === 'sqft'
    ? (parseFloat(area) / SQ_FT_PER_M2) * parseInt(floors || '1')
    : parseFloat(area) * parseInt(floors || '1');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100, paddingTop: insets.top }]}
      >
        {/* ── Cover Hero ── */}
        <View style={styles.coverHero}>
          <Image source={HERO_IMAGE} style={{ width: SW, height: HERO_H }} resizeMode="stretch" />
          <Grad colors={['rgba(4,8,15,0.6)', 'rgba(4,8,15,0.05)', 'rgba(4,8,15,0.75)', Colors.bgDeep]} style={StyleSheet.absoluteFill} />
          <View style={[styles.coverTopBar, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.coverBadge}>
              <Text style={styles.coverBadgeText}>SCIP ESTIMATOR</Text>
            </View>
          </View>
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>{t('estimar.title')}</Text>
            <Text style={styles.coverSubtitle}>{t('estimar.subtitle')}</Text>
          </View>
        </View>

        {/* Header */}
        <View style={[styles.header, { marginTop: 16 }]}>
          <View style={styles.headerIcon}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={16} />
            <Ionicons name="calculator-outline" size={22} color={Colors.white} style={{ zIndex: 1 }} />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('estimar.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('estimar.subtitle')}</Text>
          </View>
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          {(t('estimar.chips') as unknown as string[]).map((label: string, idx: number) => (
            <View key={idx} style={styles.infoChip}>
              <Ionicons name="checkmark-outline" size={11} color="#00C48C" />
              <Text style={styles.infoChipText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Currency info badge */}
        <View style={styles.currencyBadge}>
          <Ionicons name="globe-outline" size={13} color={Colors.cyan} />
          <Text style={styles.currencyBadgeText}>
            Moeda: <Text style={{ color: Colors.white }}>{cfg.symbol} ({cfg.currency})</Text>
            {'  ·  '}
            Unidade: <Text style={{ color: Colors.white }}>{displayUnitLabel}</Text>
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={24} />
          <Text style={styles.formTitle}>{t('estimar.formTitle')}</Text>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <NeonIcon name="location-outline" color={Colors.blue} size={14} />
              <Text style={styles.fieldLabel}>{t('estimar.addressLabel')}</Text>
            </View>
            <View style={styles.fieldInput}>
              <TextInput style={styles.textInput} placeholder={t('estimar.addressPlaceholder')} placeholderTextColor={Colors.textDim} value={address} onChangeText={setAddress} returnKeyType="next" autoCapitalize="words" />
            </View>
          </View>

          {/* Area */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <NeonIcon name="expand-outline" color={Colors.cyan} size={14} />
              <Text style={styles.fieldLabel}>{t('estimar.areaLabel')}</Text>
            </View>
            <View style={styles.fieldInput}>
              <TextInput
                style={styles.textInput}
                placeholder={unit === 'm2' ? t('estimar.areaPlaceholder') : 'Ex: 1500'}
                placeholderTextColor={Colors.textDim}
                keyboardType="decimal-pad"
                value={area}
                onChangeText={setArea}
                returnKeyType="next"
              />
              <Text style={styles.fieldUnit}>{displayUnitLabel}</Text>
            </View>
          </View>

          {/* Floors */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <NeonIcon name="business-outline" color={Colors.purple} size={14} />
              <Text style={styles.fieldLabel}>{t('estimar.floorsLabel')}</Text>
            </View>
            <View style={styles.floorRow}>
              {['1', '2', '3', '4+'].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.floorBtn, floors === n && styles.floorBtnActive]}
                  onPress={() => setFloors(n.replace('+', ''))}
                  activeOpacity={0.8}
                >
                  {floors === n && <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={12} />}
                  <Text style={[styles.floorBtnText, floors === n && styles.floorBtnTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tipo de Obra — sem preço */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <NeonIcon name="construct-outline" color={Colors.amber} size={14} />
              <Text style={styles.fieldLabel}>{t('estimar.typeLabel')}</Text>
            </View>
            <TouchableOpacity style={styles.dropBtn} onPress={() => setShowDropdown(true)} activeOpacity={0.8}>
              <Text style={styles.dropBtnText}>{selectedType.label}</Text>
              <Ionicons name="chevron-down-outline" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.sep} />

          {/* CTA */}
          <TouchableOpacity
            style={[styles.calcBtn, !isValid && styles.calcBtnDisabled]}
            onPress={handleCalculate}
            activeOpacity={isValid ? 0.85 : 1}
          >
            <Grad colors={isValid ? Colors.gradients.tech : ['#0B1C3D', '#070D1A']} style={StyleSheet.absoluteFill} borderRadius={999} />
            <Ionicons name="flash-outline" size={18} color={isValid ? Colors.white : Colors.textDim} style={{ zIndex: 1 }} />
            <Text style={[styles.calcBtnText, !isValid && { opacity: 0.5 }]}>
              {isValid ? t('estimar.calculate') : t('estimar.fillArea')}
            </Text>
          </TouchableOpacity>

          {isValid && (
            <Text style={styles.previewText}>
              {t('estimar.previewArea')} {previewAreaM2.toFixed(1)} m²
            </Text>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Grad colors={['rgba(47,107,255,0.08)', 'rgba(47,107,255,0.03)']} style={StyleSheet.absoluteFill} borderRadius={20} />
          <View style={styles.tipsHeaderRow}>
            <NeonIcon name="bulb-outline" color={Colors.blue} size={15} />
            <Text style={styles.tipsTitle}>{t('estimar.tips.title')}</Text>
          </View>
          {(t('estimar.tips.items') as unknown as string[]).map((tip: string, idx: number) => (
            <View key={idx} style={styles.tipItem}>
              <View style={[styles.tipDot, { backgroundColor: Colors.blue }]} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Result — wrapper always rendered to capture layout Y */}
        <View onLayout={(e) => { resultYRef.current = e.nativeEvent.layout.y; }}>
          {result && (
            <ResultCard result={result} onSendToPartner={() => setShowMultiLead(true)} />
          )}
        </View>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico de Estimativas</Text>
          <View style={styles.historyEmpty}>
            <Ionicons name="document-text-outline" size={32} color={Colors.textDim} />
            <Text style={styles.historyEmptyText}>Suas estimativas salvas aparecerão aqui</Text>
          </View>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal visible={showDropdown} transparent animationType="slide" onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDropdown(false)}>
          <View style={styles.modalSheet}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('estimar.typeLabel')}</Text>
            <FlatList
              data={translatedObraTypes}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item.value === selectedType.value && styles.modalItemActive]}
                  onPress={() => { setSelectedTypeValue(item.value); setShowDropdown(false); setResult(null); }}
                >
                  <Text style={[styles.modalItemText, item.value === selectedType.value && { color: Colors.amber }]}>
                    {item.label}
                  </Text>
                  {item.value === selectedType.value && (
                    <View style={styles.modalCheckmark}>
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Multi-Lead Modal */}
      <MultiLeadModal
        visible={showMultiLead}
        onClose={() => setShowMultiLead(false)}
        result={result}
        user={user}
        initialAddress={address}
        initialArea={result ? String(result.totalAreaM2) : ''}
        initialProjectType={(t('estimar.modal.projectTypes') as string[])[mapObraToProjectTypeIndex(selectedTypeValue)]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  scrollContent: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  headerIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 21, color: Colors.white },
  headerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  infoStrip: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,196,140,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(0,196,140,0.2)' },
  infoChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#00C48C' },
  currencyBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(76,201,240,0.08)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(76,201,240,0.15)', paddingHorizontal: 12, paddingVertical: 7, marginBottom: 14, alignSelf: 'flex-start' },
  currencyBadgeText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  formCard: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 16, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 }, android: { elevation: 10 } }) },
  formTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  fieldInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, height: 52 },
  textInput: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, padding: 0 },
  fieldUnit: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.amber },
  floorRow: { flexDirection: 'row', gap: 8 },
  floorBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  floorBtnActive: { borderColor: Colors.purple },
  floorBtnText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.textMuted, zIndex: 1 },
  floorBtnTextActive: { color: Colors.white },
  dropBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 16, height: 52 },
  dropBtnText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },
  sep: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 16 },
  calcBtn: { height: 52, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden' },
  calcBtnDisabled: {},
  calcBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, zIndex: 1 },
  previewText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textDim, textAlign: 'center', marginTop: 10 },
  tipsCard: { borderRadius: 20, padding: 18, borderWidth: 1, borderColor: 'rgba(47,107,255,0.15)', overflow: 'hidden', marginBottom: 16, gap: 8 },
  tipsHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tipsTitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipDot: { width: 5, height: 5, borderRadius: 3, marginTop: 6, flexShrink: 0 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, flex: 1, lineHeight: 20 },
  // Result Card
  resultCard: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(123,97,255,0.2)', overflow: 'hidden', marginBottom: 16 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  resultBadge: { backgroundColor: 'rgba(0,196,140,0.15)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(0,196,140,0.25)' },
  resultBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#00C48C', letterSpacing: 1 },
  resultType: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textMuted },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metricItem: { width: '47%', borderRadius: 16, padding: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', gap: 6 },
  metricHighlight: { borderColor: 'rgba(123,97,255,0.25)', width: '100%' },
  metricValue: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },
  metricValueHighlight: { fontSize: 18, color: Colors.amber, fontFamily: 'Inter_700Bold' },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  indicativeNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(47,107,255,0.2)', padding: 14, marginBottom: 16, overflow: 'hidden' },
  indicativeText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 19 },
  shareCTA: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden', marginBottom: 10 },
  shareCTAText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, zIndex: 1 },
  saveBtn: { height: 44, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  saveBtnText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted },
  // Comparison Table
  comparisonCard: { borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 16 },
  comparisonHeader: { marginBottom: 16 },
  comparisonTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 4 },
  comparisonSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  compTableHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  compColHead: { flex: 1, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)' },
  compColScip: { backgroundColor: 'transparent' },
  compColHeadText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  compColHeadTextScip: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.white, zIndex: 1, textAlign: 'center' },
  compTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 4, borderRadius: 8 },
  compTableRowAlt: { backgroundColor: 'rgba(255,255,255,0.02)' },
  compRowLabel: { flex: 1.2, fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted, paddingLeft: 4 },
  compCell: { flex: 1, alignItems: 'center' },
  compCellScip: {},
  compCellText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, textAlign: 'center' },
  compCellTextScip: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.amber, textAlign: 'center' },
  compFooter: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  compFooterBadge: { backgroundColor: 'rgba(0,196,140,0.1)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(0,196,140,0.2)' },
  compFooterText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#00C48C' },
  // History
  historySection: { marginBottom: 16 },
  historyTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 12 },
  historyEmpty: { alignItems: 'center', padding: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderStyle: 'dashed', gap: 10 },
  historyEmptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textDim, textAlign: 'center' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 12 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, marginBottom: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)' },
  modalItemActive: { borderColor: 'rgba(123,97,255,0.25)', backgroundColor: 'rgba(123,97,255,0.06)' },
  modalItemText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },
  modalCheckmark: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.purple, alignItems: 'center', justifyContent: 'center' },
  coverHero: { width: SW, height: HERO_H, marginHorizontal: -16, overflow: 'hidden' },
  coverTopBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(4,8,15,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  coverContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, gap: 6 },
  coverBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(123,97,255,0.3)', borderWidth: 1, borderColor: Colors.purple, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  coverBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.purple, letterSpacing: 1.2 },
  coverTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.white, letterSpacing: 0.3 },
  coverSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.65)' },
});
