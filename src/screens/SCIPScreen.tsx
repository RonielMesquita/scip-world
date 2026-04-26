import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Animated,
  ImageBackground,
  Linking,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.8);
const HERO_IMAGE = require('../../assets/hero-scip-cover.png');
const CARD_W = SW * 0.72;
const CARD_H = CARD_W * 1.1;

const ARTICLES = [
  {
    id: 'a1',
    title: 'Explore o Catálogo de Produtos SCIP Fortified',
    date: '13 Fev 2026',
    desc: 'Acesse o catálogo completo FSS SCIP com produtos, especificações e suporte técnico em um só lugar.',
    photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    url: 'https://www.fortifiedscip.com',
    tag: 'Catálogo',
    tagColor: Colors.blue,
  },
  {
    id: 'a2',
    title: 'Por Que Construir com Sistema SCIP?',
    date: '16 Out 2025',
    desc: 'Eventos climáticos extremos, custos de seguro e demanda por edificações mais resistentes tornam o SCIP a escolha certa.',
    photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    url: 'https://www.fortifiedscip.com',
    tag: 'Por Que SCIP',
    tagColor: Colors.cyan,
  },
  {
    id: 'a3',
    title: 'Seguros e SCIP: Prêmios Explicados',
    date: '26 Set 2025',
    desc: 'Construções SCIP têm menor risco em desastres naturais, o que reduz significativamente o custo do seguro.',
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    url: 'https://www.fortifiedscip.com',
    tag: 'Finanças',
    tagColor: Colors.amber,
  },
  {
    id: 'a4',
    title: 'SCIP vs Alvenaria: Comparativo Técnico',
    date: '02 Set 2025',
    desc: 'Análise completa de desempenho térmico, acústico, estrutural e de custo entre os dois sistemas construtivos.',
    photo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    url: 'https://www.fortifiedscip.com',
    tag: 'Técnico',
    tagColor: Colors.purple,
  },
  {
    id: 'a5',
    title: 'Resistência a Furacões Cat. 5 com Painéis SCIP',
    date: '14 Ago 2025',
    desc: 'Testes comprovam que estruturas SCIP resistem a ventos de 250 km/h. Saiba como a tecnologia salva vidas.',
    photo: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=600&q=80',
    url: 'https://www.fortifiedscip.com',
    tag: 'Segurança',
    tagColor: '#FF4D4D',
  },
  {
    id: 'a6',
    title: 'Sustentabilidade na Construção com EPS',
    date: '30 Jul 2025',
    desc: 'O EPS é 100% reciclável e reduz em 60% o desperdício de obra. Conheça o impacto ambiental positivo do SCIP.',
    photo: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    url: 'https://www.mundieps.com.br',
    tag: 'Sustentabilidade',
    tagColor: '#00C48C',
  },
];

const PDF_MATERIALS = [
  {
    id: 'pdf1',
    title: 'Manual de Instalação de Painéis SCIP',
    desc: 'Guia passo a passo para montagem, fixação e projeção de shotcrete em painéis EPS.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    tag: 'Instalação',
    tagColor: Colors.blue,
    pages: '48 pág.',
    url: '#',
  },
  {
    id: 'pdf2',
    title: 'Normas FEMA para Construção Resiliente',
    desc: 'Requisitos da FEMA para estruturas resistentes a furacões, inundações e sismos.',
    photo: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    tag: 'FEMA',
    tagColor: '#FF4D4D',
    pages: '112 pág.',
    url: '#',
  },
  {
    id: 'pdf3',
    title: 'ASTM E72 — Norma Internacional SCIP',
    desc: 'Testes de resistência estrutural e desempenho de painéis SCIP conforme ASTM.',
    photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
    tag: 'ASTM',
    tagColor: Colors.cyan,
    pages: '36 pág.',
    url: '#',
  },
  {
    id: 'pdf4',
    title: 'ICC-ESR — Laudos Técnicos Internacionais',
    desc: 'Relatórios de avaliação ICC-ES para aprovação de painéis SCIP em projetos.',
    photo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
    tag: 'ICC-ES',
    tagColor: Colors.purple,
    pages: '64 pág.',
    url: '#',
  },
  {
    id: 'pdf5',
    title: 'Manual Técnico de Fundações para SCIP',
    desc: 'Radier, sapatas e blocos adaptados ao sistema SCIP com cargas reduzidas.',
    photo: 'https://images.unsplash.com/photo-1565031491910-e57fac031c41?w=600&q=80',
    tag: 'Fundações',
    tagColor: Colors.amber,
    pages: '52 pág.',
    url: '#',
  },
  {
    id: 'pdf6',
    title: 'Guia de Instalações Elétricas em Painéis',
    desc: 'Passagem de eletrodutos, caixas embutidas e normas ABNT para SCIP.',
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    tag: 'Elétrica',
    tagColor: '#00C48C',
    pages: '40 pág.',
    url: '#',
  },
];

