import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ROLE_OPTIONS: { label: string; icon: string; section?: string }[] = [
  { label: 'Proprietário',          icon: '🏠', section: 'Quero construir' },
  { label: 'Investidor',            icon: '💼', section: 'Quero construir' },
  { label: 'Engenheiro Civil',      icon: '⚙️', section: 'Sou profissional' },
  { label: 'Arquiteto',             icon: '📐', section: 'Sou profissional' },
  { label: 'Construtor',            icon: '🏗️', section: 'Sou profissional' },
  { label: 'Empresa de Construção', icon: '🏢', section: 'Sou profissional' },
  { label: 'Fábrica de Painéis',    icon: '🏭', section: 'Sou profissional' },
  { label: 'Consultor / Especialista', icon: '👷', section: 'Sou profissional' },
  { label: 'Outro',                 icon: '👤', section: 'Sou profissional' },
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [role, setRole]           = useState('Proprietário');
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(cardY,    { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2)       e.name     = t('register.validationName');
    if (!email.includes('@'))          e.email    = t('register.validationEmail');
    if (password.length < 6)           e.password = t('register.validationPassword');
    if (confirm !== password)          e.confirm  = t('register.validationConfirm');
    return e;
  };

  const handleRegister = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await register(name.trim(), email.trim(), password, role);
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      {/* Decorative glow */}
      <View style={styles.glowTop} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerWrap}>
            <View style={styles.logoMark}>
              <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={14} />
              <Text style={styles.logoMarkText}>S</Text>
            </View>
            <Text style={styles.title}>{t('register.createAccount')}</Text>
            <Text style={styles.subtitle}>{t('register.joinPlatform')}</Text>
          </View>

          <Animated.View style={[styles.card, { opacity: cardAnim, transform: [{ translateY: cardY }] }]}>

            {/* Nome */}
            <Field
              label={t('register.fullName')}
              icon="👤"
              placeholder={t('register.fullNamePlaceholder')}
              value={name}
              onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: '' })); }}
              error={errors.name}
            />

            {/* Email */}
            <Field
              label={t('login.email')}
              icon="✉"
              placeholder="seu@email.com"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            {/* Senha */}
            <Field
              label={t('login.password')}
              icon="🔒"
              placeholder={t('register.passwordMin')}
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: '' })); }}
              secureTextEntry={!showPass}
              error={errors.password}
              rightElement={
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? '👁' : '🔕'}</Text>
                </TouchableOpacity>
              }
            />

            {/* Confirmar Senha */}
            <Field
              label={t('register.confirmPassword')}
              icon="🔒"
              placeholder={t('register.confirmPasswordPlaceholder')}
              value={confirm}
              onChangeText={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: '' })); }}
              secureTextEntry={!showConf}
              error={errors.confirm}
              rightElement={
                <TouchableOpacity onPress={() => setShowConf(!showConf)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showConf ? '👁' : '🔕'}</Text>
                </TouchableOpacity>
              }
            />

            {/* Perfil / Função */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('register.professionalProfile')}</Text>
              <TouchableOpacity
                style={[styles.inputWrap, errors.role ? styles.inputError : null]}
                onPress={() => setShowRoles(!showRoles)}
                activeOpacity={0.8}
              >
                <Text style={styles.inputIcon}>🏗️</Text>
                <Text style={styles.roleIcon}>
                  {ROLE_OPTIONS.find(r => r.label === role)?.icon ?? '🏠'}
                </Text>
                <Text style={styles.input}>{role}</Text>
                <Text style={[styles.eyeText, { marginLeft: 4 }]}>{showRoles ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {errors.role ? <Text style={styles.errorText}>{errors.role}</Text> : null}

              {showRoles && (
                <View style={styles.roleDropdown}>
                  <Grad colors={['rgba(11,28,61,0.99)', 'rgba(4,8,15,0.99)']} style={StyleSheet.absoluteFill} borderRadius={14} />
                  {(() => {
                    let lastSection = '';
                    return ROLE_OPTIONS.map((r) => {
                      const showHeader = r.section !== lastSection;
                      if (showHeader) lastSection = r.section!;
                      return (
                        <React.Fragment key={r.label}>
                          {showHeader && (
                            <View style={styles.roleSectionHeader}>
                              <Text style={styles.roleSectionText}>
                                {r.section === 'Quero construir' ? t('register.sectionBuild') : t('register.sectionPro')}
                              </Text>
                            </View>
                          )}
                          <TouchableOpacity
                            style={[styles.roleOption, role === r.label && styles.roleOptionActive]}
                            onPress={() => { setRole(r.label); setShowRoles(false); }}
                            activeOpacity={0.8}
                          >
                            {role === r.label && (
                              <Grad colors={['rgba(123,97,255,0.18)', 'rgba(123,97,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={10} />
                            )}
                            <Text style={styles.roleOptionIcon}>{r.icon}</Text>
                            <Text style={[styles.roleOptionText, role === r.label && { color: Colors.purple }]}>{r.label}</Text>
                            {role === r.label && <Text style={{ color: Colors.purple, fontSize: 13 }}>✓</Text>}
                          </TouchableOpacity>
                        </React.Fragment>
                      );
                    });
                  })()}
                </View>
              )}
            </View>

            {/* Botão Cadastrar */}
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              activeOpacity={0.88}
              disabled={loading}
            >
              <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.registerBtnText}>{t('register.registerButton')}</Text>
              }
            </TouchableOpacity>

            {/* Login link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>{t('register.alreadyAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Text style={styles.loginLink}>{t('login.signIn')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label, icon, placeholder, value, onChangeText,
  error, secureTextEntry, keyboardType, autoCapitalize, rightElement,
}: any) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <Text style={styles.inputIcon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textFaded}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'sentences'}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  glowTop: {
    position: 'absolute', top: -60, left: SW * 0.2, right: SW * 0.2,
    height: 200, borderRadius: 100,
    backgroundColor: Colors.purple,
    opacity: 0.08,
    transform: [{ scaleX: 2 }],
  },
  scroll: { paddingHorizontal: 16 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  backText: { fontSize: 18, color: Colors.white },
  headerWrap: { alignItems: 'center', marginBottom: 28, gap: 10 },
  logoMark: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  logoMarkText: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.white, zIndex: 1 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 26, color: Colors.white, letterSpacing: -0.3 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted },
  card: {
    borderRadius: 24, padding: 24, gap: 4,
    backgroundColor: 'rgba(6,12,30,0.88)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  fieldGroup: { gap: 6, marginBottom: 10 },
  fieldLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  inputError: { borderColor: 'rgba(255,77,77,0.5)' },
  inputIcon: { fontSize: 14, color: Colors.blueBright },
  input: {
    flex: 1, fontFamily: 'Inter_400Regular',
    fontSize: 15, color: Colors.white, padding: 0,
  },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 13, color: Colors.textDim },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#FF4D4D', marginTop: 2 },
  roleDropdown: {
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 4,
  },
  roleSectionHeader: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  roleSectionText: {
    fontFamily: 'Inter_500Medium', fontSize: 10,
    color: Colors.textDim, letterSpacing: 1.2, textTransform: 'uppercase',
  },
  roleIcon: { fontSize: 15 },
  roleOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
    overflow: 'hidden', gap: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  roleOptionActive: {},
  roleOptionIcon: { fontSize: 16, width: 24, textAlign: 'center' },
  roleOptionText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, zIndex: 1 },
  registerBtn: {
    height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginTop: 8,
  },
  registerBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white, zIndex: 1 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  loginLink: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.cyan },
});
