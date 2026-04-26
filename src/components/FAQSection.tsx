import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SPECIALISTS } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import Grad from './Grad';
import Colors from '../constants/colors';
import { Platform } from 'react-native';
import { FAQ_ITEMS, FAQItem } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

function FAQItemComponent({ item, index }: { item: FAQItem; index: number }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null);
  const animValue = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.parallel([
      Animated.timing(animValue, {
        toValue,
        duration: 260,
        useNativeDriver: false,
      }),
      Animated.spring(rotateAnim, {
        toValue,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }),
    ]).start();
    setExpanded(!expanded);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const icons = ['bulb-outline', 'time-outline', 'construct-outline', 'checkmark-circle-outline', 'cash-outline'] as const;

  return (
    <TouchableOpacity
      style={[styles.faqItem, expanded && styles.faqItemExpanded]}
      onPress={toggle}
      activeOpacity={0.85}
    >
      <Grad
        colors={
          expanded
            ? ['rgba(123,97,255,0.08)', 'rgba(255,85,0,0.03)']
            : ['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']
        }
        style={StyleSheet.absoluteFill}
        borderRadius={16}
      />

      {/* Question row */}
      <View style={styles.questionRow}>
        <View style={[styles.iconBox, expanded && styles.iconBoxActive]}>
          <Ionicons name={icons[index % icons.length]} size={16} color={expanded ? Colors.purple : Colors.textMuted} />
        </View>
        <Text style={[styles.question, expanded && styles.questionActive]}>
          {item.question}
        </Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <View style={[styles.arrowBox, expanded && styles.arrowBoxActive]}>
            <Ionicons name="chevron-down-outline" size={14} color={expanded ? Colors.amber : Colors.textDim} />
          </View>
        </Animated.View>
      </View>

      {/* Animated answer */}
      <Animated.View style={{ maxHeight, overflow: 'hidden', opacity }}>
        <View style={styles.answerContainer}>
          <View style={styles.answerDivider} />
          <Text style={styles.answer}>{item.answer}</Text>
          <View style={styles.helpfulRow}>
            {helpful ? (
              <Text style={styles.helpfulText}>
                {helpful === 'yes' ? t('faq.thanks') : t('faq.improve')}
              </Text>
            ) : (
              <>
                <Text style={styles.helpfulText}>{t('faq.helpful')}</Text>
                <TouchableOpacity style={styles.helpfulBtn} onPress={() => setHelpful('yes')}>
                  <Text style={styles.helpfulBtnText}>{t('faq.yes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.helpfulBtn, styles.helpfulBtnNo]} onPress={() => setHelpful('no')}>
                  <Text style={styles.helpfulBtnNoText}>{t('faq.no')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function FAQSection() {
  const { t } = useLanguage();
  const navigation = useNavigation();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('faq.title')}</Text>
        <Text style={styles.sectionSubtitle}>{t('faq.subtitle')}</Text>
      </View>

      <View style={styles.list}>
        {FAQ_ITEMS.map((item, index) => {
          const translated: { question: string; answer: string }[] = t('faqItems');
          const tItem = translated[index];
          return (
            <FAQItemComponent
              key={item.id}
              item={{ ...item, question: tItem?.question ?? item.question, answer: tItem?.answer ?? item.answer }}
              index={index}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.contactCTA} activeOpacity={0.88} onPress={() => (navigation as any).navigate('Especialistas')}>
        {/* Background gradient */}
        <Grad
          colors={['rgba(47,107,255,0.18)', 'rgba(123,97,255,0.14)', 'rgba(4,8,15,0.95)']}
          style={StyleSheet.absoluteFill}
          borderRadius={20}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {/* Glow top border */}
        <View style={styles.ctaTopBorder} />

        {/* Online avatars */}
        <View style={styles.ctaAvatarsRow}>
          {SPECIALISTS.filter(s => s.isOnline).slice(0, 4).map((s, i) => (
            <View
              key={s.id}
              style={[styles.ctaAvatar, { backgroundColor: s.avatarColor, marginLeft: i === 0 ? 0 : -10, zIndex: 4 - i }]}
            >
              <Text style={styles.ctaAvatarText}>{s.avatarInitial}</Text>
            </View>
          ))}
          <View style={styles.ctaOnlineBadge}>
            <View style={styles.ctaOnlineDot} />
            <Text style={styles.ctaOnlineText}>
              {SPECIALISTS.filter(s => s.isOnline).length} online
            </Text>
          </View>
        </View>

        {/* Text */}
        <Text style={styles.ctaTitle}>{t('faq.ctaTitle')}</Text>
        <Text style={styles.ctaDesc}>{t('faq.ctaDesc')}</Text>

        {/* Button */}
        <View style={styles.ctaButton}>
          <Grad
            colors={Colors.gradients.tech}
            style={StyleSheet.absoluteFill}
            borderRadius={12}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Ionicons name="people-outline" size={16} color="#fff" />
          <Text style={styles.ctaButtonText}>{t('faq.ctaButton')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
  list: {
    gap: 8,
  },
  faqItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  faqItemExpanded: {
    borderColor: 'rgba(123,97,255,0.2)',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.15)',
    flexShrink: 0,
  },
  iconBoxActive: {
    backgroundColor: 'rgba(123,97,255,0.2)',
  },
  itemIcon: {
    fontSize: 14,
  },
  question: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  questionActive: {
    color: Colors.white,
  },
  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  arrowBoxActive: {
    backgroundColor: 'rgba(123,97,255,0.12)',
  },
  arrow: {
    fontSize: 10,
    color: Colors.textDim,
  },
  arrowActive: {
    color: Colors.amber,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  answerDivider: {
    height: 1,
    backgroundColor: 'rgba(123,97,255,0.1)',
    marginBottom: 12,
  },
  answer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 21,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpfulText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    marginRight: 4,
  },
  helpfulBtn: {
    backgroundColor: 'rgba(0,196,140,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.2)',
  },
  helpfulBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#00C48C',
  },
  helpfulBtnNo: {
    backgroundColor: 'rgba(255,77,77,0.08)',
    borderColor: 'rgba(255,77,77,0.15)',
  },
  helpfulBtnNoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#FF4D4D',
  },
  contactCTA: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.3)',
    overflow: 'hidden',
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: Colors.blue, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  ctaTopBorder: {
    position: 'absolute',
    top: 0,
    left: 32,
    right: 32,
    height: 1.5,
    backgroundColor: Colors.blue,
    opacity: 0.5,
    borderRadius: 1,
  },
  ctaAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ctaAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },
  ctaAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: Colors.white,
  },
  ctaOnlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 14,
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.25)',
  },
  ctaOnlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C48C',
  },
  ctaOnlineText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#00C48C',
  },
  ctaTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  ctaDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  ctaButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  ctaButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
});