const MANUFACTURERS = [
  {
    id: 'fortified',
    name: 'Fortified SCIP',
    tagline: 'Structural Concrete Insulated Panels',
    country: '🇺🇸 Estados Unidos',
    url: 'https://www.fortifiedscip.com',
    bg: ['#0A1628', '#1a3a6b'],
    accent: '#2F6BFF',
    logo: 'https://www.fortifiedscip.com/wp-content/uploads/2021/01/fortified-logo.png',
  },
  {
    id: 'mundi',
    name: 'Mundi EPS',
    tagline: 'Painéis e Soluções Construtivas em EPS',
    country: '🇧🇷 Brasil',
    url: 'https://www.mundieps.com.br',
    bg: ['#0d1f0d', '#1a4a1a'],
    accent: '#00C48C',
    logo: null,
  },
  {
    id: 'gct',
    name: 'GCT Painéis',
    tagline: 'Sistemas Construtivos em EPS',
    country: '🇧🇷 Brasil',
    url: 'https://www.gctpaineis.com.br',
    bg: ['#1a1a0d', '#3a3a0a'],
    accent: Colors.amber,
    logo: null,
  },
  {
    id: 'abnt',
    name: 'ABNT NBR 15575',
    tagline: 'Norma de Desempenho de Edificações',
    country: '🇧🇷 Norma Técnica',
    url: 'https://www.abnt.org.br',
    bg: ['#1a0a0a', '#3a1010'],
    accent: '#FF4D4D',
    logo: null,
  },
];

