import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Grad from './Grad';
import Colors from '../constants/colors';
import { FEATURED_PROJECTS, Project } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 260;
const CARD_HEIGHT = 160;
const CARD_GAP = 12;

function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: project.image }}
        style={styles.cardImage}
        imageStyle={{ borderRadius: 16 }}
        resizeMode="cover"
      >
        {/* Overlay gradient */}
        <Grad
          colors={['transparent', 'rgba(4,8,15,0.85)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{project.type}</Text>
        </View>

        {/* Card content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{project.title}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardLocation}>📍 {project.location}</Text>
            <View style={styles.sizeChip}>
              <Text style={styles.cardSize}>{project.size}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

interface FeaturedProjectsProps {
  onProjectPress?: (project: Project) => void;
}

export default function FeaturedProjects({ onProjectPress }: FeaturedProjectsProps) {
  const { t } = useLanguage();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % FEATURED_PROJECTS.length;
        flatListRef.current?.scrollToIndex({
          index: next,
          animated: true,
          viewPosition: 0,
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScrollToIndexFailed = (info: any) => {
    const wait = new Promise<void>((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  };

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleBlock}>
          <View style={styles.accentBar} />
          <View>
            <Text style={styles.sectionTitle}>{t('featured.projectsTitle')}</Text>
            <Text style={styles.sectionSubtitle}>{t('featured.projectsSubtitle')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAll} onPress={() => navigation.getParent<any>()?.navigate('Estimar')}>
          <Text style={styles.viewAllText}>{t('featured.seeAll')}</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal List */}
      <FlatList
        ref={flatListRef}
        data={FEATURED_PROJECTS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => onProjectPress?.(item)}
          />
        )}
      />

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {FEATURED_PROJECTS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accentBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    backgroundColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  viewAll: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.3)',
  },
  viewAllText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.amber,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: 16,
  },
  typeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(123,97,255,0.85)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLocation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  sizeChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardSize: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.white,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: Colors.purple,
  },
});
