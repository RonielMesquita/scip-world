import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  TextInput, Image, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from './Grad';
import Colors from '../constants/colors';
import { supabase } from '../lib/supabase';
import { User } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  user: User | null;
  mode?: 'orcamento' | 'consulta';
}

export default function LeadFormModal({ visible, onClose, companyId, companyName, user, mode = 'orcamento' }: Props) {
  const isConsulta = mode === 'consulta';
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const projectTypes: string[]  = t('estimar.modal.projectTypes');
  const consultTypes: string[]  = t('leadForm.consultTypes');

  const [name,        setName]        = useState(user?.name ?? '');
  const [phone,       setPhone]       = useState(user?.phone ?? '');
  const [email,       setEmail]       = useState(user?.email ?? '');
  const [projectType, setProjectType] = useState(isConsulta ? consultTypes[0] : projectTypes[0]);
  const [showTypes,   setShowTypes]   = useState(false);
  const [city,        setCity]        = useState(user?.location ?? '');
  const [area,        setArea]        = useState('');
  const [deadline,    setDeadline]    = useState('');
  const [description, setDescription] = useState('');
  const [photos,      setPhotos]      = useState<string[]>([]);
  const [loading,     setLoading]     = useState(false);

  const pickPhoto = async () => {
    if (photos.length >= 3) { Alert.alert(t('estimar.modal.alertLimit'), t('estimar.modal.alertLimitDesc')); return; }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('estimar.modal.alertPermRequired'), t('estimar.modal.alertPermDesc')); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!name.trim())  { Alert.alert(t('estimar.modal.alertNameRequired'), t('estimar.modal.alertNameDesc')); return; }
    if (!phone.trim()) { Alert.alert(t('estimar.modal.alertPhoneRequired'), t('estimar.modal.alertPhoneDesc')); return; }
    if (!description.trim()) { Alert.alert(t('estimar.modal.alertDescRequired'), t('estimar.modal.alertDescDesc')); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert({
        company_id:   companyId,
        company_name: companyName,
        user_name:    name.trim(),
        user_phone:   phone.trim(),
        user_email:   email.trim() || null,
        project_type: projectType,
        city:         city.trim() || null,
        area_m2:      isConsulta ? null : (area.trim() || null),
        deadline:     deadline.trim() || null,
        description:  description.trim(),
        photos:       photos.length > 0 ? photos : null,
        status:       'new',
        unlocked:     false,
      } as any);

      if (error) throw error;

      const successTitle = isConsulta ? t('leadForm.successConsult') : t('leadForm.successQuote');
      const successType  = isConsulta ? t('leadForm.successTypeConsult') : t('leadForm.successTypeQuote');
      const successMsg   = t('leadForm.successMsg').replace('{type}', successType).replace('{name}', companyName);
      Alert.alert(successTitle, successMsg, [{ text: 'OK', onPress: handleClose }]);
    } catch (err: any) {
      Alert.alert(t('estimar.modal.alertError'), err?.message ?? t('leadForm.errorSend'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(user?.name ?? '');
    setPhone(user?.phone ?? '');
    setEmail(user?.email ?? '');
    setProjectType(isConsulta ? consultTypes[0] : projectTypes[0]);
    setCity(user?.location ?? '');
    setArea('');
    setDeadline('');
    setDescription('');
    setPhotos([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={28} />

                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleClose} style={styles.headerBtn} activeOpacity={0.7}>
                    <Text style={styles.cancelText}>{t('estimar.modal.cancel')}</Text>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.headerTitle}>{isConsulta ? t('leadForm.titleConsult') : t('leadForm.titleQuote')}</Text>
                    <Text style={styles.headerSub}>{companyName}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleSend}
                    style={[styles.sendBtn, (!name.trim() || !phone.trim() || !description.trim()) && styles.sendBtnDisabled]}
                    activeOpacity={0.85}
                    disabled={loading || !name.trim() || !phone.trim() || !description.trim()}
                  >
                    {loading
                      ? <ActivityIndicator size="small" color={Colors.white} />
                      : <Text style={styles.sendBtnText}>{t('estimar.modal.send')}</Text>
                    }
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                  {/* Info banner */}
                  <View style={styles.infoBanner}>
                    <Grad colors={['rgba(76,201,240,0.08)', 'rgba(123,97,255,0.06)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                    <Ionicons name="shield-checkmark-outline" size={16} color={Colors.cyan} />
                    <Text style={styles.infoText}>
                      {isConsulta ? t('leadForm.dataProtectedConsult') : t('leadForm.dataProtectedCompany')}
                    </Text>
                  </View>

                  {/* Dados pessoais */}
                  <Text style={styles.sectionLabel}>{t('estimar.modal.yourData')}</Text>

                  <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{t('estimar.modal.fullName')} *</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder={t('estimar.modal.namePlaceholder')}
                      placeholderTextColor={Colors.textFaded}
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.fieldWrap, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>{t('estimar.modal.phone')} *</Text>
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder={t('estimar.modal.phonePlaceholder')}
                        placeholderTextColor={Colors.textFaded}
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>
                    <View style={[styles.fieldWrap, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>{t('estimar.modal.emailOptional')}</Text>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('estimar.modal.optional')}
                        placeholderTextColor={Colors.textFaded}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  {/* Projeto */}
                  <Text style={[styles.sectionLabel, { marginTop: 20 }]}>{t('estimar.modal.yourProject')}</Text>

                  {/* Tipo */}
                  <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{isConsulta ? t('leadForm.typeConsult') : t('estimar.modal.projectType')}</Text>
                    <TouchableOpacity
                      style={styles.select}
                      activeOpacity={0.8}
                      onPress={() => { Keyboard.dismiss(); setShowTypes((v) => !v); }}
                    >
                      <Text style={styles.selectValue}>{projectType}</Text>
                      <Ionicons name={showTypes ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textFaded} />
                    </TouchableOpacity>
                    {showTypes && (
                      <View style={styles.dropdown}>
                        <Grad colors={['#0D1F42', '#07111F']} style={StyleSheet.absoluteFill} borderRadius={12} />
                        {(isConsulta ? consultTypes : projectTypes).map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={[styles.dropdownItem, type === projectType && styles.dropdownItemActive]}
                            onPress={() => { setProjectType(type); setShowTypes(false); }}
                            activeOpacity={0.8}
                          >
                            {type === projectType && <Grad colors={Colors.gradients.cyan} style={StyleSheet.absoluteFill} borderRadius={8} />}
                            <Text style={[styles.dropdownText, type === projectType && { color: Colors.white }]}>{type}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.row}>
                    <View style={[styles.fieldWrap, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>{t('estimar.modal.city')}</Text>
                      <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder={t('estimar.modal.cityPlaceholder')}
                        placeholderTextColor={Colors.textFaded}
                        returnKeyType="next"
                      />
                    </View>
                    {!isConsulta && <View style={[styles.fieldWrap, { flex: 1 }]}>
                      <Text style={styles.fieldLabel}>{t('estimar.modal.area')}</Text>
                      <TextInput
                        style={styles.input}
                        value={area}
                        onChangeText={setArea}
                        placeholder={t('estimar.modal.areaPlaceholder')}
                        placeholderTextColor={Colors.textFaded}
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                      />
                    </View>}
                  </View>

                  <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{t('estimar.modal.deadline')}</Text>
                    <TextInput
                      style={styles.input}
                      value={deadline}
                      onChangeText={setDeadline}
                      placeholder={t('estimar.modal.deadlinePlaceholder')}
                      placeholderTextColor={Colors.textFaded}
                      returnKeyType="next"
                    />
                  </View>

                  <View style={styles.fieldWrap}>
                    <Text style={styles.fieldLabel}>{t('estimar.modal.description')} *</Text>
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      value={description}
                      onChangeText={(v) => v.length <= 500 && setDescription(v)}
                      placeholder={t('estimar.modal.descPlaceholder')}
                      placeholderTextColor={Colors.textFaded}
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                    />
                    <Text style={styles.charCount}>{description.length}/500</Text>
                  </View>

                  {/* Fotos */}
                  <Text style={[styles.sectionLabel, { marginTop: 8 }]}>{t('estimar.modal.photos')}</Text>
                  <View style={styles.photosRow}>
                    {photos.map((uri, i) => (
                      <View key={i} style={styles.photoThumb}>
                        <Image source={{ uri }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                        <TouchableOpacity style={styles.photoRemove} onPress={() => removePhoto(i)} activeOpacity={0.8}>
                          <Ionicons name="close-circle" size={20} color={Colors.white} />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {photos.length < 3 && (
                      <TouchableOpacity style={styles.photoAdd} onPress={pickPhoto} activeOpacity={0.8}>
                        <Grad colors={['rgba(76,201,240,0.1)', 'rgba(123,97,255,0.08)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                        <Ionicons name="camera-outline" size={22} color={Colors.cyan} />
                        <Text style={styles.photoAddText}>{t('estimar.modal.addPhoto')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{ height: 16 }} />
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,8,15,0.8)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.12)',
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: 'hidden',
    maxHeight: '94%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center', marginBottom: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBtn: { padding: 4, minWidth: 64 },
  cancelText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.white,
    textAlign: 'center',
  },
  headerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
    textAlign: 'center',
    marginTop: 2,
  },
  sendBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 64,
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: 'rgba(76,201,240,0.25)' },
  sendBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.white,
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.15)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  infoText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.textFaded,
    letterSpacing: 1,
    marginBottom: 12,
  },

  fieldWrap: { marginBottom: 12 },
  fieldLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  textarea: {
    minHeight: 100,
    paddingTop: 12,
    lineHeight: 21,
  },
  charCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
    textAlign: 'right',
    marginTop: 4,
  },

  row: { flexDirection: 'row', gap: 10 },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  selectValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.15)',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    overflow: 'hidden',
  },
  dropdownItemActive: {},
  dropdownText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },

  photosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  photoThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  photoAdd: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(76,201,240,0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  photoAddText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.cyan,
  },
});