// ─── Panel Card ───────────────────────────────────────────────────────────────
type PanelItem = { id: string; name: string; tag: string; photo: string; color: string; specs: { icon: string; label: string; val: string }[] };
function PanelCard({ panel }: { panel: PanelItem }) {
  return (
    <View style={[styles.panelCard, { width: CARD_W }]}>
      <ImageBackground
        source={{ uri: panel.photo }}
        style={styles.panelPhoto}
        resizeMode="cover"
        borderRadius={16}
      >
        <View style={[StyleSheet.absoluteFill, { borderRadius: 16, backgroundColor: 'rgba(4,8,15,0.45)' }]} />
        <Grad
          colors={['rgba(4,8,15,0)', 'rgba(4,8,15,0.0)', 'rgba(4,8,15,0.85)']}
          style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
        />
        {/* Tag */}
        <View style={[styles.panelTag, { backgroundColor: panel.color + '30', borderColor: panel.color + '60' }]}>
          <Text style={[styles.panelTagText, { color: panel.color }]}>{panel.tag}</Text>
        </View>
        {/* Name */}
        <View style={styles.panelBottom}>
          <Text style={styles.panelName}>{panel.name}</Text>
          {/* Specs row */}
          <View style={styles.panelSpecsRow}>
            {panel.specs.map((s, i) => (
              <View key={i} style={[styles.panelSpecItem, { borderColor: panel.color + '30' }]}>
                <Ionicons name={s.icon as any} size={13} color={panel.color} />
                <View>
                  <Text style={styles.panelSpecVal}>{s.val}</Text>
                  <Text style={styles.panelSpecLabel}>{s.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

// ─── Manufacturer Card ────────────────────────────────────────────────────────
function ManufacturerCard({ m }: { m: typeof MANUFACTURERS[0] }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity
      style={styles.mfCard}
      onPress={() => Linking.openURL(m.url)}
      activeOpacity={0.88}
    >
      <Grad colors={m.bg} style={StyleSheet.absoluteFill} borderRadius={20} />
      <View style={[styles.mfAccentBar, { backgroundColor: m.accent }]} />

      {/* Logo area */}
      <View style={[styles.mfLogoArea, { borderColor: m.accent + '30' }]}>
        {m.logo ? (
          <Image source={{ uri: m.logo }} style={styles.mfLogoImg} resizeMode="contain" />
        ) : (
          <Text style={[styles.mfLogoText, { color: m.accent }]}>{m.name}</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.mfInfo}>
        <Text style={styles.mfName}>{m.name}</Text>
        <Text style={styles.mfTagline}>{m.tagline}</Text>
        <Text style={styles.mfCountry}>{m.country}</Text>
      </View>

      {/* Visit button */}
      <View style={[styles.mfBtn, { borderColor: m.accent + '50', backgroundColor: m.accent + '15' }]}>
        <Text style={[styles.mfBtnText, { color: m.accent }]}>{t('scip.visitSite')}</Text>
        <Ionicons name="open-outline" size={13} color={m.accent} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: typeof ARTICLES[0] }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => Linking.openURL(article.url)}
      activeOpacity={0.88}
    >
      <ImageBackground
        source={{ uri: article.photo }}
        style={styles.articlePhoto}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(4,8,15,0.35)' }]} />
        <View style={[styles.articleTag, { backgroundColor: article.tagColor + '25', borderColor: article.tagColor + '60' }]}>
          <Text style={[styles.articleTagText, { color: article.tagColor }]}>{article.tag}</Text>
        </View>
      </ImageBackground>
      <View style={styles.articleBody}>
        <Text style={styles.articleDate}>{article.date}</Text>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.articleDesc} numberOfLines={3}>{article.desc}</Text>
        <View style={styles.articleReadMore}>
          <Text style={styles.articleReadMoreText}>{t('scip.readMore')}</Text>
          <Ionicons name="arrow-forward" size={13} color={Colors.blue} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── PDF Card ─────────────────────────────────────────────────────────────────
function PdfCard({ doc }: { doc: typeof PDF_MATERIALS[0] }) {
  const { t } = useLanguage();
  const isPlaceholder = doc.url === '#';
  return (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => !isPlaceholder && Linking.openURL(doc.url)}
      activeOpacity={isPlaceholder ? 1 : 0.88}
    >
      <ImageBackground
        source={{ uri: doc.photo }}
        style={styles.articlePhoto}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(4,8,15,0.45)' }]} />
        {/* PDF badge top-left */}
        <View style={[styles.articleTag, { backgroundColor: doc.tagColor + '25', borderColor: doc.tagColor + '60' }]}>
          <Text style={[styles.articleTagText, { color: doc.tagColor }]}>{doc.tag}</Text>
        </View>
        {/* PDF icon top-right */}
        <View style={styles.pdfBadge}>
          <Ionicons name="document-text-outline" size={13} color="rgba(255,255,255,0.85)" />
          <Text style={styles.pdfBadgeText}>PDF</Text>
        </View>
      </ImageBackground>
      <View style={styles.articleBody}>
        <Text style={styles.articleDate}>{doc.pages}</Text>
        <Text style={styles.articleTitle} numberOfLines={2}>{doc.title}</Text>
        <Text style={styles.articleDesc} numberOfLines={3}>{doc.desc}</Text>
        <View style={styles.articleReadMore}>
          {isPlaceholder ? (
            <>
              <Ionicons name="time-outline" size={11} color={Colors.textDim} />
              <Text style={[styles.articleReadMoreText, { color: Colors.textDim }]}>{t('scip.pdfSoon')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={13} color={doc.tagColor} />
              <Text style={[styles.articleReadMoreText, { color: doc.tagColor }]}>{t('scip.pdfDownload')}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({ step, isLast }: { step: { num: string; title: string; desc: string }; isLast: boolean }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepLeft}>
        <View style={styles.stepNumBox}>
          <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={12} />
          <Text style={styles.stepNum}>{step.num}</Text>
        </View>
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SCIPScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const zoom = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1.07, duration: 7000, useNativeDriver: true, isInteraction: false }),
        Animated.timing(zoom, { toValue: 1.00, duration: 7000, useNativeDriver: true, isInteraction: false }),
      ])
    ).start();
  }, []);

  const wallTag = t('scip.wallTag');
  const slabTag = t('scip.slabTag');
  const wallPanel = t('scip.wallPanel');
  const floorPanel = t('scip.floorPanel');
  const totalThickness = t('scip.totalThickness');
  const weight = t('scip.weight');
  const freeSpan = t('scip.freeSpan');

  const PANEL_TYPES = [
    {
      id: 'fwp2',
      name: `FWP2 – ${wallPanel}`,
      tag: wallTag,
      photo: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      color: Colors.blue,
      specs: [
        { icon: 'layers-outline', label: 'EPS', val: '2" (5 cm)' },
        { icon: 'resize-outline', label: totalThickness, val: '10,2 cm' },
        { icon: 'barbell-outline', label: weight, val: '29 kg/m²' },
      ],
    },
    {
      id: 'fwp4',
      name: `FWP4 – ${wallPanel}`,
      tag: wallTag,
      photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      color: Colors.cyan,
      specs: [
        { icon: 'layers-outline', label: 'EPS', val: '4" (10 cm)' },
        { icon: 'resize-outline', label: totalThickness, val: '15,2 cm' },
        { icon: 'barbell-outline', label: weight, val: '31 kg/m²' },
      ],
    },
    {
      id: 'ffp7',
      name: `FFP7 – ${floorPanel}`,
      tag: slabTag,
      photo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80',
      color: Colors.purple,
      specs: [
        { icon: 'layers-outline', label: 'EPS', val: '7" (18 cm)' },
        { icon: 'resize-outline', label: totalThickness, val: '23,5 cm' },
        { icon: 'expand-outline', label: freeSpan, val: '≤ 6 m' },
      ],
    },
    {
      id: 'ffp9',
      name: `FFP9 – ${floorPanel}`,
      tag: slabTag,
      photo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
      color: Colors.amber,
      specs: [
        { icon: 'layers-outline', label: 'EPS', val: '9" (23 cm)' },
        { icon: 'resize-outline', label: totalThickness, val: '28,5 cm' },
        { icon: 'expand-outline', label: freeSpan, val: '≤ 8 m' },
      ],
    },
  ];

  const STEPS: { num: string; title: string; desc: string }[] = t('scip.steps');

  const benefits = [
    { icon: 'flash-outline', color: Colors.cyan, title: t('scip.benefitSpeedVal'), desc: t('scip.benefitSpeedDesc') },
    { icon: 'leaf-outline', color: '#00C48C', title: t('scip.benefitSavingsVal'), desc: t('scip.benefitSavingsDesc') },
    { icon: 'shield-checkmark-outline', color: Colors.blue, title: t('scip.benefitResVal'), desc: t('scip.benefitResDesc') },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Animated.Image source={HERO_IMAGE} style={{ width: SW, height: HERO_H, transform: [{ scale: zoom }] }} resizeMode="stretch" />
          <Grad
            colors={['rgba(4,8,15,0)', 'rgba(4,8,15,0.0)', 'rgba(4,8,15,0.1)', 'rgba(4,8,15,0.55)']}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* ── Benefits ── */}
        <View style={styles.benefitsRow}>
          {benefits.map((b, i) => (
            <View key={i} style={styles.benefitCard}>
              <Ionicons name={b.icon as any} size={20} color={b.color} />
              <Text style={[styles.benefitVal, { color: b.color }]}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── Panel Types ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scip.panelsTitle')}</Text>
          <Text style={styles.sectionSub}>{t('scip.panelsSub')}</Text>
        </View>
        <FlatList
          data={PANEL_TYPES}
          keyExtractor={p => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.panelList}
          renderItem={({ item }) => <PanelCard panel={item} />}
        />

        {/* ── Step by Step ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scip.stepsTitle')}</Text>
          <Text style={styles.sectionSub}>{t('scip.stepsSub')}</Text>
          <View style={styles.stepsCard}>
            <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={20} />
            {STEPS.map((s, i) => <StepCard key={s.num} step={s} isLast={i === STEPS.length - 1} />)}
          </View>
        </View>

        {/* ── Articles & News ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scip.articlesTitle')}</Text>
          <Text style={styles.sectionSub}>{t('scip.articlesSub')}</Text>
          <View style={styles.articlesGrid}>
            {ARTICLES.map(a => <ArticleCard key={a.id} article={a} />)}
          </View>
        </View>

        {/* ── PDF Materials ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scip.pdfsTitle')}</Text>
          <Text style={styles.sectionSub}>{t('scip.pdfsSub')}</Text>
        </View>
        <FlatList
          data={PDF_MATERIALS}
          keyExtractor={d => d.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pdfList}
          renderItem={({ item }) => <PdfCard doc={item} />}
        />

        {/* ── Manufacturers & Standards ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('scip.mfTitle')}</Text>
          <Text style={styles.sectionSub}>{t('scip.mfSub')}</Text>
          <View style={styles.mfList}>
            {MANUFACTURERS.map(m => <ManufacturerCard key={m.id} m={m} />)}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },

  hero: { width: SW, height: HERO_H, overflow: 'hidden' },
  heroTopBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20 },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(47,107,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.5)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  heroBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.blue, letterSpacing: 1.5 },
  heroBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 24, gap: 8 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 26, color: Colors.white, letterSpacing: -0.5, lineHeight: 32 },
  heroSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(4,8,15,0.5)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 2 },
  heroStatVal: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.cyan },
  heroStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted },
  heroStatDiv: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)' },

  benefitsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginTop: -24,
    marginBottom: 8,
  },
  benefitCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  benefitVal: { fontFamily: 'Inter_700Bold', fontSize: 12, textAlign: 'center' },
  benefitDesc: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, textAlign: 'center', lineHeight: 14 },

  section: { paddingHorizontal: 16, paddingTop: 28, marginBottom: 4 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white, marginBottom: 2 },
  sectionSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginBottom: 4 },

  // Panel cards
  panelList: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  panelCard: { height: CARD_H },
  panelPhoto: { width: '100%', height: '100%', justifyContent: 'space-between', padding: 14 },
  panelTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  panelTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1 },
  panelBottom: { gap: 10 },
  panelName: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white },
  panelSpecsRow: { flexDirection: 'row', gap: 6 },
  panelSpecItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(4,8,15,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
  },
  panelSpecVal: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.white },
  panelSpecLabel: { fontFamily: 'Inter_400Regular', fontSize: 9, color: Colors.textMuted },

  // Steps
  stepsCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    padding: 20,
  },
  stepRow: { flexDirection: 'row', gap: 14 },
  stepLeft: { alignItems: 'center', width: 40 },
  stepNumBox: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
  },
  stepNum: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white, zIndex: 1 },
  stepLine: { width: 1, flex: 1, backgroundColor: 'rgba(47,107,255,0.2)', marginTop: 4, marginBottom: 4, minHeight: 20 },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white, marginBottom: 4 },
  stepDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  // PDF carousel
  pdfList: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  pdfBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(4,8,15,0.65)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pdfBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 9, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 },

  // Articles
  articlesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  articleCard: {
    width: (SW - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#08101F',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  articlePhoto: { width: '100%', height: 130, justifyContent: 'flex-start', padding: 10 },
  articleTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  articleTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.8 },
  articleBody: { padding: 12, gap: 6 },
  articleDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim },
  articleTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white, lineHeight: 18 },
  articleDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted, lineHeight: 16 },
  articleReadMore: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  articleReadMoreText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.blue },

  // Manufacturer cards
  mfList: { gap: 14 },
  mfCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    gap: 14,
  },
  mfAccentBar: { position: 'absolute', top: 0, left: 24, right: 24, height: 2, borderRadius: 1 },
  mfLogoArea: {
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 20,
  },
  mfLogoImg: { width: '70%', height: 50 },
  mfLogoText: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: 0.5 },
  mfInfo: { gap: 4 },
  mfName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
  mfTagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, lineHeight: 18 },
  mfCountry: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textDim, marginTop: 2 },
  mfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  mfBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
