import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import NotificationsModal from '../components/NotificationsModal';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Colors from '../constants/colors';
import { RootStackParamList, navigationRef } from '../navigation/AppNavigator';
import HeroBanner from '../components/HeroBanner';
import GlobeNeonIcon from '../components/GlobeNeonIcon';
import CalculatorCard from '../components/CalculatorCard';
import FeaturedProjects from '../components/FeaturedProjects';
import FeaturedCompanies from '../components/FeaturedCompanies';
import BrandsSection from '../components/BrandsSection';
import FAQSection from '../components/FAQSection';
import { Company, COMPANIES, SPECIALISTS_ONLINE } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLeadsNotification } from '../contexts/LeadsNotificationContext';
import { Ionicons } from '@expo/vector-icons';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Top App Bar ──────────────────────────────────────────────────────────────
function TopBar({ topInset, onNotif }: { topInset: number; onNotif: () => void }) {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { newLeadsCount } = useLeadsNotification();

  return (
    <View style={[styles.topBar, { paddingTop: topInset + 8 }]}>
      <Grad
        colors={['rgba(4,8,15,1)', 'rgba(11,15,26,0)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.topBarLeft}>
        <View style={styles.logoMark}>
          <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={8} />
          <Text style={styles.logoMarkText}>S</Text>
        </View>
        <View>
          <Text style={styles.logoText}>
            {t('home.greeting')}, {user?.firstName ?? 'Usuário'}
          </Text>
          <Text style={styles.logoTagline}>{t('home.subtitle')}</Text>
        </View>
      </View>

      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8} onPress={onNotif}>
          <Ionicons name="notifications-outline" size={20} color={Colors.textMuted} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.avatarWrap}
          activeOpacity={0.8}
          onPress={() => { if (navigationRef.isReady()) navigationRef.navigate('Profile'); }}
        >
          <View style={[styles.avatar, { backgroundColor: (user?.avatarColor ?? '#2F6BFF') + '33', borderColor: user?.avatarColor ?? Colors.blue }]}>
            <Grad
              colors={[user?.avatarColor ?? '#2F6BFF', (user?.avatarColor ?? '#1A47CC') + 'AA']}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <Text style={styles.avatarText}>{user?.avatarInitial ?? 'U'}</Text>
          </View>
          {newLeadsCount > 0 && (
            <View style={styles.leadsBadge}>
              <Text style={styles.leadsBadgeText}>
                {newLeadsCount > 9 ? '9+' : newLeadsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Section Title Helper ─────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerChip}>
        <Text style={styles.dividerText}>{label}</Text>
      </View>
      <View style={styles.dividerLine} />
    </View>
  );
}

// ─── Quick Actions Bar ────────────────────────────────────────────────────────
function QuickActions({ onEstimate, onNav }: { onEstimate: () => void; onNav: (tab: string) => void }) {
  const { t } = useLanguage();
  const actions: { icon: any; color: string; label: string; onPress: () => void }[] = [
    { icon: 'calculator-outline',  color: Colors.cyan,   label: t('home.actions.calculate'),  onPress: onEstimate },
    { icon: 'business-outline',    color: Colors.purple, label: t('home.actions.companies'),  onPress: () => onNav('Empresas') },
    { icon: 'book-outline',        color: Colors.blue,   label: t('home.actions.courses'),    onPress: () => onNav('Cursos') },
    { icon: 'people-outline',      color: Colors.cyan,   label: t('home.actions.community'),  onPress: () => { if (navigationRef.isReady()) navigationRef.navigate('ComunidadeStack'); } },
  ];

  return (
    <View style={styles.quickActions}>
      {actions.map((action, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.quickAction}
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Grad
            colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
            style={StyleSheet.absoluteFill}
            borderRadius={16}
          />
          <View style={[styles.quickActionAccent, { backgroundColor: action.color }]} />
          <Ionicons name={action.icon} size={22} color={action.color} />
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Disaster Resistance Section ─────────────────────────────────────────────
function DisasterSection() {
  const { t } = useLanguage();
  const cards = [
    { icon: '🌀', key: 'hurricane', color: Colors.blue,   bgColor: Colors.blueMuted,   borderColor: 'rgba(10,132,255,0.3)' },
    { icon: '🌪️', key: 'tornado',  color: Colors.purple, bgColor: Colors.purpleMuted, borderColor: 'rgba(124,58,237,0.3)' },
    { icon: '🌊', key: 'flood',    color: Colors.cyan,   bgColor: Colors.cyanMuted,   borderColor: 'rgba(0,200,240,0.3)' },
    { icon: '🔥', key: 'fire',     color: Colors.amber,  bgColor: 'rgba(255,183,3,0.1)',  borderColor: 'rgba(255,183,3,0.3)' },
  ];

  return (
    <View style={styles.disasterSection}>
      <View style={styles.disasterHeader}>
        <View style={styles.disasterBadge}>
          <Text style={styles.disasterBadgeText}>US MARKET</Text>
        </View>
        <Text style={styles.disasterTitle}>{t('home.disaster.title')}</Text>
        <Text style={styles.disasterSubtitle}>{t('home.disaster.subtitle')}</Text>
      </View>

      <View style={styles.disasterGrid}>
        {cards.map((card) => (
          <View key={card.key} style={[styles.disasterCard, { borderColor: card.borderColor }]}>
            <View style={[styles.disasterIconBox, { backgroundColor: card.bgColor }]}>
              <Text style={styles.disasterIcon}>{card.icon}</Text>
            </View>
            <Text style={[styles.disasterCardTitle, { color: card.color }]}>
              {t(`home.disaster.${card.key}`)}
            </Text>
            <Text style={styles.disasterCardDesc}>
              {t(`home.disaster.${card.key}Desc`)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.disasterCertRow}>
        {['Miami-Dade', 'ICC-500', 'FEMA P-361', 'ASTM E119'].map((cert) => (
          <View key={cert} style={styles.disasterCertChip}>
            <Text style={styles.disasterCertText}>{cert}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Info Banner ──────────────────────────────────────────────────────────────
function InfoBanner() {
  const { t } = useLanguage();
  return (
    <View style={styles.infoBanner}>
      <Grad
        colors={['rgba(10,132,255,0.1)', 'rgba(124,58,237,0.05)']}
        style={StyleSheet.absoluteFill}
        borderRadius={16}
      />
      <View style={styles.infoBannerContent}>
        <View style={styles.infoIconBox}>
          <Text style={styles.infoIconText}>⚡</Text>
        </View>
        <View style={styles.infoText}>
          <Text style={styles.infoTitle}>{t('home.whyScip')}</Text>
          <Text style={styles.infoDesc}>{t('home.whySciPDesc')}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Pro Upgrade Banner ───────────────────────────────────────────────────────
function ProUpgradeBanner({ onPress }: { onPress: () => void }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity
      style={styles.proUpgrade}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Grad colors={['#1a0e00', '#0e0a1a']} style={StyleSheet.absoluteFill} borderRadius={20} />
      <View style={styles.proUpgradeTopLine} />

      <View style={styles.proUpgradeRow}>
        <View style={styles.proUpgradeBadge}>
          <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={999} />
          <Text style={styles.proUpgradeBadgeText}>{t('home.proUpgrade.badge')}</Text>
        </View>
      </View>

      <View style={styles.proUpgradeBody}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={styles.proUpgradeTitle}>{t('home.proUpgrade.title')}</Text>
          <Text style={styles.proUpgradeSub}>{t('home.proUpgrade.sub')}</Text>
          <View style={styles.proUpgradeStat}>
            <Text style={styles.proUpgradeStatNum}>500+</Text>
            <Text style={styles.proUpgradeStatLabel}>{t('home.proUpgrade.stat')}</Text>
          </View>
        </View>

        <View style={styles.proUpgradeIconCol}>
          <View style={styles.proUpgradeIcon}>
            <Grad colors={['rgba(255,179,0,0.15)', 'rgba(255,107,0,0.08)']} style={StyleSheet.absoluteFill} borderRadius={16} />
            <Text style={{ fontSize: 26 }}>🏆</Text>
          </View>
        </View>
      </View>

      <View style={styles.proUpgradeCTA}>
        <Grad colors={['#FFB300', '#FF6B00']} style={StyleSheet.absoluteFill} borderRadius={12} />
        <Text style={styles.proUpgradeCTAText}>{t('home.proUpgrade.cta')}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Online Specialists ───────────────────────────────────────────────────────
function OnlineSpecialists() {
  const navigation = useNavigation<NavProp>();
  const { t } = useLanguage();
  return (
    <View style={{ marginTop: 32 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 4, height: 36, borderRadius: 2, backgroundColor: '#FF4D9D', shadowColor: '#FF4D9D', shadowOpacity: 0.8, shadowRadius: 6 }} />
          <View>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white, letterSpacing: 0.2 }}>{t('home.specialistsOnlineTitle')}</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>{t('home.specialistsAvailableNow')}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(123,97,255,0.3)' }}
          onPress={() => (navigation as any).navigate('Especialistas')}
          activeOpacity={0.8}
        >
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.amber }}>{t('featured.seeAll')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {SPECIALISTS_ONLINE.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={{ width: 130, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', alignItems: 'center', gap: 6, backgroundColor: 'rgba(7,13,26,0.98)' }}
            onPress={() => (navigation as any).navigate('EspecialistaProfile', { specialist: s })}
            activeOpacity={0.85}
          >
            <View style={{ position: 'relative', marginBottom: 2 }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: s.avatarColor + '22', borderWidth: 2, borderColor: s.avatarColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 17, color: s.avatarColor }}>{s.avatarInitial}</Text>
              </View>
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 13, height: 13, borderRadius: 7, backgroundColor: '#00C48C', borderWidth: 2, borderColor: Colors.bgDeep }} />
            </View>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.white, textAlign: 'center' }} numberOfLines={2}>{s.name}</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted, textAlign: 'center' }} numberOfLines={1}>{s.role}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 10, color: Colors.star }}>★</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.white }}>{s.rating.toFixed(1)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Community Card ───────────────────────────────────────────────────────────
function CommunityCard() {
  const navigation = useNavigation<NavProp>();
  const { t } = useLanguage();
  const stats = [
    { value: '2.847', label: t('home.communityMembers') },
    { value: '12.4k', label: t('home.communityQuestions') },
    { value: '38', label: t('home.communityOnlineNow') },
  ];
  return (
    <TouchableOpacity
      style={styles.communityCard}
      activeOpacity={0.88}
      onPress={() => (navigation as any).navigate('ComunidadeStack')}
    >
      {/* Gradiente de fundo */}
      <Grad
        colors={['rgba(76,201,240,0.13)', 'rgba(123,97,255,0.09)', 'rgba(4,8,15,0.0)']}
        style={StyleSheet.absoluteFill}
        borderRadius={24}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.communityTopLine} />

      {/* Linha superior: ícone + título + seta */}
      <View style={styles.communityRow}>
        <View style={{ position: 'relative' }}>
          <View style={styles.communityIconBox}>
            <GlobeNeonIcon size={54} />
          </View>
          {/* Badge de chat */}
          <View style={styles.communityBadge}>
            <Ionicons name="chatbubble-ellipses" size={9} color={Colors.cyan} />
          </View>
        </View>
        <View style={styles.communityText}>
          <Text style={styles.communityTitle}>{t('home.communityTitle')}</Text>
          <Text style={styles.communitySub}>{t('home.communitySub')}</Text>
        </View>
        <View style={styles.communityArrow}>
          <Grad colors={Colors.gradients.cyan} style={StyleSheet.absoluteFill} borderRadius={999} />
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
        </View>
      </View>

      {/* Divisor */}
      <View style={styles.communityDivider} />

      {/* Stats */}
      <View style={styles.communityStats}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            <View style={styles.communityStat}>
              <Text style={styles.communityStatValue}>{s.value}</Text>
              <Text style={styles.communityStatLabel}>{s.label}</Text>
            </View>
            {i < stats.length - 1 && <View style={styles.communityStatDiv} />}
          </React.Fragment>
        ))}
      </View>

      {/* Tags */}
      <View style={styles.communityPills}>
        {(t('home.communityPills') as string[]).map((tag) => (
          <View key={tag} style={styles.communityPill}>
            <Text style={styles.communityPillText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.communityCTA}>
        <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={14} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        <Text style={styles.communityCTAText}>{t('home.communityAccessBtn')}</Text>
        <Ionicons name="arrow-forward-circle" size={18} color="rgba(255,255,255,0.8)" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Footer CTA ───────────────────────────────────────────────────────────────
function FooterCTA() {
  const { t } = useLanguage();
  const navigation = useNavigation<NavProp>();
  return (
    <View style={styles.footerCTA}>
      <Grad
        colors={['rgba(10,132,255,0.1)', 'rgba(124,58,237,0.06)']}
        style={StyleSheet.absoluteFill}
        borderRadius={20}
      />
      <Text style={styles.footerTitle}>{t('home.readyToBuild')}</Text>
      <Text style={styles.footerSubtitle}>{t('home.expertContact')}</Text>
      <TouchableOpacity style={styles.footerBtn} activeOpacity={0.85} onPress={() => { if (navigationRef.isReady()) navigationRef.navigate('Estimar'); }}>
        <Grad
          colors={Colors.gradients.tech}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
          borderRadius={999}
        />
        <Text style={styles.footerBtnText}>{t('home.freeQuote')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  const scrollRef = React.useRef<ScrollView>(null);
  const calculatorRef = React.useRef<View>(null);

  const handleCompanyPress = useCallback(
    (company: Company) => {
      navigation.navigate('EmpresaProfile', { company });
    },
    [navigation]
  );

  const scrollToCalculator = () => {
    if (navigationRef.isReady()) navigationRef.navigate('Estimar');
  };

  const navigateToTab = (tab: string) => {
    (navigation as any).navigate(tab);
  };

  const { opacity, translateY } = useEntryAnimation();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background gradient */}
      <Grad
        colors={Colors.gradients.background}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating top bar (rendered above scroll) */}
      <TopBar topInset={insets.top} onNotif={() => setShowNotifs(true)} />

      {/* Main scrollable content */}
      <Animated.ScrollView
        ref={scrollRef}
        style={[styles.scroll, { opacity, transform: [{ translateY }] }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90, paddingTop: insets.top + 56 }]}
        scrollEventThrottle={16}
      >
        {/* Hero Banner */}
        <HeroBanner onCTAPress={scrollToCalculator} />

        {/* Quick Actions */}
        <View style={styles.quickActionsWrapper}>
          <QuickActions onEstimate={scrollToCalculator} onNav={navigateToTab} />
        </View>

        {/* SCIP Info Banner */}
        <InfoBanner />

        {/* CALCULATOR */}
        <View ref={calculatorRef}>
          <SectionDivider label={t('home.sections.estimate')} />
          <CalculatorCard />
        </View>

        {/* FEATURED PROJECTS */}
        <FeaturedProjects onProjectPress={(project) => {
          const company = COMPANIES.find(c => c.id === project.companyId);
          if (company) navigation.navigate('EmpresaProfile', { company });
        }} />

        {/* DISASTER RESISTANCE */}
        <DisasterSection />

        {/* FEATURED COMPANIES */}
        <FeaturedCompanies onCompanyPress={handleCompanyPress} />

        {/* PRO UPGRADE BANNER — só para não-profissionais */}
        {(user?.role === 'Proprietário' || user?.role === 'Investidor' || user?.role === 'Usuário SCIP') && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <ProUpgradeBanner onPress={() => { if (navigationRef.isReady()) navigationRef.navigate('Profile'); }} />
          </View>
        )}

        {/* BRANDS */}
        <BrandsSection />

        {/* COMMUNIDADE CARD */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <CommunityCard />
        </View>

        {/* ONLINE SPECIALISTS */}
        <OnlineSpecialists />

        {/* Footer CTA — Pronto para construir? */}
        <FooterCTA />

        {/* FAQ */}
        <FAQSection />
      </Animated.ScrollView>

      <NotificationsModal visible={showNotifs} onClose={() => setShowNotifs(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoMarkText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
  logoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  logoTagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.2,
    marginTop: 1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notifBtn: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 14,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.amber,
    borderWidth: 1.5,
    borderColor: Colors.bgDeep,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.blue,
  },
  avatarText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.white,
    zIndex: 1,
  },
  leadsBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#FF4D9D',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  leadsBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.white,
    lineHeight: 11,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  quickActionsWrapper: {
    paddingHorizontal: 16,
    marginTop: -20,
    zIndex: 10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 6,
  },
  quickActionAccent: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: 1.5,
    borderRadius: 1,
    opacity: 0.6,
  },
  quickActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(10,132,255,0.2)',
    overflow: 'hidden',
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(10,132,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10,132,255,0.2)',
  },
  infoIconText: {
    fontSize: 15,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 2,
  },
  infoDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 32,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dividerChip: {
    backgroundColor: Colors.purpleMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.2)',
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.purple,
    letterSpacing: 1.5,
  },
  advantagesSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  advantagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  advantageCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 6,
  },
  advantageIcon: {
    fontSize: 21,
  },
  advantageTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  advantageDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  proUpgrade: {
    borderRadius: 20, padding: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,179,0,0.25)', gap: 12,
  },
  proUpgradeTopLine: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#FFB300', opacity: 0.7,
  },
  proUpgradeRow: { flexDirection: 'row', alignItems: 'center' },
  proUpgradeBadge: {
    borderRadius: 999, overflow: 'hidden',
    paddingHorizontal: 10, paddingVertical: 3,
  },
  proUpgradeBadgeText: {
    fontFamily: 'Inter_700Bold', fontSize: 9, color: '#04080F',
    letterSpacing: 1.5, zIndex: 1,
  },
  proUpgradeBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  proUpgradeTitle: {
    fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white, lineHeight: 22,
  },
  proUpgradeSub: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 18,
  },
  proUpgradeStat: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 4 },
  proUpgradeStatNum: {
    fontFamily: 'Inter_700Bold', fontSize: 22, color: '#FFB300',
  },
  proUpgradeStatLabel: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted,
  },
  proUpgradeIconCol: { alignItems: 'center', justifyContent: 'center' },
  proUpgradeIcon: {
    width: 64, height: 64, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,179,0,0.2)',
  },
  proUpgradeCTA: {
    height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  proUpgradeCTAText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#04080F', zIndex: 1,
  },
  footerCTA: {
    margin: 16,
    marginTop: 32,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(10,132,255,0.25)',
    overflow: 'hidden',
    gap: 8,
  },
  footerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    color: Colors.white,
    textAlign: 'center',
  },
  footerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  footerBtn: {
    width: '100%',
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  footerBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
    zIndex: 1,
  },
  disasterSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  disasterHeader: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  disasterBadge: {
    backgroundColor: 'rgba(30,144,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.25)',
    marginBottom: 8,
  },
  disasterBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.cyan,
    letterSpacing: 1.5,
  },
  disasterTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
    marginBottom: 4,
  },
  disasterSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  disasterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  disasterCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    backgroundColor: 'rgba(7,13,26,0.98)',
    gap: 6,
  },
  disasterIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  disasterIcon: {
    fontSize: 18,
  },
  disasterCardTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  disasterCardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  disasterCertRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  disasterCertChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  disasterCertText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 0.5,
  },

  // Community Card
  communityCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.22)',
    overflow: 'hidden',
    gap: 16,
  },
  communityTopLine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2.5,
    backgroundColor: Colors.cyan,
    opacity: 0.6,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  communityIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4,8,15,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.25)',
  },
  communityBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bgDeep,
    borderWidth: 1.5,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.cyan,
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
  communityText: { flex: 1 },
  communityTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  communitySub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  communityArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  communityDivider: {
    height: 1,
    backgroundColor: 'rgba(76,201,240,0.1)',
  },
  communityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  communityStat: { alignItems: 'center', gap: 2 },
  communityStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
  },
  communityStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textFaded,
  },
  communityStatDiv: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  communityPills: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  communityPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(76,201,240,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.18)',
  },
  communityPillText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.cyan,
  },
  communityCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    overflow: 'hidden',
  },
  communityCTAText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
});
