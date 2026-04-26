import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TextInput,
  Platform,
  Linking,
  Image,
  Dimensions,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.75);
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../constants/colors';
import { COMPANIES, Company } from '../data/mockData';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const COVER_IMAGE = require('../../assets/hero-empresas.png');
const FILTER_KEYS = ['all', 'engineering', 'construction', 'factory'] as const;

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: size, color: Colors.star, opacity: s <= Math.round(rating) ? 1 : 0.25 }}>★</Text>
      ))}
    </View>
  );
}

function CompanyListCard({ company, onPress }: { company: Company; onPress: () => void }) {
  const { t } = useLanguage();
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(t('empresas.whatsappMsg'));
    Linking.openURL(`https://wa.me/${company.phone.replace(/\D/g, '')}?text=${msg}`);
  };

  return (
    <TouchableOpacity style={styles.companyCard} onPress={onPress} activeOpacity={0.88}>
      {/* Cover Image */}
      <ImageBackground
        source={{ uri: company.coverImage }}
        style={styles.coverImage}
        imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        resizeMode="cover"
      >
        <Grad
          colors={['transparent', 'rgba(4,8,15,0.85)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.coverBadges}>
          {company.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>{t('empresas.verified')}</Text>
            </View>
          )}
          <View style={[styles.categoryBadge, { backgroundColor: Colors.purpleMuted }]}>
            <Text style={styles.categoryText}>{company.category}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Card Content */}
      <View style={styles.cardBody}>
        <Grad colors={['rgba(11,28,61,0.95)', 'rgba(20,25,39,1)']} style={StyleSheet.absoluteFill} borderRadius={20} />

        {/* Logo Row */}
        <View style={styles.logoRow}>
          <View style={[styles.logo, { backgroundColor: company.logoColor + '18', borderColor: company.logoColor + '40' }]}>
            <Text style={[styles.logoInitial, { color: company.logoColor }]}>{company.logoInitial}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View style={styles.ratingRow}>
              <StarRating rating={company.rating} />
              <Text style={styles.ratingText}>{company.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({company.reviewCount} avaliações)</Text>
            </View>
          </View>
          <View style={[styles.scoreCircle, { borderColor: company.logoColor + '40' }]}>
            <Text style={[styles.scoreValue, { color: company.logoColor }]}>{company.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{company.location}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>{company.description}</Text>

        {/* Services */}
        <View style={styles.servicesList}>
          {company.services.map((s, idx) => (
            <View key={idx} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.profileBtn} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.profileBtnText}>{t('empresas.viewProfile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.8}>
            <Grad colors={['#25D366', '#128C7E']} style={StyleSheet.absoluteFill} borderRadius={12} />
            <Text style={styles.whatsappText}>{t('empresas.whatsapp')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EmpresasScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<typeof FILTER_KEYS[number]>('all');
  const [search, setSearch] = useState('');

  const filterLabel = (key: typeof FILTER_KEYS[number]) => t(`empresas.filters.${key}`);

  const categoryMap: Record<typeof FILTER_KEYS[number], string> = {
    all: '',
    engineering: 'Engenharia',
    construction: 'Construção',
    factory: 'Fábrica',
  };

  const filtered = COMPANIES.filter((c) => {
    const matchFilter = activeFilter === 'all' || c.category === categoryMap[activeFilter];
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const count = filtered.length;
  const countLabel = count === 1
    ? `1 ${t('empresas.found')} ${t('empresas.foundSuffix')}`
    : `${count} ${t('empresas.foundPlural')} ${t('empresas.foundSuffixPlural')}`;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: 0, paddingBottom: insets.bottom + 100 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View>
            {/* ── Cover Hero ─────────────────────────────── */}
            <View style={styles.coverHero}>
              <Image
                source={COVER_IMAGE}
                style={{ width: SW, height: HERO_H }}
                resizeMode="stretch"
              />
              {/* Overlay: moderate top, very light mid, subtle bottom */}
              <Grad
                colors={['rgba(4,8,15,0.55)', 'rgba(4,8,15,0.05)', 'rgba(4,8,15,0.45)', 'rgba(4,8,15,0.82)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
              {/* Top safe area spacer + badge */}
              <View style={[styles.coverTopBar, { paddingTop: insets.top + 10 }]}>
                <View style={styles.coverBadge}>
                  <View style={styles.coverBadgeDot} />
                  <Text style={styles.coverBadgeText}>{t('empresas.badge')}</Text>
                </View>
              </View>
              {/* Content anchored to bottom */}
              <View style={styles.coverContent}>
                <Text style={styles.coverTitle}>{t('empresas.coverTitle')}</Text>
                <Text style={styles.coverSubtitle}>{t('empresas.coverSubtitle')}</Text>
                {/* Stats */}
                <View style={styles.coverStats}>
                  <View style={styles.coverStat}>
                    <Text style={styles.coverStatValue}>{COMPANIES.length}</Text>
                    <Text style={styles.coverStatLabel}>Empresas</Text>
                  </View>
                  <View style={styles.coverStatDiv} />
                  <View style={styles.coverStat}>
                    <Text style={styles.coverStatValue}>{COMPANIES.filter(c => c.verified).length}</Text>
                    <Text style={styles.coverStatLabel}>Verificadas</Text>
                  </View>
                  <View style={styles.coverStatDiv} />
                  <View style={styles.coverStat}>
                    <Text style={styles.coverStatValue}>3</Text>
                    <Text style={styles.coverStatLabel}>Categorias</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* ── Search + Filters ───────────────────────── */}
            <View style={styles.searchSection}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('empresas.searchPlaceholder')}
                  placeholderTextColor={Colors.textDim}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={styles.clearSearch}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.filters}>
                {FILTER_KEYS.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[styles.filterChip, activeFilter === key && styles.filterChipActive]}
                    onPress={() => setActiveFilter(key)}
                    activeOpacity={0.8}
                  >
                    {activeFilter === key && (
                      <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={999} />
                    )}
                    <Text style={[styles.filterText, activeFilter === key && styles.filterTextActive]}>
                      {filterLabel(key)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.resultsCount}>{countLabel}</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <CompanyListCard
            company={item}
            onPress={() => navigation.navigate('EmpresaProfile', { company: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyText}>Nenhuma empresa encontrada</Text>
            <TouchableOpacity onPress={() => { setSearch(''); setActiveFilter('all'); }}>
              <Text style={styles.emptyReset}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  listContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 23,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.25)',
    marginTop: 4,
  },
  headerBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#00C48C',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    padding: 0,
  },
  clearSearch: {
    fontSize: 14,
    color: Colors.textDim,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  filterChipActive: {
    borderColor: 'transparent',
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textMuted,
    zIndex: 1,
  },
  filterTextActive: {
    color: Colors.white,
    fontFamily: 'Inter_400Regular',
  },
  resultsCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
    marginBottom: 4,
  },
  companyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  coverImage: {
    width: '100%',
    height: 140,
    justifyContent: 'flex-end',
  },
  coverBadges: {
    flexDirection: 'row',
    gap: 6,
    padding: 10,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(47,107,255,0.85)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.white,
  },
  categoryBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.3)',
  },
  categoryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.purple,
  },
  cardBody: {
    padding: 16,
    overflow: 'hidden',
    gap: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoInitial: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  companyName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ratingText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.white,
  },
  reviewCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPin: { fontSize: 12 },
  locationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  serviceTagText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  profileBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.35)',
  },
  profileBtnText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.blue,
  },
  whatsappBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  whatsappText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textMuted,
  },
  emptyReset: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.cyan,
  },
  coverHero: {
    width: SW,
    height: HERO_H,
    marginHorizontal: -16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  coverTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(4,8,15,0.5)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.4)',
  },
  coverBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C48C',
  },
  coverBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#00C48C',
    letterSpacing: 1.2,
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 6,
  },
  coverTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  coverSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  coverStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(4,8,15,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
  },
  coverStat: { flex: 1, alignItems: 'center', gap: 3 },
  coverStatValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
  },
  coverStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
  },
  coverStatDiv: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
  },
  searchSection: {
    paddingHorizontal: 0,
  },
});
