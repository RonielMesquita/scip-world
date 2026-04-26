import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Grad from './Grad';
import Colors from '../constants/colors';
import { COMPANIES, Company } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, { opacity: star <= Math.round(rating) ? 1 : 0.25 }]}>
          ★
        </Text>
      ))}
    </View>
  );
}

function CompanyCard({ company, onPress }: { company: Company; onPress: () => void }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Grad
        colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={16}
      />

      {/* Logo + Name Row */}
      <View style={styles.cardHeader}>
        <View style={[styles.logo, { backgroundColor: company.logoColor + '20', borderColor: company.logoColor + '40' }]}>
          <Text style={[styles.logoText, { color: company.logoColor }]}>
            {company.logoInitial}
          </Text>
        </View>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text style={styles.companyName} numberOfLines={1}>{company.name}</Text>
            {company.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>{t('featured.verified')}</Text>
              </View>
            )}
          </View>
          <Text style={styles.category}>{company.category}</Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <StarRating rating={company.rating} />
        <Text style={styles.ratingValue}>{company.rating.toFixed(1)}</Text>
        <Text style={styles.reviewCount}>({company.reviewCount})</Text>
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>{company.location}</Text>
      </View>

      {/* Services chips */}
      <View style={styles.services}>
        {company.services.slice(0, 2).map((service, idx) => (
          <View key={idx} style={styles.serviceChip}>
            <Text style={styles.serviceText}>{service}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

interface FeaturedCompaniesProps {
  onCompanyPress?: (company: Company) => void;
}

export default function FeaturedCompanies({ onCompanyPress }: FeaturedCompaniesProps) {
  const { t } = useLanguage();
  const navigation = useNavigation();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleBlock}>
          <View style={styles.accentBar} />
          <View>
            <Text style={styles.sectionTitle}>{t('featured.companiesTitle')}</Text>
            <Text style={styles.sectionSubtitle}>{t('featured.companiesSubtitle')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAll} onPress={() => (navigation as any).navigate('Empresas')}>
          <Text style={styles.viewAllText}>{t('featured.seeAllCompanies')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={COMPANIES.slice(0, 4)}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CompanyCard company={item} onPress={() => onCompanyPress?.(item)} />
        )}
      />
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
    backgroundColor: Colors.purple,
    shadowColor: Colors.purple,
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
    gap: 12,
  },
  card: {
    width: 200,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  logoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  nameBlock: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  companyName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.white,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(47,107,255,0.15)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.25)',
  },
  verifiedText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: Colors.blue,
  },
  category: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 11,
    color: Colors.star,
  },
  ratingValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.white,
  },
  reviewCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textDim,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 10,
  },
  locationIcon: {
    fontSize: 10,
  },
  locationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  serviceChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  serviceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: Colors.textMuted,
  },
});
