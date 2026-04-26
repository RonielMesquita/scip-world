import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  ImageBackground,
  Image,
  Modal,
  TextInput,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWatchHistory } from '../contexts/WatchHistoryContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, LANGUAGE_LABELS } from '../i18n/translations';

// ─── Become Pro Modal ─────────────────────────────────────────────────────────
const PRO_ROLES = [
  { label: 'Empresa de Construção',    ionicon: 'business-outline',       color: Colors.cyan   },
  { label: 'Fábrica de Painéis',       ionicon: 'hardware-chip-outline',  color: Colors.blue   },
  { label: 'Engenheiro Civil',         ionicon: 'construct-outline',      color: Colors.purple },
  { label: 'Arquiteto',                ionicon: 'compass-outline',        color: Colors.amber  },
  { label: 'Construtor',               ionicon: 'hammer-outline',         color: Colors.cyan   },
  { label: 'Consultor / Especialista', ionicon: 'bulb-outline',           color: '#FF6B00'     },
];

function BecomeProModal({
  visible, onClose, onSave,
}: { visible: boolean; onClose: () => void; onSave: (data: any) => void }) {
  const navigation = useNavigation<any>();
  const { t } = useLanguage();
  const [businessName, setBusinessName] = useState('');
  const [whatsapp, setWhatsapp]         = useState('');
  const [city, setCity]                 = useState('');
  const [proRole, setProRole]           = useState(PRO_ROLES[0].label);
  const [showRoles, setShowRoles]       = useState(false);

  const handleSave = () => {
    if (businessName.trim().length < 2) { Alert.alert('Erro', 'Informe o nome do negócio.'); return; }
    const params = {
      initialName:  businessName.trim(),
      initialRole:  proRole,
      initialCity:  city.trim(),
      initialPhone: whatsapp.trim(),
    };
    onSave({ role: proRole, location: city });
    onClose();
    // aguarda o modal fechar antes de navegar
    setTimeout(() => navigation.navigate('BusinessSetup', params), 350);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={[modal.sheet, { paddingBottom: 40 }]}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
          <View style={modal.handle} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <View style={proModal.badge}>
              <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={10} />
              <Ionicons name="rocket-outline" size={22} color="#04080F" />
            </View>
            <View>
              <Text style={modal.title}>{t('profile.proModal.title')}</Text>
              <Text style={[modal.subtitle, { marginBottom: 0 }]}>{t('profile.proModal.subtitle')}</Text>
            </View>
          </View>

          {/* Tipo de negócio */}
          <View style={modal.fieldGroup}>
            <Text style={modal.fieldLabel}>{t('profile.proModal.profileType')}</Text>
            <TouchableOpacity
              style={modal.inputWrap}
              onPress={() => setShowRoles(!showRoles)}
              activeOpacity={0.8}
            >
              {(() => {
                const selected = PRO_ROLES.find(r => r.label === proRole) ?? PRO_ROLES[0];
                return (
                  <View style={[modal.iconBox, { backgroundColor: selected.color + '18' }]}>
                    <Ionicons name={selected.ionicon as any} size={15} color={selected.color} />
                  </View>
                );
              })()}
              <Text style={[modal.input, { color: Colors.white }]}>{proRole}</Text>
              <Ionicons name={showRoles ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.textDim} />
            </TouchableOpacity>
            {showRoles && (
              <View style={proModal.dropdown}>
                <Grad colors={['rgba(11,28,61,0.99)', 'rgba(4,8,15,0.99)']} style={StyleSheet.absoluteFill} borderRadius={14} />
                {PRO_ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.label}
                    style={proModal.roleOption}
                    onPress={() => { setProRole(r.label); setShowRoles(false); }}
                    activeOpacity={0.8}
                  >
                    <View style={[proModal.roleIconBox, { backgroundColor: r.color + '18' }]}>
                      <Ionicons name={r.ionicon as any} size={14} color={r.color} />
                    </View>
                    <Text style={[proModal.roleText, proRole === r.label && { color: Colors.amber }]}>{r.label}</Text>
                    {proRole === r.label && <Ionicons name="checkmark" size={14} color={Colors.amber} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {[
            { label: t('profile.proModal.businessName'),    ionicon: 'business-outline',  color: Colors.cyan,   value: businessName, onChange: setBusinessName, placeholder: t('profile.proModal.businessNamePlaceholder') },
            { label: t('profile.proModal.whatsapp'), ionicon: 'logo-whatsapp',     color: '#25D366',     value: whatsapp,     onChange: setWhatsapp,     placeholder: t('profile.proModal.whatsappPlaceholder'), kb: 'phone-pad' },
            { label: t('profile.proModal.cityState'),    ionicon: 'location-outline',  color: Colors.purple, value: city,         onChange: setCity,         placeholder: t('profile.proModal.cityStatePlaceholder') },
          ].map((f) => (
            <View key={f.label} style={modal.fieldGroup}>
              <Text style={modal.fieldLabel}>{f.label}</Text>
              <View style={modal.inputWrap}>
                <View style={[modal.iconBox, { backgroundColor: f.color + '18' }]}>
                  <Ionicons name={f.ionicon as any} size={15} color={f.color} />
                </View>
                <TextInput
                  style={modal.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textFaded}
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType={(f as any).kb}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={[modal.saveBtn, { marginTop: 8 }]} onPress={handleSave} activeOpacity={0.88}>
            <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={modal.saveBtnText}>{t('profile.proModal.activate')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modal.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={modal.cancelText}>{t('profile.proModal.later')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const proModal = StyleSheet.create({
  badge: {
    width: 44, height: 44, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  dropdown: {
    borderRadius: 14, overflow: 'hidden', marginTop: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  roleOption: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  roleIconBox: {
    width: 28, height: 28, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  roleText: {
    flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14,
    color: Colors.white, zIndex: 1,
  },
});

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({
  visible, onClose, user, onSave,
}: {
  visible: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => void;
}) {
  const [name, setName]         = useState(user?.name ?? '');
  const [phone, setPhone]       = useState(user?.phone ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [role, setRole]         = useState(user?.role ?? '');

  const handleSave = () => {
    if (name.trim().length < 2) { Alert.alert('Erro', 'Informe um nome válido.'); return; }
    const firstName = name.trim().split(' ')[0];
    const avatarInitial = name.trim().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
    onSave({ name: name.trim(), firstName, phone, location, role, avatarInitial });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />

          <View style={modal.handle} />
          <Text style={modal.title}>Editar Perfil</Text>

          {[
            { label: 'Nome completo', ionicon: 'person-outline',   color: Colors.cyan,   value: name,     onChange: setName,     placeholder: 'Seu nome' },
            { label: 'Telefone',      ionicon: 'call-outline',      color: Colors.blue,   value: phone,    onChange: setPhone,    placeholder: '+55 11 99999-0000', keyboardType: 'phone-pad' },
            { label: 'Localização',   ionicon: 'location-outline',  color: Colors.purple, value: location, onChange: setLocation, placeholder: 'Cidade, Estado' },
            { label: 'Cargo / Função',ionicon: 'briefcase-outline', color: Colors.amber,  value: role,     onChange: setRole,     placeholder: 'Ex: Engenheiro Civil' },
          ].map((f) => (
            <View key={f.label} style={modal.fieldGroup}>
              <Text style={modal.fieldLabel}>{f.label}</Text>
              <View style={modal.inputWrap}>
                <View style={[modal.iconBox, { backgroundColor: f.color + '18' }]}>
                  <Ionicons name={f.ionicon as any} size={15} color={f.color} />
                </View>
                <TextInput
                  style={modal.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.textFaded}
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType={(f as any).keyboardType}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={modal.saveBtn} onPress={handleSave} activeOpacity={0.88}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={modal.saveBtnText}>Salvar alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modal.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={modal.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Notifications Modal ──────────────────────────────────────────────────────
function NotificationsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [notifs, setNotifs] = useState({
    novasObras: true,
    novosEspecialistas: true,
    cursos: false,
    ofertas: true,
    mensagens: true,
  });

  const items = [
    { key: 'novasObras',         label: 'Novas obras na plataforma', ionicon: 'construct-outline',      color: Colors.cyan   },
    { key: 'novosEspecialistas', label: 'Especialistas disponíveis',  ionicon: 'person-add-outline',    color: Colors.blue   },
    { key: 'cursos',             label: 'Novos cursos e vídeos',      ionicon: 'play-circle-outline',   color: Colors.purple },
    { key: 'ofertas',            label: 'Ofertas de empresas',        ionicon: 'briefcase-outline',     color: Colors.amber  },
    { key: 'mensagens',          label: 'Mensagens e respostas',      ionicon: 'chatbubble-outline',    color: Colors.cyan   },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
          <View style={modal.handle} />
          <Text style={modal.title}>Notificações</Text>
          <Text style={modal.subtitle}>Escolha o que deseja receber</Text>

          {items.map((item, i) => (
            <View key={item.key} style={[modal.notifRow, i < items.length - 1 && modal.notifRowBorder]}>
              <View style={[modal.iconBox, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.ionicon as any} size={16} color={item.color} />
              </View>
              <Text style={modal.notifLabel}>{item.label}</Text>
              <Switch
                value={(notifs as any)[item.key]}
                onValueChange={(v) => setNotifs((prev) => ({ ...prev, [item.key]: v }))}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: Colors.purple + '80' }}
                thumbColor={(notifs as any)[item.key] ? Colors.purple : Colors.textDim}
              />
            </View>
          ))}

          <TouchableOpacity style={modal.saveBtn} onPress={onClose} activeOpacity={0.88}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={modal.saveBtnText}>Salvar preferências</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Privacy Modal ────────────────────────────────────────────────────────────
function PrivacyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
          <View style={modal.handle} />
          <Text style={modal.title}>Privacidade e Segurança</Text>

          {[
            { ionicon: 'lock-closed-outline',       color: Colors.cyan,   title: 'Seus dados são seus',       desc: 'A SCIP WORLD nunca vende ou compartilha suas informações pessoais com terceiros.' },
            { ionicon: 'shield-checkmark-outline',  color: Colors.blue,   title: 'Dados criptografados',      desc: 'Todas as informações são armazenadas com criptografia de ponta a ponta.' },
            { ionicon: 'mail-outline',              color: Colors.purple, title: 'Controle de comunicação',  desc: 'Você pode cancelar qualquer comunicação por e-mail a qualquer momento.' },
            { ionicon: 'trash-outline',             color: '#FF4D4D',     title: 'Exclusão de conta',         desc: 'Você pode solicitar a exclusão completa de seus dados a qualquer momento.' },
          ].map((item) => (
            <View key={item.title} style={modal.privacyItem}>
              <View style={[modal.iconBox, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.ionicon as any} size={17} color={item.color} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={modal.privacyTitle}>{item.title}</Text>
                <Text style={modal.privacyDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[modal.saveBtn, { marginTop: 8 }]}
            onPress={() => Linking.openURL('https://scipworld.com/privacidade')}
            activeOpacity={0.88}
          >
            <Grad colors={['rgba(123,97,255,0.2)', 'rgba(123,97,255,0.08)']} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={[modal.saveBtnText, { color: Colors.purple }]}>Ver Política de Privacidade completa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modal.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={modal.cancelText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Help Modal ───────────────────────────────────────────────────────────────
function HelpModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const faqs: { q: string; a: string }[] = t('profile.helpFaqs');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
          <View style={modal.handle} />
          <Text style={modal.title}>{t('profile.help')}</Text>

          {faqs.map((item, i) => (
            <View key={i} style={modal.helpItem}>
              <Text style={modal.helpQ}>{item.q}</Text>
              <Text style={modal.helpA}>{item.a}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={modal.saveBtn}
            onPress={() => Linking.openURL('mailto:suporte@scipworld.com')}
            activeOpacity={0.88}
          >
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Text style={modal.saveBtnText}>Contatar suporte →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modal.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={modal.cancelText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── About Modal ──────────────────────────────────────────────────────────────
function AboutModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[modal.overlay, { justifyContent: 'center' }]}>
        <View style={[modal.sheet, { borderRadius: 24 }]}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />

          <View style={modal.aboutLogo}>
            <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={16} />
            <Text style={modal.aboutLogoText}>S</Text>
          </View>

          <Text style={modal.aboutAppName}>SCIP WORLD</Text>
          <Text style={modal.aboutVersion}>Versão 1.0.0</Text>

          {[
            { label: 'Plataforma', value: 'React Native / Expo' },
            { label: 'Build',      value: '2026.04' },
            { label: 'Suporte',    value: 'suporte@scipworld.com' },
            { label: 'Website',    value: 'scipworld.com' },
          ].map((row) => (
            <View key={row.label} style={modal.aboutRow}>
              <Text style={modal.aboutRowLabel}>{row.label}</Text>
              <Text style={modal.aboutRowValue}>{row.value}</Text>
            </View>
          ))}

          <Text style={modal.aboutCopy}>© 2026 SCIP WORLD. Todos os direitos reservados.</Text>

          <TouchableOpacity style={modal.cancelBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={modal.cancelText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Company Dashboard ────────────────────────────────────────────────────────
function CompanyDashboard({ insets, navigation, myCompany, myProjects, updateCompany, removeProject, user, logout, t, language, setLanguage }: any) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifModal,  setShowNotifModal]  = useState(false);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [showLangModal,   setShowLangModal]   = useState(false);
  const { LANGUAGE_LABELS: LL } = require('../i18n/translations');
  const LANGS = ['pt', 'en', 'es'];

  // Simula visitas crescendo
  const visits = (myCompany.profileViews ?? 0) + 47;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      {/* Back */}
      <TouchableOpacity style={[styles.backBtn, { top: insets.top + 8 }]} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>

        {/* ── Cover + Logo ── */}
        <View style={styles.coverSection}>
          <ImageBackground source={{ uri: myCompany.coverImage }} style={[styles.cover, { paddingTop: insets.top }]} resizeMode="cover">
            <Grad colors={['transparent', 'rgba(7,11,22,0.92)']} style={StyleSheet.absoluteFill} />
          </ImageBackground>

          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: myCompany.logoColor + '22', borderColor: myCompany.logoColor, borderRadius: 18 }]}>
              {myCompany.logoImage
                ? <Image source={{ uri: myCompany.logoImage }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
                : (
                  <>
                    <Grad colors={[myCompany.logoColor + 'CC', myCompany.logoColor + '88']} style={StyleSheet.absoluteFill} borderRadius={18} />
                    <Text style={[styles.avatarText, { color: Colors.white }]}>{myCompany.logoInitial}</Text>
                  </>
                )
              }
            </View>
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8} onPress={() => setShowEditCompany(true)}>
              <Ionicons name="pencil" size={11} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.nameSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.userName}>{myCompany.name}</Text>
              {myCompany.verified && (
                <View style={cd.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.cyan} />
                </View>
              )}
            </View>
            <Text style={styles.userRole}>{myCompany.category}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <Ionicons name="location-outline" size={11} color={Colors.textDim} />
              <Text style={styles.memberSince}>{myCompany.location}</Text>
            </View>
          </View>

          {/* Edit + Public */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity style={[styles.editBtn, { flex: 1 }]} activeOpacity={0.85} onPress={() => setShowEditCompany(true)}>
              <Grad colors={['rgba(123,97,255,0.15)', 'rgba(255,85,0,0.08)']} style={StyleSheet.absoluteFill} borderRadius={999} />
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editBtn, { flex: 1 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('EmpresaProfile', { company: myCompany })}
            >
              <Grad colors={['rgba(10,132,255,0.12)', 'rgba(10,132,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={999} />
              <Text style={[styles.editBtnText, { color: Colors.cyan }]}>Ver público</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {[
            { value: visits,              label: 'Visitas',   ionicon: 'eye-outline',       color: Colors.cyan   },
            { value: myProjects.length,   label: 'Projetos',  ionicon: 'images-outline',    color: Colors.purple },
            { value: myCompany.reviewCount || 0, label: 'Avaliações', ionicon: 'star-outline', color: Colors.amber },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={16} />
              <View style={[cd.statIcon, { backgroundColor: s.color + '18' }]}>
                <Ionicons name={s.ionicon as any} size={14} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Serviços ── */}
        {myCompany.services?.length > 0 && (
          <View style={[styles.section, { marginTop: 16 }]}>
            <Text style={styles.sectionTitle}>SERVIÇOS</Text>
            <View style={cd.servicesWrap}>
              {myCompany.services.map((sv: string) => (
                <View key={sv} style={cd.serviceChip}>
                  <Text style={cd.serviceChipText}>{sv}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Projetos ── */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>PROJETOS</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BusinessSetup', {
              initialName: myCompany.name,
              initialRole: myCompany.category,
              initialCity: myCompany.location,
              initialPhone: myCompany.phone,
            })}>
              <Text style={styles.clearHistory}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          {myProjects.length === 0 ? (
            <TouchableOpacity
              style={cd.emptyProjects}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('BusinessSetup', {
                initialName: myCompany.name, initialRole: myCompany.category,
              })}
            >
              <Grad colors={['rgba(10,132,255,0.07)', 'rgba(123,97,255,0.04)']} style={StyleSheet.absoluteFill} borderRadius={16} />
              <Ionicons name="images-outline" size={28} color={Colors.textDim} />
              <Text style={cd.emptyProjectsText}>Adicione fotos dos seus projetos</Text>
              <Text style={cd.emptyProjectsSub}>Clientes buscam portfólio antes de contratar</Text>
            </TouchableOpacity>
          ) : (
            <View style={cd.projectsGrid}>
              {myProjects.map((proj: any) => (
                <View key={proj.id} style={cd.projectCard}>
                  <ImageBackground source={{ uri: proj.image }} style={cd.projectImg} resizeMode="cover" imageStyle={{ borderRadius: 14 }}>
                    <Grad colors={['rgba(4,8,15,0)', 'rgba(4,8,15,0.8)']} style={StyleSheet.absoluteFill} />
                    <TouchableOpacity style={cd.projectRemove} onPress={() => removeProject(proj.id)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
                      <Ionicons name="close-circle" size={20} color="rgba(255,77,77,0.9)" />
                    </TouchableOpacity>
                    <View style={cd.projectInfo}>
                      <Text style={cd.projectTitle} numberOfLines={1}>{proj.title}</Text>
                      {proj.area ? <Text style={cd.projectArea}>{proj.area}</Text> : null}
                    </View>
                  </ImageBackground>
                  {proj.description ? <Text style={cd.projectDesc} numberOfLines={2}>{proj.description}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Configurações simplificadas ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
          <View style={styles.infoCard}>
            <Grad colors={['rgba(11,28,61,0.98)', 'rgba(12,18,32,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
            {[
              { ionicon: 'globe-outline',         color: Colors.cyan,   label: 'Idioma',         value: LL[language]?.split(' ')[1], onPress: () => setShowLangModal(true) },
              { ionicon: 'notifications-outline', color: Colors.purple, label: 'Notificações',    value: '', onPress: () => setShowNotifModal(true) },
            ].map((item, i, arr) => (
              <TouchableOpacity key={i} style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]} onPress={item.onPress} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.ionicon as any} size={15} color={item.color} />
                </View>
                <View style={styles.infoContent}><Text style={styles.infoValue}>{item.label}</Text></View>
                <Text style={styles.settingsValue}>{item.value}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)} activeOpacity={0.85}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Company Modal */}
      <EditProfileModal
        visible={showEditCompany}
        onClose={() => setShowEditCompany(false)}
        user={{ name: myCompany.name, phone: myCompany.phone, location: myCompany.location, role: myCompany.category }}
        onSave={(data: any) => updateCompany({ name: data.name, phone: data.phone, location: data.location, category: data.role })}
      />

      <NotificationsModal visible={showNotifModal} onClose={() => setShowNotifModal(false)} />

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <Text style={styles.logoutModalTitle}>Sair da conta?</Text>
            <TouchableOpacity style={styles.logoutConfirmBtn} onPress={logout} activeOpacity={0.85}>
              <Grad colors={['rgba(255,77,77,0.2)', 'rgba(255,77,77,0.1)']} style={StyleSheet.absoluteFill} borderRadius={14} />
              <Text style={styles.logoutConfirmText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutCancelBtn} onPress={() => setShowLogoutModal(false)} activeOpacity={0.8}>
              <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={14} />
              <Text style={styles.logoutCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="fade" onRequestClose={() => setShowLangModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={styles.langModal}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <Text style={styles.langModalTitle}>Idioma</Text>
            {LANGS.map((lang: string) => (
              <TouchableOpacity key={lang} style={[styles.langOption, language === lang && styles.langOptionActive]}
                onPress={() => { setLanguage(lang); setShowLangModal(false); }} activeOpacity={0.8}>
                {language === lang && <Grad colors={['rgba(123,97,255,0.15)', 'rgba(123,97,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={12} />}
                <Text style={styles.langOptionText}>{LL[lang]}</Text>
                {language === lang && <Text style={styles.langCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const cd = StyleSheet.create({
  verifiedBadge: { marginTop: 2 },
  statIcon:      { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  servicesWrap:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  serviceChip:   { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  serviceChipText:{ fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  emptyProjects: { height: 110, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed' },
  emptyProjectsText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.textMuted },
  emptyProjectsSub:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim },
  projectsGrid:  { gap: 12 },
  projectCard:   {},
  projectImg:    { height: 160, borderRadius: 14, justifyContent: 'flex-end', padding: 12, overflow: 'hidden' },
  projectRemove: { position: 'absolute', top: 8, right: 8 },
  projectInfo:   { gap: 2 },
  projectTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
  projectArea:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  projectDesc:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginTop: 6, lineHeight: 17 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, logout, updateUser, myCompany, myProjects, updateCompany, removeProject } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { history, clearHistory } = useWatchHistory();

  // Modo empresa
  if (myCompany) {
    return (
      <CompanyDashboard
        insets={insets}
        navigation={navigation}
        myCompany={myCompany}
        myProjects={myProjects}
        updateCompany={updateCompany}
        removeProject={removeProject}
        user={user}
        logout={logout}
        t={t}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  const [showLogoutModal,  setShowLogoutModal]  = useState(false);
  const [showLangModal,    setShowLangModal]    = useState(false);
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [showNotifModal,   setShowNotifModal]   = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal,    setShowHelpModal]    = useState(false);
  const [showAboutModal,   setShowAboutModal]   = useState(false);
  const [showProModal,     setShowProModal]     = useState(false);

  if (!user) return null;

  const LANGS: Language[] = ['pt', 'en', 'es'];

  const settingsItems = [
    {
      section: t('profile.sections.preferences'),
      items: [
        { ionicon: 'globe-outline',          color: Colors.cyan,   label: t('profile.language'),      value: LANGUAGE_LABELS[language].split(' ')[1], onPress: () => setShowLangModal(true) },
        { ionicon: 'notifications-outline',  color: Colors.purple, label: t('profile.notifications'), value: '',        onPress: () => setShowNotifModal(true) },
        { ionicon: 'lock-closed-outline',    color: Colors.blue,   label: t('profile.privacy'),       value: '',        onPress: () => setShowPrivacyModal(true) },
      ],
    },
    {
      section: t('profile.sections.support'),
      items: [
        { ionicon: 'help-circle-outline',         color: Colors.amber,   label: t('profile.help'),  value: '',       onPress: () => setShowHelpModal(true) },
        { ionicon: 'information-circle-outline',  color: Colors.textDim, label: t('profile.about'), value: 'v1.0.0', onPress: () => setShowAboutModal(true) },
      ],
    },
  ];

  const personalInfo = [
    { ionicon: 'mail-outline',      color: Colors.cyan,   label: t('profile.email'),    value: user.email },
    { ionicon: 'call-outline',      color: Colors.blue,   label: t('profile.phone'),    value: user.phone || '—' },
    { ionicon: 'location-outline',  color: Colors.purple, label: t('profile.location'), value: user.location || '—' },
    { ionicon: 'briefcase-outline', color: Colors.amber,  label: t('profile.role'),     value: user.role },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 8 }]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.backText}>← {t('common.back')}</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        {/* Cover + Avatar */}
        <View style={styles.coverSection}>
          <ImageBackground
            source={{ uri: user.coverImage }}
            style={[styles.cover, { paddingTop: insets.top }]}
            resizeMode="cover"
          >
            <Grad colors={['transparent', 'rgba(7,11,22,0.92)']} style={StyleSheet.absoluteFill} />
          </ImageBackground>

          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: user.avatarColor + '22', borderColor: user.avatarColor }]}>
              <Grad
                colors={[user.avatarColor + 'CC', user.avatarColor + '88']}
                style={StyleSheet.absoluteFill}
                borderRadius={44}
              />
              <Text style={styles.avatarText}>{user.avatarInitial}</Text>
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              activeOpacity={0.8}
              onPress={() => setShowEditModal(true)}
            >
              <Ionicons name="pencil" size={11} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Name + role */}
          <View style={styles.nameSection}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
            <Text style={styles.memberSince}>{t('profile.member')} {user.memberSince}</Text>
          </View>

          {/* Edit button */}
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.85} onPress={() => setShowEditModal(true)}>
            <Grad colors={['rgba(123,97,255,0.15)', 'rgba(255,85,0,0.08)']} style={StyleSheet.absoluteFill} borderRadius={999} />
            <Text style={styles.editBtnText}>{t('profile.editProfile')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: user.stats.projects,  label: t('profile.stats.projects') },
            { value: user.stats.companies, label: t('profile.stats.companies') },
            { value: user.stats.courses,   label: t('profile.stats.courses') },
          ].map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={16} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sections.personal')}</Text>
          <View style={styles.infoCard}>
            <Grad colors={['rgba(11,28,61,0.98)', 'rgba(12,18,32,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
            {personalInfo.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.infoRow, i < personalInfo.length - 1 && styles.infoRowBorder]}
                onPress={() => setShowEditModal(true)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.ionicon as any} size={15} color={item.color} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Watch History */}
        {history.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>HISTÓRICO DE VÍDEOS</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearHistory}>Limpar</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={history.slice(0, 10)}
              keyExtractor={(item) => item.id + item.watchedAt.toISOString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <View style={styles.historyCard}>
                  <ImageBackground
                    source={{ uri: item.thumbnail }}
                    style={styles.historyThumb}
                    imageStyle={{ borderRadius: 10 }}
                    resizeMode="cover"
                  >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(4,8,15,0.45)', borderRadius: 10 }]} />
                    <View style={styles.historyPlay}>
                      <Text style={{ color: '#fff', fontSize: 9 }}>▶</Text>
                    </View>
                  </ImageBackground>
                  <Text style={styles.historyTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Settings sections */}
        {settingsItems.map((group, gi) => (
          <View key={gi} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.section}</Text>
            <View style={styles.infoCard}>
              <Grad colors={['rgba(11,28,61,0.98)', 'rgba(12,18,32,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
              {group.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.infoRow, i < group.items.length - 1 && styles.infoRowBorder]}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color + '18' }]}>
                    <Ionicons name={item.ionicon as any} size={15} color={item.color} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoValue}>{item.label}</Text>
                  </View>
                  <Text style={styles.settingsValue}>{item.value}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textDim} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Banner Upgrade Profissional */}
        {(user.role === 'Proprietário' || user.role === 'Investidor' || user.role === 'Usuário SCIP') && (
          <TouchableOpacity
            style={styles.proBanner}
            activeOpacity={0.9}
            onPress={() => setShowProModal(true)}
          >
            <Grad colors={['#1a0e00', '#0e0a1a']} style={StyleSheet.absoluteFill} borderRadius={20} />
            {/* Linha dourada superior */}
            <View style={styles.proBannerTopLine} />

            <View style={styles.proBannerHeader}>
              <View style={styles.proBannerBadge}>
                <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={999} />
                <Text style={styles.proBannerBadgeText}>{t('profile.proBanner.badge')}</Text>
              </View>
              <Ionicons name="star" size={16} color="#FFB300" style={{ opacity: 0.6 }} />
            </View>

            <Text style={styles.proBannerTitle}>{t('profile.proBanner.title')}</Text>
            <Text style={styles.proBannerSub}>{t('profile.proBanner.sub')}</Text>

            <View style={styles.proBannerPerks}>
              {[
                { ionicon: 'trending-up-outline',  color: Colors.cyan,   text: t('profile.proBanner.perk1') },
                { ionicon: 'logo-whatsapp',         color: '#25D366',     text: t('profile.proBanner.perk2') },
                { ionicon: 'images-outline',        color: Colors.purple, text: t('profile.proBanner.perk3') },
              ].map((p) => (
                <View key={p.text} style={styles.proBannerPerk}>
                  <View style={[styles.proBannerPerkIconBox, { backgroundColor: p.color + '20' }]}>
                    <Ionicons name={p.ionicon as any} size={13} color={p.color} />
                  </View>
                  <Text style={styles.proBannerPerkText}>{p.text}</Text>
                </View>
              ))}
            </View>

            <View style={styles.proBannerCTA}>
              <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={12} />
              <Text style={styles.proBannerCTAText}>{t('profile.proBanner.cta')}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Modals ── */}

      <EditProfileModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={(data) => updateUser(data)}
      />

      <BecomeProModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
        onSave={(data) => updateUser(data)}
      />

      <NotificationsModal visible={showNotifModal} onClose={() => setShowNotifModal(false)} />
      <PrivacyModal       visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <HelpModal          visible={showHelpModal}    onClose={() => setShowHelpModal(false)} />
      <AboutModal         visible={showAboutModal}   onClose={() => setShowAboutModal(false)} />

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <Text style={styles.logoutModalTitle}>{t('profile.logoutConfirm')}</Text>
            <TouchableOpacity style={styles.logoutConfirmBtn} onPress={logout} activeOpacity={0.85}>
              <Grad colors={['rgba(255,77,77,0.2)', 'rgba(255,77,77,0.1)']} style={StyleSheet.absoluteFill} borderRadius={14} />
              <Text style={styles.logoutConfirmText}>{t('profile.logoutYes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutCancelBtn} onPress={() => setShowLogoutModal(false)} activeOpacity={0.8}>
              <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={14} />
              <Text style={styles.logoutCancelText}>{t('profile.logoutNo')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="fade" onRequestClose={() => setShowLangModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={styles.langModal}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <Text style={styles.langModalTitle}>{t('profile.language')}</Text>
            {LANGS.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langOption, language === lang && styles.langOptionActive]}
                onPress={() => { setLanguage(lang); setShowLangModal(false); }}
                activeOpacity={0.8}
              >
                {language === lang && (
                  <Grad colors={['rgba(123,97,255,0.15)', 'rgba(123,97,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={12} />
                )}
                <Text style={styles.langOptionText}>{LANGUAGE_LABELS[lang]}</Text>
                {language === lang && <Text style={styles.langCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Modal shared styles ──────────────────────────────────────────────────────
const modal = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
    overflow: 'hidden', gap: 0,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center', marginBottom: 20,
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white, marginBottom: 4 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, marginBottom: 16 },
  fieldGroup: { gap: 5, marginBottom: 12 },
  fieldLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14, height: 50, gap: 10,
  },
  iconBox: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  inputIcon: { fontSize: 14 },
  input: {
    flex: 1, fontFamily: 'Inter_400Regular',
    fontSize: 14, color: Colors.white, padding: 0,
  },
  saveBtn: {
    height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginTop: 16,
  },
  saveBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white, zIndex: 1 },
  cancelBtn: { alignItems: 'center', marginTop: 12, padding: 8 },
  cancelText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textDim },
  // Notifications
  notifRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 12,
  },
  notifRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  notifIcon: { fontSize: 18, width: 26, textAlign: 'center' },
  notifLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white },
  // Privacy
  privacyItem: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'flex-start' },
  privacyIcon: { fontSize: 20, width: 28, textAlign: 'center', marginTop: 2 },
  privacyTitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white },
  privacyDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  // Help
  helpItem: {
    marginBottom: 14, padding: 14, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  helpQ: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white, marginBottom: 5 },
  helpA: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  // About
  aboutLogo: {
    width: 60, height: 60, borderRadius: 16,
    alignSelf: 'center', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginBottom: 10,
  },
  aboutLogoText: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.white, zIndex: 1 },
  aboutAppName: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white, textAlign: 'center' },
  aboutVersion: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textDim, textAlign: 'center', marginBottom: 16 },
  aboutRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  aboutRowLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted },
  aboutRowValue: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.white },
  aboutCopy: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, textAlign: 'center', marginTop: 14 },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  backBtn: {
    position: 'absolute', left: 16, zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  backText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.white },
  coverSection: { alignItems: 'center', paddingBottom: 24 },
  cover: { width: '100%', height: 200 },
  avatarWrapper: { marginTop: -52, position: 'relative' },
  avatar: {
    width: 88, height: 88, borderRadius: 44, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  avatarText: { fontFamily: 'Inter_500Medium', fontSize: 28, color: Colors.white, zIndex: 1 },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgDeep, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  nameSection: { alignItems: 'center', marginTop: 12, gap: 4 },
  userName: { fontFamily: 'Inter_500Medium', fontSize: 21, color: Colors.white },
  userRole: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.amber },
  memberSince: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, marginTop: 2 },
  editBtn: {
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 9,
    borderRadius: 999, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(123,97,255,0.3)',
  },
  editBtnText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.amber, zIndex: 1 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 8 },
  statItem: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center',
    overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 4,
  },
  statValue: { fontFamily: 'Inter_500Medium', fontSize: 22, color: Colors.white },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, textAlign: 'center' },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  clearHistory: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.cyan },
  historyCard: { width: 120, gap: 6 },
  historyThumb: { width: 120, height: 72, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  historyPlay: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center' },
  historyTitle: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted, lineHeight: 14 },
  infoCard: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  iconBox: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, marginBottom: 2 },
  infoValue: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.white },
  settingsValue: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.amber, marginRight: 4 },
  proBanner: {
    marginHorizontal: 16, marginTop: 20,
    borderRadius: 20, padding: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,179,0,0.25)',
    gap: 10,
  },
  proBannerTopLine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, borderRadius: 2,
    backgroundColor: '#FFB300',
    opacity: 0.7,
  },
  proBannerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  proBannerBadge: {
    borderRadius: 999, overflow: 'hidden',
    paddingHorizontal: 10, paddingVertical: 3,
  },
  proBannerBadgeText: {
    fontFamily: 'Inter_700Bold', fontSize: 9, color: '#04080F',
    letterSpacing: 1.5, zIndex: 1,
  },
  proBannerTitle: {
    fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white, lineHeight: 22,
  },
  proBannerSub: {
    fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, lineHeight: 19,
  },
  proBannerPerks: { gap: 7, marginTop: 2 },
  proBannerPerk: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  proBannerPerkIconBox: {
    width: 24, height: 24, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  proBannerPerkText: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)', flex: 1,
  },
  proBannerCTA: {
    marginTop: 6, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  proBannerCTAText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#04080F', zIndex: 1,
  },
  logoutBtn: {
    marginHorizontal: 16, marginTop: 24, height: 50, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,77,77,0.3)',
  },
  logoutText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#FF4D4D' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  logoutModal: {
    width: 300, borderRadius: 24, padding: 24, overflow: 'hidden',
    gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  logoutModalTitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.white, textAlign: 'center', marginBottom: 4 },
  logoutConfirmBtn: { height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,77,77,0.3)' },
  logoutConfirmText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#FF4D4D', zIndex: 1 },
  logoutCancelBtn: { height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  logoutCancelText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted, zIndex: 1 },
  langModal: { width: 280, borderRadius: 24, padding: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  langModalTitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textDim, marginBottom: 10, letterSpacing: 0.5 },
  langOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, overflow: 'hidden', gap: 8 },
  langOptionActive: {},
  langOptionText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.white, flex: 1, zIndex: 1 },
  langCheck: { fontSize: 14, color: Colors.amber, zIndex: 1 },
});
