import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { NETFLIX_CATEGORIES, PROJECT_OF_MONTH, NetflixVideo, NetflixCategory } from '../data/mockData';
import YoutubePlayerModal from '../components/YoutubePlayer';
import { useWatchHistory } from '../contexts/WatchHistoryContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.563);
const HERO_IMAGE = require('../../assets/hero-cursos.png');
const CARD_W = SW * 0.38;
const CARD_H = CARD_W * 1.5;
const COURSE_W = SW * 0.52;

// ─── Animated Particles ────────────────────────────────────────────────────────
function Particles() {
  const dots = useRef(
    Array.from({ length: 18 }, () => ({
      x: Math.random() * SW,
      y: Math.random() * HERO_H,
      s: Math.random() * 2.5 + 1,
      anim: new Animated.Value(Math.random()),
    }))
  ).current;

  useEffect(() => {
    dots.forEach((d) => {
      const loop = () =>
        Animated.sequence([
          Animated.timing(d.anim, { toValue: 1, duration: 1800 + Math.random() * 2000, useNativeDriver: true }),
          Animated.timing(d.anim, { toValue: 0.15, duration: 1800 + Math.random() * 2000, useNativeDriver: true }),
        ]).start(loop);
      loop();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            borderRadius: d.s / 2,
            backgroundColor: i % 3 === 0 ? Colors.cyan : i % 3 === 1 ? Colors.purple : Colors.blue,
            opacity: d.anim,
          }}
        />
      ))}
    </View>
  );
}

// ─── Thumbnail Grid (hero background mosaic) ───────────────────────────────────
const THUMB_URLS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=60',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&q=60',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200&q=60',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&q=60',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&q=60',
  'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=200&q=60',
];

function ThumbnailGrid() {
  const cols = 3;
  const cellW = SW / cols;
  const cellH = cellW * 0.72;
  const rows = Math.ceil(HERO_H / cellH) + 1;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const idx = (r * cols + c) % THUMB_URLS.length;
          return (
            <ImageBackground
              key={`${r}-${c}`}
              source={{ uri: THUMB_URLS[idx] }}
              style={{ position: 'absolute', left: c * cellW, top: r * cellH, width: cellW, height: cellH }}
              resizeMode="cover"
            />
          );
        })
      )}
    </View>
  );
}

// ─── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner({ onWatch, onDetails }: { onWatch: () => void; onDetails?: () => void }) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.heroWrap, { height: HERO_H + insets.top }]}>
      <Image
        source={HERO_IMAGE}
        style={{ width: SW, height: HERO_H + insets.top }}
        resizeMode="stretch"
      />
      <Grad
        colors={['rgba(4,8,15,0.2)', 'rgba(4,8,15,0.0)', 'rgba(4,8,15,0.55)', 'rgba(4,8,15,0.92)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.heroContent, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity style={styles.heroWatchBtn} onPress={onWatch} activeOpacity={0.88}>
          <Text style={styles.heroWatchIcon}>▶</Text>
          <Text style={styles.heroWatchText}>{t('cursos.watchNow')}</Text>
        </TouchableOpacity>

        <Text style={styles.heroTitle}>{t('cursos.heroTitle')}</Text>
      </View>
    </View>
  );
}

