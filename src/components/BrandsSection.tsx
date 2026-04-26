import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
} from 'react-native';
import Grad from './Grad';
import Colors from '../constants/colors';
import { BRANDS, Brand } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const BRAND_LOGOS: Record<string, any> = {
  DeWalt:     require('../../assets/logo-dewalt.png'),
  Bosch:      require('../../assets/logo-bosch.png'),
  Makita:     require('../../assets/logo-makita.png'),
  Vonder:     require('../../assets/logo-vonder.png'),
  Tramontina: require('../../assets/logo-tramontina.png'),
};

const BRAND_URLS: Record<string, string> = {
  DeWalt:     'https://www.dewalt.com.br',
  Bosch:      'https://www.bosch.com.br',
  Makita:     'https://www.makita.com.br',
  Vonder:     'https://www.vonder.com.br',
  Tramontina: 'https://www.tramontina.com.br',
};

const BRAND_BG: Record<string, string> = {
  DeWalt:     '#FFCD11',
  Bosch:      '#1A5EAF',
  Makita:     '#00815E',
  Vonder:     '#F5A800',
  Tramontina: '#1B4D9B',
};

function BrandCard({ brand }: { brand: Brand }) {
  const logoSrc = BRAND_LOGOS[brand.name];
  const bgColor = BRAND_BG[brand.name] ?? brand.color;
  const url = BRAND_URLS[brand.name];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => url && Linking.openURL(url)}>
      <Grad
        colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={14}
      />
      <View style={[styles.logoBox, { backgroundColor: bgColor + '22', borderColor: bgColor + '45' }]}>
        {logoSrc ? (
          <Image
            source={logoSrc}
            style={styles.logoImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.logoFallback, { color: bgColor }]}>{brand.name[0]}</Text>
        )}
      </View>
      <Text style={styles.brandName}>{brand.name}</Text>
      <Text style={styles.brandTagline} numberOfLines={1}>{brand.tagline}</Text>
      <View style={[styles.brandAccent, { backgroundColor: bgColor }]} />
    </TouchableOpacity>
  );
}

export default function BrandsSection() {
  const { t } = useLanguage();
  const brandTaglines: string[] = t('brandTaglines');
  const translatedBrands = BRANDS.map((b, i) => ({ ...b, tagline: brandTaglines[i] ?? b.tagline }));
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerLine} />
        <Text style={styles.sectionTitle}>{t('featured.brandsTitle')}</Text>
        <View style={styles.headerLine} />
      </View>

      <FlatList
        data={translatedBrands}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <BrandCard brand={item} />}
      />

      <Text style={styles.disclaimer}>{t('featured.brandsDisclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sectionTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: 110,
    alignItems: 'center',
    borderRadius: 14,
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  logoFallback: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  brandName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.white,
    marginBottom: 3,
  },
  brandTagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: Colors.textDim,
    textAlign: 'center',
    lineHeight: 13,
  },
  brandAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.7,
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 32,
  },
});
