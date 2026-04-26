import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Platform,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { SPECIALISTS, SPECIALIST_AREAS, Specialist } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');
// image is ~820×1060 portrait
const HERO_H = Math.round(SW * 1.45);
const HERO_IMAGE = require('../../assets/hero-especialistas.png');

// ─── Specialist Card ──────────────────────────────────────────────────────────
function SpecialistCard({ item }: { item: Specialist }) {
  const { t } = useLanguage();
  return (
    <View style={styles.card}>
      <Grad
        colors={['rgba(11,28,61,0.97)', 'rgba(7,13,26,0.99)']}
        style={StyleSheet.absoluteFill}
        borderRadius={20}
      />

      {/* Top accent line */}
      <View style={[styles.cardAccent, { backgroundColor: item.avatarColor }]} />

      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor + '25', borderColor: item.avatarColor + '60' }]}>
          <Grad colors={[item.avatarColor, item.avatarColor + 'AA']} style={StyleSheet.absoluteFill} borderRadius={28} />
          <Text style={styles.avatarText}>{item.avatarInitial}</Text>
        </View>

        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            {item.isVerified && (
              <Ionicons name="checkmark-circle" size={14} color={Colors.cyan} />
            )}
          </View>
          <Text style={styles.role} numberOfLines={1}>{item.role}</Text>
          <View style={styles.onlineBadge}>
            <View style={[styles.onlineDot, { backgroundColor: item.isOnline ? '#00C48C' : Colors.textDim }]} />
            <Text style={[styles.onlineText, { color: item.isOnline ? '#00C48C' : Colors.textDim }]}>
              {item.isOnline ? t('especialistas.onlineNow') : t('especialistas.offline')}
            </Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="star" size={12} color={Colors.amber} />
          <Text style={styles.statValue}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>({item.reviewCount})</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="briefcase-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.statValue}>{item.projectsDone}</Text>
          <Text style={styles.statLabel}>{t('especialistas.projects')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.statValue}>{item.responseTime}</Text>
          <Text style={styles.statLabel}>{t('especialistas.response')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="ribbon-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.statValue}>{item.yearsExp}</Text>
          <Text style={styles.statLabel}>{t('especialistas.yearsExp')}</Text>
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.ctaBtn}
        activeOpacity={0.85}
        onPress={() => Linking.openURL(`https://wa.me/${item.phone.replace(/\D/g, '')}`)}
      >
        <Grad
          colors={['#25D366', '#128C7E']}
          style={StyleSheet.absoluteFill}
          borderRadius={12}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Ionicons name="logo-whatsapp" size={16} color="#fff" />
        <Text style={styles.ctaBtnText}>{t('especialistas.talkToExpert')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Hero Cover ───────────────────────────────────────────────────────────────
function HeroCover({ topInset, onBack, onlineCount }: { topInset: number; onBack: () => void; onlineCount: number }) {
  const { t } = useLanguage();
  return (
    <View style={styles.heroCover}>
      {/* Photo — same strategy as login screen */}
      <Image
        source={HERO_IMAGE}
        style={{ width: SW, height: HERO_H }}
        resizeMode="stretch"
      />

      {/* Dark overlay — heavier at top and bottom, lighter in middle */}
      <Grad
        colors={['rgba(4,8,15,0.75)', 'rgba(4,8,15,0.15)', 'rgba(4,8,15,0.85)', Colors.bgDeep]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Back button — top left */}
      <View style={[styles.heroTopBar, { paddingTop: topInset + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.heroBadge}>
          <View style={styles.heroBadgeDot} />
          <Text style={styles.heroBadgeText}>SCIP WORLD</Text>
        </View>
      </View>

      {/* Content anchored to bottom of photo */}
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>{t('especialistas.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('especialistas.subtitle')}</Text>

        {/* Stats row */}
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{SPECIALISTS.length}</Text>
            <Text style={styles.heroStatLabel}>{t('especialistas.specialists')}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <View style={styles.heroOnlineRow}>
              <View style={styles.heroOnlineDot} />
              <Text style={[styles.heroStatValue, { color: '#00C48C' }]}>{onlineCount}</Text>
            </View>
            <Text style={styles.heroStatLabel}>{t('especialistas.onlineNow')}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>14</Text>
            <Text style={styles.heroStatLabel}>{t('especialistas.areas')}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>4.8★</Text>
            <Text style={styles.heroStatLabel}>{t('especialistas.avgRating')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EspecialistasScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('todos');

  const areaLabels: string[] = t('specialistAreaLabels');
  const specialistRoles: string[] = t('specialistRoles');
  const specialistBios: string[] = t('specialistBios');

  const translatedAreas = useMemo(
    () => SPECIALIST_AREAS.map((a, i) => ({ ...a, label: areaLabels[i] ?? a.label })),
    [areaLabels],
  );
  const translatedSpecialists = useMemo(
    () => SPECIALISTS.map((s, i) => ({ ...s, role: specialistRoles[i] ?? s.role, bio: specialistBios[i] ?? s.bio })),
    [specialistRoles, specialistBios],
  );

  const filtered = useMemo(() => {
    return translatedSpecialists.filter((s) => {
      const matchArea = selectedArea === 'todos' || s.area === selectedArea;
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.bio.toLowerCase().includes(q);
      return matchArea && matchSearch;
    });
  }, [selectedArea, search, translatedSpecialists]);

  const onlineCount = SPECIALISTS.filter((s) => s.isOnline).length;

  const ListHeader = (
    <>
      {/* Hero Cover */}
      <HeroCover topInset={insets.top} onBack={() => navigation.goBack()} onlineCount={onlineCount} />

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('especialistas.searchPlaceholder')}
          placeholderTextColor={Colors.textDim}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {/* Area Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterScroll}
      >
        {translatedAreas.map((area) => {
          const active = selectedArea === area.id;
          return (
            <TouchableOpacity
              key={area.id}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setSelectedArea(area.id)}
              activeOpacity={0.8}
            >
              {active && (
                <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={999} />
              )}
              <Ionicons name={area.icon as any} size={13} color={active ? Colors.white : Colors.textMuted} />
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{area.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length !== 1 ? t('especialistas.foundMany') : t('especialistas.foundOne')}
        </Text>
      </View>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgDeep }]}>
      <StatusBar barStyle="light-content" />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SpecialistCard item={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 14, paddingBottom: insets.bottom + 24 }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textDim} />
            <Text style={styles.emptyText}>{t('especialistas.noResultsTitle')}</Text>
            <Text style={styles.emptySubtext}>{t('especialistas.noResultsSub')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Hero Cover ──
  heroCover: {
    width: SW,
    height: HERO_H,
    overflow: 'hidden',
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(4,8,15,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(4,8,15,0.55)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.4)',
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cyan,
  },
  heroBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.cyan,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 30,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4,8,15,0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    marginTop: 4,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 4 },
  heroStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
  heroStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  heroStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
  },
  heroOnlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  heroOnlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00C48C',
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    padding: 0,
  },

  filterScroll: { flexGrow: 0 },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterChipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  filterChipTextActive: {
    fontFamily: 'Inter_500Medium',
    color: Colors.white,
  },

  resultsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  resultsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },

  listContent: { paddingHorizontal: 16, paddingTop: 8, gap: 14 }, // kept for reference

  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
    marginTop: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
    zIndex: 1,
  },
  nameBlock: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
    flex: 1,
  },
  role: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  onlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },

  bio: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 10,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    flexDirection: 'column',
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: Colors.textDim,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  ctaBtn: {
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  ctaBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.textMuted,
  },
  emptySubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textDim,
  },
});