// ─── Netflix Video Card ────────────────────────────────────────────────────────
function NetflixCard({ video, isCourse, onPlay, accent }: { video: NetflixVideo; isCourse?: boolean; onPlay: () => void; accent: string }) {
  const w = isCourse ? COURSE_W : CARD_W;
  const thumbH = isCourse ? COURSE_W * 0.52 : CARD_W * 0.72;
  const totalH = isCourse ? COURSE_W * 0.64 + 52 : CARD_H;

  return (
    <TouchableOpacity activeOpacity={0.88} style={[styles.card, { width: w, height: totalH, marginRight: 10 }]} onPress={onPlay}>
      {/* Thumbnail area — heavily darkened */}
      <View style={{ width: w, height: thumbH, overflow: 'hidden', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <ImageBackground
          source={{ uri: video.thumbnail }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Strong dark overlay for uniformity */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(4,8,15,0.52)' }]} />
        <Grad colors={['rgba(4,8,15,0.0)', 'rgba(4,8,15,0.70)']} style={StyleSheet.absoluteFill} />
        {/* Category color tint at top */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: accent + '12' }]} />

        {/* Play button centered */}
        <View style={StyleSheet.absoluteFill as any} pointerEvents="none">
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={[styles.cardPlay, { borderColor: accent + '80', backgroundColor: 'rgba(4,8,15,0.55)' }]}>
              <Text style={{ color: accent, fontSize: 11 }}>▶</Text>
            </View>
          </View>
        </View>

        {/* Tag top-left */}
        {video.tag && (
          <View style={[styles.cardTag, { backgroundColor: accent + '28', borderColor: accent + '50' }]}>
            <Text style={[styles.cardTagText, { color: accent }]}>{video.tag}</Text>
          </View>
        )}

        {/* Premium badge */}
        {video.isPremium && (
          <View style={styles.cardPremiumBadge}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={6} />
            <Text style={styles.cardPremiumText}>★</Text>
          </View>
        )}
      </View>

      {/* Info panel — solid dark, uniform */}
      <View style={[styles.cardInfo, { borderColor: accent + '28' }]}>
        {/* Left accent stripe */}
        <View style={[styles.cardStripe, { backgroundColor: accent }]} />
        <View style={{ flex: 1, gap: 4 }}>
          {video.progress !== undefined && (
            <View style={styles.cardProgressTrack}>
              <View style={[styles.cardProgressFill, { width: `${video.progress}%`, backgroundColor: accent }]} />
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>{video.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardDur}>{video.duration}</Text>
            <Text style={styles.cardViews}>{video.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Netflix Row ───────────────────────────────────────────────────────────────
function NetflixRow({ category, onPlay, onSeeAll }: { category: NetflixCategory; onPlay: (v: NetflixVideo) => void; onSeeAll: (id: string) => void }) {
  const { t } = useLanguage();
  const isCourse = category.id === 'cursos';
  const accentColor = category.id === 'modelagem' ? Colors.purple
    : category.id === 'cursos' ? Colors.amber
    : category.id === 'obras' ? Colors.blue
    : category.id === 'casas' ? '#00C48C'
    : category.id === 'desastres' ? '#FF4D4D'
    : Colors.cyan;

  return (
    <View style={styles.rowWrap}>
      <View style={styles.rowHeader}>
        <View style={[styles.rowAccentLine, { backgroundColor: accentColor, shadowColor: accentColor }]} />
        <Text style={styles.rowTitle}>{category.title}</Text>
        <View style={styles.rowDividerLine} />
        <TouchableOpacity style={styles.rowSeeAllBtn} onPress={() => onSeeAll(category.id)}>
          <Text style={styles.rowSeeAll}>{t('cursos.seeAll')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={category.videos}
        keyExtractor={(v) => v.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <NetflixCard video={item} isCourse={isCourse} onPlay={() => onPlay(item)} accent={accentColor} />
        )}
      />
    </View>
  );
}

// ─── Category Filter Pills ─────────────────────────────────────────────────────
function CategoryPills({ active, onChange, categories }: { active: string; onChange: (id: string) => void; categories: typeof NETFLIX_CATEGORIES }) {
  const { t } = useLanguage();
  const pills = [{ id: 'all', label: t('cursos.allFilter') }, ...categories.map((c) => ({ id: c.id, label: c.title }))];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsRow}
      style={styles.pillsWrap}
    >
      {pills.map((p) => {
        const isActive = active === p.id;
        return (
          <TouchableOpacity
            key={p.id}
            onPress={() => onChange(p.id)}
            style={[styles.pill, isActive && styles.pillActive]}
            activeOpacity={0.8}
          >
            {isActive && <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={999} />}
            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{p.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function CursosScreen() {
  const { opacity, translateY } = useEntryAnimation();
  const { t } = useLanguage();
  const [playerVideo, setPlayerVideo] = useState<{ id: string; title: string; thumb: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToHistory } = useWatchHistory();

  const openPlayer = (id: string, title: string, thumb: string) => {
    addToHistory({ id, title, thumbnail: thumb, youtubeId: id, watchedAt: new Date() });
    setPlayerVideo({ id, title, thumb });
  };
  const closePlayer = () => setPlayerVideo(null);

  const categoryTitles: string[] = t('netflixCategoryTitles');
  const translatedCategories = NETFLIX_CATEGORIES.map((c, i) => ({ ...c, title: categoryTitles[i] ?? c.title }));

  const visibleCategories = activeCategory === 'all'
    ? translatedCategories
    : translatedCategories.filter((c) => c.id === activeCategory);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <Animated.ScrollView
        style={[{ opacity, transform: [{ translateY }] }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroBanner
          onWatch={() => openPlayer(PROJECT_OF_MONTH.youtubeId, PROJECT_OF_MONTH.title, PROJECT_OF_MONTH.thumbnail)}
        />

        <CategoryPills active={activeCategory} onChange={setActiveCategory} categories={translatedCategories} />

        <View style={styles.categoriesWrap}>
          {visibleCategories.map((cat) => (
            <NetflixRow
              key={cat.id}
              category={cat}
              onPlay={(v) => openPlayer(
                v.youtubeId ?? PROJECT_OF_MONTH.youtubeId,
                v.title,
                v.thumbnail,
              )}
              onSeeAll={(id) => setActiveCategory(id)}
            />
          ))}
        </View>

        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      <YoutubePlayerModal
        visible={!!playerVideo}
        videoId={playerVideo?.id ?? ''}
        title={playerVideo?.title ?? ''}
        onClose={closePlayer}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  scrollContent: {},

  // Hero
  heroWrap: { width: SW, overflow: 'hidden' },
  heroContent: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 24, gap: 16 },
  heroBadgeRow: { marginBottom: 10 },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white, letterSpacing: 1.2 },
  heroTitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },
  heroSub: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.cyan, marginBottom: 8 },
  heroDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 19, marginBottom: 12 },
  heroTags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  heroTag: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
  },
  heroTagText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  heroDuration: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.55)' },
  heroRating: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.amber },
  heroBtns: { flexDirection: 'row', gap: 12 },
  heroWatchBtn: {
    height: 38, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 7,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroWatchIcon: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  heroWatchText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  heroDetailBtn: {
    flex: 1, height: 46, borderRadius: 14,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(4,8,15,0.4)',
  },
  heroDetailText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: 'rgba(255,255,255,0.88)' },

  // Pills
  pillsWrap: { marginTop: 16, marginBottom: 4 },
  pillsRow: { paddingHorizontal: 16, gap: 8 },
  pill: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 999, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  pillActive: { borderColor: 'transparent' },
  pillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textMuted },
  pillTextActive: { color: Colors.white, zIndex: 1 },

  // Categories
  categoriesWrap: { marginTop: 8 },
  rowWrap: { marginBottom: 28 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  rowAccentLine: {
    width: 3,
    height: 20,
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  rowTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white, letterSpacing: 0.5 },
  rowDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  rowSeeAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.45)',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  rowSeeAll: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.purple, letterSpacing: 0.3 },

  // Card
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#070D1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardPlay: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTag: {
    position: 'absolute', top: 8, left: 8,
    borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1,
  },
  cardTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.5 },
  cardPremiumBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 6, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  cardPremiumText: { fontSize: 10, color: Colors.amber },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#08101F',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingRight: 10,
    gap: 0,
  },
  cardStripe: { width: 3, borderRadius: 2, marginRight: 8, marginLeft: 2 },
  cardProgressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2, marginBottom: 4 },
  cardProgressFill: { height: 2, borderRadius: 2 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.white, lineHeight: 15 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  cardDur: { fontFamily: 'Inter_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.4)' },
  cardViews: { fontFamily: 'Inter_400Regular', fontSize: 9, color: 'rgba(255,255,255,0.4)' },

  // Toast
  toast: {
    position: 'absolute', bottom: 110, alignSelf: 'center',
    backgroundColor: 'rgba(123,97,255,0.95)', borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  toastText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white },
});
