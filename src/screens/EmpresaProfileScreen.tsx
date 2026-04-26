import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  FlatList,
  Platform,
  Dimensions,
  Share,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '../constants/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LeadFormModal from '../components/LeadFormModal';

type ProfileRoute = RouteProp<RootStackParamList, 'EmpresaProfile'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: W } = Dimensions.get('window');
const TAB_IDS = ['Projetos', 'Serviços', 'Avaliações'];

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
  'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=400&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
];

const GALLERY_PROJECTS = [
  { uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', title: 'Residência Beira-Mar', area: '580 m²', description: 'Residência de alto padrão com estrutura em painéis SCIP, acabamento em concreto aparente e amplos espaços integrados.' },
  { uri: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', title: 'Villa Moderna', area: '320 m²', description: 'Villa com três suítes, piscina e área gourmet. Obra entregue em 8 meses com redução de 40% no custo estrutural.' },
  { uri: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80', title: 'Edifício Comercial Central', area: '2.100 m²', description: 'Complexo comercial de 4 pavimentos. Uso de SCIP reduziu o peso da estrutura em 65% comparado ao método convencional.' },
  { uri: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b9?w=800&q=80', title: 'Casa Sustentável', area: '210 m²', description: 'Projeto eco-friendly com painéis SCIP, telhado verde e captação de água da chuva. Certificação LEED conquistada.' },
  { uri: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', title: 'Condomínio Parque Verde', area: '890 m²', description: 'Conjunto de 6 unidades residenciais com fachadas em painéis SCIP pré-fabricados. Entregue com 3 semanas de antecedência.' },
  { uri: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', title: 'Galpão Industrial Norte', area: '4.500 m²', description: 'Estrutura industrial de grande porte com vedação total em painéis SCIP. Isolamento térmico e acústico certificado.' },
  { uri: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80', title: 'Residência Alto da Serra', area: '445 m²', description: 'Casa em terreno inclinado com fundação em radier e paredes SCIP. Integração perfeita com a paisagem natural.' },
  { uri: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80', title: 'Centro Corporativo Nexus', area: '1.800 m²', description: 'Escritórios de alto desempenho com fachada ventilada e estrutura híbrida metálica-SCIP. Prazo de entrega: 14 meses.' },
];

const MOCK_REVIEWS = [
  { id: 'r1', author: 'João Menezes', rating: 5, date: 'Mar 2024', text: 'Excelente empresa! Entregou tudo dentro do prazo e com qualidade superior ao esperado. Recomendo muito.' },
  { id: 'r2', author: 'Carla Oliveira', rating: 5, date: 'Fev 2024', text: 'Equipe muito profissional e atenciosa. O uso do sistema SCIP reduziu o prazo da obra em mais de 50%.' },
  { id: 'r3', author: 'Roberto Lima', rating: 4, date: 'Jan 2024', text: 'Ótimo trabalho. Algumas pequenas questões de comunicação no início, mas o resultado final foi excelente.' },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text key={s} style={{ fontSize: size, color: Colors.star, opacity: s <= Math.round(rating) ? 1 : 0.2 }}>★</Text>
      ))}
    </View>
  );
}

export default function EmpresaProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, language } = useLanguage();
  const lang = (['pt', 'en', 'es'].includes(language) ? language : 'pt') as 'pt' | 'en' | 'es';
  const navigation = useNavigation<NavProp>();
  const route = useRoute<ProfileRoute>();
  const { company } = route.params;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Projetos');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const tabLabels: string[] = t('empresaProfile.tabs');

  const handleShare = async () => {
    try {
      await Share.share({
        title: t('empresaProfile.shareTitle').replace('{name}', company.name),
        message: t('empresaProfile.shareMsg')
          .replace('{name}', company.name)
          .replace('{rating}', company.rating.toFixed(1))
          .replace('{location}', company.location)
          .replace('{id}', company.id),
      });
    } catch {}
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: company.coverImage }}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <Grad
              colors={['rgba(4,8,15,0.1)', 'rgba(4,8,15,0.68)']}
              style={StyleSheet.absoluteFill}
            />

            {/* Back Button */}
            <TouchableOpacity
              style={[styles.backBtn, { top: insets.top + 8 }]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              style={[styles.shareBtn, { top: insets.top + 8 }]}
              activeOpacity={0.8}
              onPress={handleShare}
            >
              <Text style={styles.shareIcon}>↑</Text>
            </TouchableOpacity>

            {/* Hero bottom content */}
            <View style={styles.heroContent}>
              <View style={styles.heroLogoRow}>
                <View style={[styles.heroLogo, { backgroundColor: company.logoColor + '20', borderColor: company.logoColor + '50' }]}>
                  <Text style={[styles.heroLogoText, { color: company.logoColor }]}>{company.logoInitial}</Text>
                </View>
                <View style={styles.heroNameBlock}>
                  <View style={styles.heroNameRow}>
                    <Text style={styles.heroName}>{company.name}</Text>
                    {company.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.heroRatingRow}>
                    <StarRating rating={company.rating} size={13} />
                    <Text style={styles.heroRating}>{company.rating.toFixed(1)} ({company.reviewCount})</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {[
            { value: `${company.reviewCount}+`, label: t('empresaProfile.reviews') },
            { value: company.rating.toFixed(1), label: t('empresaProfile.avgRating') },
            { value: company.yearsExperience ?? '—', label: t('empresaProfile.yearsExp') },
            { value: '98%', label: t('empresaProfile.satisfaction') },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Info Block */}
        <View style={styles.infoBlock}>
          <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{company.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏷️</Text>
            <Text style={styles.infoText}>{company.category}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✅</Text>
            <Text style={styles.infoText}>{company.verified ? t('empresaProfile.verifiedCompany') : t('empresaProfile.registeredCompany')}</Text>
          </View>

          <View style={styles.descDivider} />
          <Text style={styles.description}>{company.description[lang]}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsWrapper}>
          {TAB_IDS.map((tabId, idx) => (
            <TouchableOpacity
              key={tabId}
              style={[styles.tab, activeTab === tabId && styles.tabActive]}
              onPress={() => setActiveTab(tabId)}
              activeOpacity={0.8}
            >
              {activeTab === tabId && (
                <Grad
                  colors={Colors.gradients.premium}
                  style={StyleSheet.absoluteFill}
                  borderRadius={999}
                />
              )}
              <Text style={[styles.tabText, activeTab === tabId && styles.tabTextActive]}>
                {tabLabels[idx] ?? tabId}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* PROJETOS */}
          {activeTab === 'Projetos' && (
            <View>
              <Text style={styles.contentTitle}>{t('empresaProfile.projectGallery')}</Text>
              <View style={styles.gallery}>
                {GALLERY_IMAGES.map((uri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.galleryItem}
                    activeOpacity={0.88}
                    onPress={idx === 5 ? () => setShowAllProjects(true) : undefined}
                  >
                    <ImageBackground
                      source={{ uri }}
                      style={StyleSheet.absoluteFill}
                      imageStyle={{ borderRadius: 12 }}
                      resizeMode="cover"
                    >
                      <Grad
                        colors={['transparent', 'rgba(4,8,15,0.85)']}
                        style={StyleSheet.absoluteFill}
                      />
                    </ImageBackground>
                    {idx === 5 && (
                      <View style={styles.moreOverlay}>
                        <Text style={styles.moreText}>+{GALLERY_PROJECTS.length - 5}</Text>
                        <Text style={styles.moreSubText}>Ver todos</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* SERVIÇOS */}
          {activeTab === 'Serviços' && (
            <View style={styles.servicesList}>
              <Text style={styles.contentTitle}>{t('empresaProfile.servicesOffered')}</Text>
              {company.services.map((service, idx) => (
                <View key={idx} style={styles.serviceItem}>
                  <Grad
                    colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  <View style={styles.serviceIconBox}>
                    <Text style={styles.serviceIcon}>🔧</Text>
                  </View>
                  <View style={styles.serviceBody}>
                    <Text style={styles.serviceName}>{service}</Text>
                    <Text style={styles.serviceDesc}>{t('empresaProfile.serviceDesc')}</Text>
                  </View>
                  <TouchableOpacity style={styles.serviceArrow}>
                    <Text style={styles.serviceArrowText}>→</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.certCard}>
                <Grad
                  colors={['rgba(47,107,255,0.1)', 'rgba(47,107,255,0.04)']}
                  style={StyleSheet.absoluteFill}
                  borderRadius={16}
                />
                <Text style={styles.certTitle}>{t('empresaProfile.certTitle')}</Text>
                {(company.certifications?.length
                  ? company.certifications
                  : ['SCIP Certificado', 'ISO 9001']
                ).map((cert, i) => (
                  <View key={i} style={styles.certItem}>
                    <View style={styles.certDot} />
                    <Text style={styles.certText}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* AVALIAÇÕES */}
          {activeTab === 'Avaliações' && (
            <View>
              <Text style={styles.contentTitle}>{t('empresaProfile.clientReviews')}</Text>

              {/* Rating Summary */}
              <View style={styles.ratingSummary}>
                <Grad
                  colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
                  style={StyleSheet.absoluteFill}
                  borderRadius={20}
                />
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigValue}>{company.rating.toFixed(1)}</Text>
                  <StarRating rating={company.rating} size={18} />
                  <Text style={styles.ratingBigCount}>{company.reviewCount} {t('empresaProfile.reviewCount')}</Text>
                </View>
                <View style={styles.ratingBars}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarStar}>{star}★</Text>
                      <View style={styles.ratingBarTrack}>
                        <View
                          style={[
                            styles.ratingBarFill,
                            { width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` },
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
                    <View style={[styles.reviewAvatar, { backgroundColor: Colors.blue + '20' }]}>
                      <Text style={[styles.reviewAvatarText, { color: Colors.blue }]}>
                        {review.author[0]}
                      </Text>
                    </View>
                    <View style={styles.reviewAuthorBlock}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.reviewRatingRow}>
                        <StarRating rating={review.rating} size={11} />
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

      {/* All Projects Modal */}
      <Modal
        visible={showAllProjects}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAllProjects(false)}
      >
        <View style={styles.modalRoot}>
          <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />
          <View style={[styles.modalHeader, { paddingTop: insets.top + 12 }]}>
            <Text style={styles.modalTitle}>Galeria de Projetos</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAllProjects(false)} activeOpacity={0.8}>
              <Ionicons name="close" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.modalScroll, { paddingBottom: insets.bottom + 24 }]}
          >
            {GALLERY_PROJECTS.map((proj, idx) => (
              <View key={idx} style={styles.modalProjectCard}>
                <ImageBackground source={{ uri: proj.uri }} style={styles.modalProjectImg} resizeMode="cover" imageStyle={{ borderRadius: 16 }}>
                  <Grad colors={['transparent', 'rgba(4,8,15,0.9)']} style={StyleSheet.absoluteFill} />
                  <View style={styles.modalProjectBadge}>
                    <Text style={styles.modalProjectBadgeText}>#{idx + 1}</Text>
                  </View>
                  <View style={styles.modalProjectOverlay}>
                    <Text style={styles.modalProjectTitle}>{proj.title}</Text>
                    {proj.area ? <Text style={styles.modalProjectArea}>{proj.area}</Text> : null}
                  </View>
                </ImageBackground>
                <Text style={styles.modalProjectDesc}>{proj.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <LeadFormModal
        visible={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        companyId={company.id}
        companyName={company.name}
        user={user}
      />

      {/* Fixed Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + 12 }]}>
        <Grad
          colors={['rgba(11,15,26,0)', 'rgba(4,8,15,0.85)']}
          style={[StyleSheet.absoluteFill, { top: -20 }]}
        />
        <TouchableOpacity style={styles.orcamentoCTA} activeOpacity={0.85} onPress={() => setShowLeadForm(true)}>
          <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={14} />
          <Ionicons name="document-text-outline" size={18} color={Colors.white} />
          <Text style={styles.orcamentoCTAText}>{t('empresaProfile.requestQuote')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  heroContainer: { width: '100%', height: 320 },
  heroImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  backBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(4,8,15,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backArrow: { fontSize: 14, color: Colors.white },
  shareBtn: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(4,8,15,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  shareIcon: { fontSize: 14, color: Colors.white },
  heroContent: { padding: 20, paddingBottom: 24 },
  heroLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroLogo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogoText: { fontFamily: 'Inter_500Medium', fontSize: 26 },
  heroNameBlock: { flex: 1, gap: 6 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroName: { fontFamily: 'Inter_500Medium', fontSize: 19, color: Colors.white },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.white },
  heroRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroRating: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(7,13,26,0.98)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  statValue: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.amber },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  infoBlock: {
    margin: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 8,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoIcon: { fontSize: 14 },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted },
  descDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 4 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: Colors.textMuted },
  tabsWrapper: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
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
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  tabTextActive: { color: Colors.white, fontFamily: 'Inter_500Medium', zIndex: 1 },
  tabContent: { paddingHorizontal: 16 },
  contentTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 12 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryItem: {
    width: (W - 48) / 3,
    height: (W - 48) / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,15,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 4,
  },
  moreText: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white },
  moreSubText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 },
  // Modal
  modalRoot: { flex: 1, backgroundColor: Colors.bgDeep },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  modalTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: Colors.white },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: { paddingHorizontal: 16, paddingTop: 16, gap: 20 },
  modalProjectCard: { gap: 10 },
  modalProjectImg: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  modalProjectBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(4,8,15,0.65)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalProjectBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.white },
  modalProjectOverlay: { padding: 14 },
  modalProjectTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white },
  modalProjectArea: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.cyan, marginTop: 2 },
  modalProjectDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: Colors.textMuted },
  servicesList: { gap: 10 },
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
    backgroundColor: Colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  serviceIcon: { fontSize: 18 },
  serviceBody: { flex: 1 },
  serviceName: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, marginBottom: 3 },
  serviceDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  serviceArrow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceArrowText: { fontSize: 14, color: Colors.amber },
  certCard: {
    marginTop: 4,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.15)',
    overflow: 'hidden',
    gap: 8,
  },
  certTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },
  certItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  certDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.blue },
  certText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted },
  ratingSummary: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 16,
    gap: 16,
    alignItems: 'center',
  },
  ratingBig: { alignItems: 'center', gap: 4 },
  ratingBigValue: { fontFamily: 'Inter_500Medium', fontSize: 40, color: Colors.amber },
  ratingBigCount: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  ratingBars: { flex: 1, gap: 5 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBarStar: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.textMuted, width: 20 },
  ratingBarTrack: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 3 },
  ratingBarFill: { height: '100%', backgroundColor: Colors.star, borderRadius: 3 },
  reviewCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginBottom: 10,
    gap: 10,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontFamily: 'Inter_500Medium', fontSize: 16 },
  reviewAuthorBlock: { flex: 1, gap: 3 },
  reviewAuthor: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white },
  reviewRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim },
  reviewText: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, color: Colors.textMuted },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  orcamentoCTA: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orcamentoCTAText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, zIndex: 1 },
});
