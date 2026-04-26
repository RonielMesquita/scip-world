import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
  Animated,
  Image,
} from 'react-native';
import Grad from './Grad';
import Colors from '../constants/colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(SW * 1.333); // hero-scip.png ratio
const HERO_IMAGE = require('../../assets/hero-scip.png');

// ─── Scanning Line ─────────────────────────────────────────────────────────────
function ScanLine({ heroH }: { heroH: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 3200, useNativeDriver: true, isInteraction: false }),
        Animated.timing(anim, { toValue: 0, duration: 3200, useNativeDriver: true, isInteraction: false }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [heroH * 0.1, heroH * 0.75] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.scanLine, { transform: [{ translateY }] }]}
    />
  );
}

// ─── Floating Particles ────────────────────────────────────────────────────────
function Particles({ heroH }: { heroH: number }) {
  const dots = useRef(
    Array.from({ length: 28 }, () => ({
      x: Math.random() * SW,
      y: Math.random() * heroH,
      r: Math.random() * 2 + 0.8,
      anim: new Animated.Value(Math.random()),
      color: ['#4CC9F0', '#7B61FF', '#2F6BFF', '#00C48C'][Math.floor(Math.random() * 4)],
    }))
  ).current;

  useEffect(() => {
    dots.forEach((d) => {
      const pulse = () =>
        Animated.sequence([
          Animated.timing(d.anim, { toValue: 1, duration: 1500 + Math.random() * 2500, useNativeDriver: true, isInteraction: false }),
          Animated.timing(d.anim, { toValue: 0.08, duration: 1500 + Math.random() * 2500, useNativeDriver: true, isInteraction: false }),
        ]).start(pulse);
      pulse();
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((d, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', left: d.x, top: d.y,
          width: d.r * 2, height: d.r * 2, borderRadius: d.r,
          backgroundColor: d.color, opacity: d.anim,
        }} />
      ))}
    </View>
  );
}

// ─── Pulsing Rings ─────────────────────────────────────────────────────────────
function PulsingRings({ cx, cy }: { cx: number; cy: number }) {
  const rings = useRef(
    Array.from({ length: 3 }, (_, i) => ({
      scale: new Animated.Value(0.4 + i * 0.2),
      opacity: new Animated.Value(0.5 - i * 0.12),
      delay: i * 900,
    }))
  ).current;

  useEffect(() => {
    rings.forEach((r) => {
      const loop = () =>
        Animated.parallel([
          Animated.sequence([
            Animated.delay(r.delay),
            Animated.timing(r.scale, { toValue: 1.8, duration: 3000, useNativeDriver: true, isInteraction: false }),
            Animated.timing(r.scale, { toValue: 0.4, duration: 0, useNativeDriver: true, isInteraction: false }),
          ]),
          Animated.sequence([
            Animated.delay(r.delay),
            Animated.timing(r.opacity, { toValue: 0, duration: 3000, useNativeDriver: true, isInteraction: false }),
            Animated.timing(r.opacity, { toValue: 0.45, duration: 0, useNativeDriver: true, isInteraction: false }),
          ]),
        ]).start(loop);
      loop();
    });
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'flex-start', justifyContent: 'flex-start' }]} pointerEvents="none">
      {rings.map((r, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          left: cx - 60, top: cy - 60,
          width: 120, height: 120, borderRadius: 60,
          borderWidth: 1,
          borderColor: i === 0 ? Colors.cyan : i === 1 ? Colors.purple : Colors.blue,
          transform: [{ scale: r.scale }],
          opacity: r.opacity,
        }} />
      ))}
    </View>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
interface HeroBannerProps {
  onCTAPress: () => void;
}

export default function HeroBanner({ onCTAPress }: HeroBannerProps) {
  const { t } = useLanguage();
  const ringCX = SW * 0.5;
  const ringCY = HERO_HEIGHT * 0.38;
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1.07, duration: 7000, useNativeDriver: true, isInteraction: false }),
        Animated.timing(zoom, { toValue: 1.00, duration: 7000, useNativeDriver: true, isInteraction: false }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={HERO_IMAGE}
        style={[StyleSheet.absoluteFill, { width: SW, height: HERO_HEIGHT, transform: [{ scale: zoom }] }]}
        resizeMode="cover"
      />
      <View style={styles.image}>
        <Grad
          colors={['transparent', 'rgba(6,9,26,0.35)']}
          start={{ x: 0.5, y: 0.72 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Animations */}
        <Particles heroH={HERO_HEIGHT} />
        <ScanLine heroH={HERO_HEIGHT} />
        <PulsingRings cx={ringCX} cy={ringCY} />

        {/* CTA */}
        <View style={styles.ctaArea}>
          <TouchableOpacity style={styles.ctaWrapper} onPress={onCTAPress} activeOpacity={0.85}>
            <View style={styles.ctaDot} />
            <Text style={styles.ctaText}>{t('hero.cta')}</Text>
            <View style={styles.ctaArrow}>
              <Text style={styles.ctaArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Grad colors={['transparent', Colors.bgDeep]} style={styles.bottomFade} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: SW, height: HERO_HEIGHT, overflow: 'hidden' },
  image: { width: '100%', height: '100%', justifyContent: 'flex-end' },

  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: Colors.cyan,
    opacity: 0.25,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },

  scipBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(4,8,15,0.55)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.3)',
  },
  scipDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.cyan },
  scipBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.cyan, letterSpacing: 1.5 },

  ctaArea: { alignItems: 'center', paddingBottom: 24 },
  ctaWrapper: {
    flexDirection: 'row', alignItems: 'center',
    height: 50, paddingHorizontal: 28,
    borderRadius: 999, overflow: 'hidden',
    gap: 10, borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.5)',
    backgroundColor: 'rgba(4,8,15,0.45)',
  },
  ctaDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.cyan },
  ctaText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, letterSpacing: 0.3, zIndex: 1 },
  ctaArrow: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(76,201,240,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctaArrowText: { color: Colors.cyan, fontSize: 13 },

  bottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
});
