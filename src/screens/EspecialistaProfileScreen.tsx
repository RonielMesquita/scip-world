import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Share,
} from 'react-native';
import LeadFormModal from '../components/LeadFormModal';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileRoute = RouteProp<RootStackParamList, 'EspecialistaProfile'>;

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Carlos Menezes', rating: 5, date: 'Mar 2024', text: 'Especialista excepcional! Resolveu minha dúvida sobre fundações em menos de 30 minutos. Super recomendo.' },
  { id: 'r2', author: 'Ana Paula Lima', rating: 5, date: 'Fev 2024', text: 'Muito didático e paciente. Explicou todo o processo de instalação de painéis SCIP com clareza.' },
  { id: 'r3', author: 'Ricardo Alves', rating: 4, date: 'Jan 2024', text: 'Ótimo profissional, muito conhecimento técnico. Atendimento rápido e objetivo.' },
];

const TAB_IDS = ['Sobre', 'Serviços', 'Avaliações'];

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? 'star' : 'star-outline'}
          size={size}
          color={i <= Math.round(rating) ? Colors.amber : Colors.textDim}
        />
      ))}
    </View>
  );
}

export default function EspecialistaProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<ProfileRoute>();
  const { specialist } = route.params;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Sobre');
  const [showLead, setShowLead] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        title: specialist.name,
        message: `Confira o perfil de ${specialist.name} — ${specialist.role} no SCIP World.\n📍 ${specialist.location} | ⭐ ${specialist.rating.toFixed(1)} (${specialist.reviewCount} avaliações)`,
      });
    } catch {}
  };

  return (
    <View style={[styles.root, { backgroundColor: Colors.bgDeep }]}>
      <StatusBar barStyle="light-content" />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* ── Hero ── */}
        <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <Grad
            colors={[specialist.avatarColor + '40', specialist.avatarColor + '08']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Grad
            colors={['transparent', Colors.bgDeep]}
            style={[StyleSheet.absoluteFill, { top: '50%' }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />

          {/* Top bar */}
          <View style={styles.heroTopBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={[styles.avatarRing, { borderColor: specialist.avatarColor }]}>
            <View style={[styles.avatar, { backgroundColor: specialist.avatarColor + '22' }]}>
              <Grad
                colors={[specialist.avatarColor, specialist.avatarColor + 'AA']}
                style={StyleSheet.absoluteFill}
                borderRadius={44}
              />
              <Text style={styles.avatarText}>{specialist.avatarInitial}</Text>
            </View>
          </View>

          {/* Online indicator */}
          {specialist.isOnline && (
            <View style={styles.onlineTag}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineTagText}>Online agora</Text>
            </View>
          )}

          {/* Name + role */}
          <View style={styles.heroNames}>
            <View style={styles.nameRow}>
              <Text style={styles.heroName}>{specialist.name}</Text>
              {specialist.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.cyan} />
              )}
            </View>
            <Text style={styles.heroRole}>{specialist.role}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <StarRow rating={specialist.rating} size={15} />
            <Text style={styles.ratingVal}>{specialist.rating.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({specialist.reviewCount} avaliações)</Text>
          </View>
        </View>

        {/* ── Stats Card ── */}
        <View style={styles.statsCard}>
          <Grad
            colors={['rgba(11,28,61,0.97)', 'rgba(7,13,26,0.99)']}
            style={StyleSheet.absoluteFill}
            borderRadius={20}
          />
          <View style={[styles.statsCardAccent, { backgroundColor: specialist.avatarColor }]} />
          <View style={styles.statsRow}>
            {[
              { icon: 'briefcase-outline', value: String(specialist.projectsDone), label: 'Projetos' },
              { icon: 'time-outline', value: specialist.responseTime, label: 'Resposta' },
              { icon: 'ribbon-outline', value: `${specialist.yearsExp} anos`, label: 'Experiência' },
              { icon: 'star', value: specialist.rating.toFixed(1), label: 'Nota' },
            ].map((stat, idx, arr) => (
              <React.Fragment key={stat.label}>
                <View style={styles.stat}>
                  <Ionicons name={stat.icon as any} size={16} color={specialist.avatarColor} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                {idx < arr.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Info Block ── */}
        <View style={styles.infoBlock}>
          <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textMuted} />
            <Text style={styles.infoText}>{specialist.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="layers-outline" size={15} color={Colors.textMuted} />
            <Text style={styles.infoText}>
              {specialist.area.charAt(0).toUpperCase() + specialist.area.slice(1).replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name={specialist.isVerified ? 'checkmark-circle-outline' : 'time-outline'}
              size={15}
              color={specialist.isVerified ? '#00C48C' : Colors.textDim}
            />
            <Text style={[styles.infoText, specialist.isVerified && { color: '#00C48C' }]}>
              {specialist.isVerified ? 'Profissional Verificado SCIP World' : 'Em processo de verificação'}
            </Text>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabsWrapper}>
          {TAB_IDS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              {activeTab === tab && (
                <Grad
                  colors={[specialist.avatarColor, specialist.avatarColor + 'BB']}
                  style={StyleSheet.absoluteFill}
                  borderRadius={999}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              )}
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab Content ── */}
        <View style={styles.tabContent}>

          {/* SOBRE */}
          {activeTab === 'Sobre' && (
            <View style={{ gap: 16 }}>
              <Text style={styles.sectionTitle}>Sobre o Especialista</Text>
              <View style={styles.bioCard}>
                <Grad
                  colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.bioText}>{specialist.bio}</Text>
              </View>

              {specialist.certifications && specialist.certifications.length > 0 && (
                <View style={styles.certCard}>
                  <Grad
                    colors={[specialist.avatarColor + '15', specialist.avatarColor + '05']}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  <View style={styles.certHeader}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={specialist.avatarColor} />
                    <Text style={styles.certTitle}>Certificações e Registros</Text>
                  </View>
                  {specialist.certifications.map((cert, i) => (
                    <View key={i} style={styles.certItem}>
                      <View style={[styles.certDot, { backgroundColor: specialist.avatarColor }]} />
                      <Text style={styles.certText}>{cert}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* SERVIÇOS */}
          {activeTab === 'Serviços' && (
            <View style={{ gap: 10 }}>
              <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
              {specialist.services.map((service, idx) => (
                <View key={idx} style={styles.serviceItem}>
                  <Grad
                    colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  <View style={[styles.serviceIconBox, { backgroundColor: specialist.avatarColor + '20' }]}>
                    <Ionicons name="construct-outline" size={18} color={specialist.avatarColor} />
                  </View>
                  <View style={styles.serviceBody}>
                    <Text style={styles.serviceName}>{service}</Text>
                    <Text style={styles.serviceDesc}>Solicite via formulário SCIP World</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={16} color={Colors.textDim} />
                </View>
              ))}
            </View>
          )}

          {/* AVALIAÇÕES */}
          {activeTab === 'Avaliações' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Avaliações dos Clientes</Text>

              {/* Rating Summary */}
              <View style={styles.ratingSummary}>
                <Grad
                  colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                  style={StyleSheet.absoluteFill}
                  borderRadius={20}
                />
                <View style={styles.ratingBig}>
                  <Text style={[styles.ratingBigValue, { color: Colors.amber }]}>
                    {specialist.rating.toFixed(1)}
                  </Text>
                  <StarRow rating={specialist.rating} size={16} />
                  <Text style={styles.ratingBigCount}>{specialist.reviewCount} avaliações</Text>
                </View>
                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarStar}>{star}★</Text>
                      <View style={styles.ratingBarTrack}>
                        <View
                          style={[
                            styles.ratingBarFill,
                            {
                              width: `${star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : 2}%`,
                              backgroundColor: specialist.avatarColor,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Reviews */}
              {MOCK_REVIEWS.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <Grad
                    colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  <View style={styles.reviewHeader}>
                    <View style={[styles.reviewAvatar, { backgroundColor: specialist.avatarColor + '25', borderColor: specialist.avatarColor + '40' }]}>
                      <Text style={[styles.reviewAvatarText, { color: specialist.avatarColor }]}>{review.author[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.reviewMeta}>
                        <StarRow rating={review.rating} size={11} />
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky CTA ── */}
      <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 12 }]}>
        <Grad
          colors={['rgba(4,8,15,0)', 'rgba(4,8,15,0.98)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
        />
        <TouchableOpacity style={styles.ctaConsulta} activeOpacity={0.85} onPress={() => setShowLead(true)}>
          <Grad
            colors={[specialist.avatarColor, specialist.avatarColor + 'CC']}
            style={StyleSheet.absoluteFill}
            borderRadius={14}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Ionicons name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.ctaBtnText}>Solicitar Consulta</Text>
        </TouchableOpacity>
      </View>

      <LeadFormModal
        visible={showLead}
        onClose={() => setShowLead(false)}
        companyId={specialist.id}
        companyName={specialist.name}
        user={user}
        mode="consulta"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 12,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  heroTopBar: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(4,8,15,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: Colors.white,
    zIndex: 1,
  },
  onlineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.3)',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00C48C',
  },
  onlineTagText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#00C48C',
  },
  heroNames: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.white,
    textAlign: 'center',
  },
  heroRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingVal: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  ratingCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },

  statsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
      android: { elevation: 6 },
    }),
  },
  statsCardAccent: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    borderRadius: 1,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textDim,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignSelf: 'center',
  },

  infoBlock: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
  },

  tabsWrapper: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  tabActive: { borderColor: 'transparent' },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    zIndex: 1,
  },

  tabContent: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
    marginBottom: 4,
  },

  bioCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  bioText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 21,
  },

  certCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    gap: 8,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  certTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  certDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  certText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 12,
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceBody: { flex: 1 },
  serviceName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 3,
  },
  serviceDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
  },

  ratingSummary: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 4,
    gap: 16,
    alignItems: 'center',
  },
  ratingBig: {
    alignItems: 'center',
    gap: 4,
  },
  ratingBigValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
  },
  ratingBigCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  ratingBars: {
    flex: 1,
    gap: 5,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarStar: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    width: 20,
  },
  ratingBarTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.85,
  },

  reviewCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    gap: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  reviewAvatarText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  reviewAuthor: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.white,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  reviewDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textDim,
  },
  reviewText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 19,
  },

  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  ctaConsulta: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  ctaBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
});
