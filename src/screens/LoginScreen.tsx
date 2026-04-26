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
  Modal,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, LANGUAGE_LABELS } from '../i18n/translations';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 1.25);

const PANEL_IMAGE = require('../../assets/scip-panel.png');
const LOGO_IMAGE  = require('../../assets/logo.png');

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showLangModal, setShowLangModal]     = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail]         = useState('');
  const [forgotSent, setForgotSent]           = useState(false);
  const [forgotLoading, setForgotLoading]     = useState(false);

  // ── Entrance animations ──
  const zoom     = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const tagAnim  = useRef(new Animated.Value(0)).current;
  const tagY     = useRef(new Animated.Value(24)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    // Ken Burns zoom
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1.08, duration: 7000, useNativeDriver: true, isInteraction: false }),
        Animated.timing(zoom, { toValue: 1.00, duration: 7000, useNativeDriver: true, isInteraction: false }),
      ])
    ).start();

    // Staggered entrance
    Animated.stagger(180, [
      Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true, isInteraction: false }),
      Animated.parallel([
        Animated.timing(tagAnim, { toValue: 1, duration: 600, useNativeDriver: true, isInteraction: false }),
        Animated.timing(tagY,    { toValue: 0, duration: 600, useNativeDriver: true, isInteraction: false }),
      ]),
      Animated.parallel([
        Animated.timing(cardAnim, { toValue: 1, duration: 700, useNativeDriver: true, isInteraction: false }),
        Animated.timing(cardY,    { toValue: 0, duration: 700, useNativeDriver: true, isInteraction: false }),
      ]),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!email.includes('@')) { setError(t('login.validationEmail')); return; }
    if (password.length < 6)  { setError(t('login.validationPassword')); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) setError(t('login.loginError'));
  };

  const handleForgot = async () => {
    if (!forgotEmail.includes('@')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.');
      return;
    }
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotSent(true);
  };

  const handleSocial = (provider: string) => {
    Alert.alert(`${provider}`, 'Em breve! Esta opção estará disponível na próxima versão.', [
      { text: 'OK', style: 'default' },
    ]);
  };

  const LANGS: Language[] = ['pt', 'en', 'es'];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Full-screen background with Ken Burns ── */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.Image
          source={PANEL_IMAGE}
          style={{ width: SW, height: HERO_H, transform: [{ scale: zoom }] }}
          resizeMode="stretch"
        />
        <Grad
          colors={['rgba(4,8,15,0.25)', 'rgba(4,8,15,0.6)', Colors.bgDeep]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.85 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* ── Card + Form ── */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar inside scroll */}
          <View style={[styles.topBar, { paddingTop: insets.top - 20 }]}>
            <Animated.Image
              source={LOGO_IMAGE}
              style={[styles.logo, { opacity: logoAnim }]}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangModal(true)} activeOpacity={0.8}>
              <Text style={styles.langBtnText}>
                {language === 'pt' ? '🇧🇷' : language === 'en' ? '🇺🇸' : '🇪🇸'} {language.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tagline inside scroll */}
          <Animated.View style={[styles.taglineWrap, { opacity: tagAnim, transform: [{ translateY: tagY }] }]}>
            <Text style={styles.tagline}>{t('login.tagline')}</Text>
            <Text style={styles.taglineSub}>{t('login.taglineSub')}</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { opacity: cardAnim, transform: [{ translateY: cardY }] }]}>

            <Text style={styles.cardTitle}>{t('login.welcome')}</Text>
            <Text style={styles.cardSub}>{t('login.cardSub')}</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('login.email')}</Text>
              <View style={[styles.inputWrap, error && styles.inputError]}>
                <Text style={styles.inputIcon}>✉</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('login.emailPlaceholder')}
                  placeholderTextColor={Colors.textFaded}
                  value={email}
                  onChangeText={(v) => { setEmail(v); setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{t('login.password')}</Text>
              <View style={[styles.inputWrap, error && styles.inputError]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('login.passwordPlaceholder')}
                  placeholderTextColor={Colors.textFaded}
                  value={password}
                  onChangeText={(v) => { setPassword(v); setError(''); }}
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPass ? '👁' : '🔕'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7} onPress={() => { setForgotSent(false); setForgotEmail(''); setShowForgotModal(true); }}>
              <Text style={styles.forgotText}>{t('login.forgotPassword')}</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.88} disabled={loading}>
              <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={styles.loginBtnText}>{t('login.signIn')}</Text>
              }
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('login.orContinueWith')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons — proeminentes */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.88} onPress={() => handleSocial('Google')}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>{t('login.continueGoogle')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.appleBtn} activeOpacity={0.88} onPress={() => handleSocial('Apple')}>
              <Text style={styles.appleIcon}></Text>
              <Text style={styles.appleText}>{t('login.continueApple')}</Text>
            </TouchableOpacity>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>{t('login.noAccount')} </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>{t('login.createAccount')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotModal} transparent animationType="fade" onRequestClose={() => setShowForgotModal(false)}>
        <View style={styles.forgotOverlay}>
          <View style={styles.forgotModal}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />

            {forgotSent ? (
              <>
                <Text style={styles.forgotSuccessIcon}>✉️</Text>
                <Text style={styles.forgotTitle}>E-mail enviado!</Text>
                <Text style={styles.forgotDesc}>
                  Enviamos um link de redefinição para{'\n'}
                  <Text style={{ color: Colors.cyan }}>{forgotEmail}</Text>
                  {'\n'}Verifique sua caixa de entrada.
                </Text>
                <TouchableOpacity
                  style={styles.forgotSendBtn}
                  onPress={() => setShowForgotModal(false)}
                  activeOpacity={0.88}
                >
                  <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
                  <Text style={styles.forgotSendText}>Fechar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.forgotTitle}>Recuperar senha</Text>
                <Text style={styles.forgotDesc}>
                  Informe seu e-mail e enviaremos{'\n'}um link para redefinir sua senha.
                </Text>
                <View style={[styles.inputWrap, { marginVertical: 12 }]}>
                  <Text style={styles.inputIcon}>✉</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor={Colors.textFaded}
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  style={styles.forgotSendBtn}
                  onPress={handleForgot}
                  activeOpacity={0.88}
                  disabled={forgotLoading}
                >
                  <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
                  {forgotLoading
                    ? <ActivityIndicator color={Colors.white} />
                    : <Text style={styles.forgotSendText}>Enviar link →</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setShowForgotModal(false)} activeOpacity={0.7}>
                  <Text style={styles.forgotCancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="fade" onRequestClose={() => setShowLangModal(false)}>
        <TouchableOpacity style={styles.langOverlay} activeOpacity={1} onPress={() => setShowLangModal(false)}>
          <View style={[styles.langModal, { top: insets.top + 60 }]}>
            <Grad colors={[Colors.bgCard, Colors.bgDeep]} style={StyleSheet.absoluteFill} borderRadius={20} />
            <Text style={styles.langModalTitle}>{t('profile.language')}</Text>
            {LANGS.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langOption, language === lang && styles.langOptionActive]}
                onPress={() => { setLanguage(lang); setShowLangModal(false); }}
                activeOpacity={0.8}
              >
                {language === lang && (
                  <Grad colors={['rgba(123,97,255,0.18)', 'rgba(157,78,221,0.06)']} style={StyleSheet.absoluteFill} borderRadius={12} />
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },

  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingLeft: 0,
    paddingTop: 40,
    marginLeft: -20,
  },
  logo: { width: SW * 0.85, height: SW * 0.73 },

  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  langBtnText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.white },

  taglineWrap: {
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: -20,
  },
  tagline: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.white,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  taglineSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 8,
  },

  scroll: { paddingHorizontal: 16, alignItems: 'center', paddingTop: 0 },

  card: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    gap: 4,
    backgroundColor: 'rgba(6,12,30,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.white, marginBottom: 2 },
  cardSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 16 },

  fieldGroup: { gap: 6, marginBottom: 8 },
  fieldLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  inputError: { borderColor: 'rgba(255,77,77,0.5)' },
  inputIcon:  { fontSize: 14, color: Colors.blueBright },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.white, padding: 0 },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 14 },

  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#FF4D4D', marginTop: -4, marginBottom: 4 },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: 8 },
  forgotText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.cyan },

  loginBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 4,
  },
  loginBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white, zIndex: 1 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.3)' },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    gap: 10,
    marginBottom: 10,
  },
  googleIcon: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#4285F4' },
  googleText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#1a1a1a' },

  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 10,
  },
  appleIcon: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#fff' },
  appleText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' },

  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  registerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  registerLink: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.purple },

  forgotOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center' },
  forgotModal: {
    width: SW * 0.88, borderRadius: 24, padding: 28,
    overflow: 'hidden', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  forgotSuccessIcon: { fontSize: 40, marginBottom: 4 },
  forgotTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white, textAlign: 'center', marginBottom: 2 },
  forgotDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  forgotSendBtn: {
    width: '100%', height: 50, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', marginTop: 8,
  },
  forgotSendText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white, zIndex: 1 },
  forgotCancelText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textDim },
  langOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  langModal: {
    position: 'absolute',
    right: 16,
    width: 220,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.12)',
    gap: 4,
  },
  langModalTitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  langOptionActive: {},
  langOptionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, flex: 1, zIndex: 1 },
  langCheck: { fontSize: 14, color: Colors.purple, zIndex: 1 },
});
