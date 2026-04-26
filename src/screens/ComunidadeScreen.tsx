import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.72);
const HERO_IMAGE = require('../../assets/hero-comunidade.png');
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { COMMUNITY_POSTS, SPECIALISTS_ONLINE, CommunityPost } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const TOPIC_IDS = ['Todos', 'Estrutural', 'Materiais', 'Projetos', 'Gestão', 'Prático'];

// ─── Static content data ──────────────────────────────────────────────────────
const ARTICLES = [
  { id: 'a1', title: 'SCIP vs Alvenaria: Comparativo Técnico Completo', category: 'Técnico', readMin: 8, author: 'Eng. Ricardo Alves', date: 'Abr 2025', url: 'https://www.fortifiedscip.com' },
  { id: 'a2', title: 'Como Reduzir Custos em 30% com Painéis SCIP', category: 'Gestão', readMin: 5, author: 'Arq. Fernanda Costa', date: 'Mar 2025', url: 'https://www.fortifiedscip.com' },
  { id: 'a3', title: 'Isolamento Térmico: SCIP Supera Parede Dupla', category: 'Desempenho', readMin: 6, author: 'Eng. Marcos Silva', date: 'Mar 2025', url: 'https://www.fortifiedscip.com' },
  { id: 'a4', title: 'Certificações ABNT para Construção com EPS', category: 'Normas', readMin: 10, author: 'Dr. Paulo Mendes', date: 'Fev 2025', url: 'https://www.abntcatalogo.com.br' },
];

const LAWS = [
  { id: 'l1', title: 'ABNT NBR 15575 — Desempenho de Edificações Habitacionais', year: '2013', status: 'Vigente', category: 'Desempenho' },
  { id: 'l2', title: 'ABNT NBR 6118 — Projeto de Estruturas de Concreto', year: '2023', status: 'Vigente', category: 'Estrutural' },
  { id: 'l3', title: 'Lei 12.305/2010 — Política Nacional de Resíduos Sólidos', year: '2010', status: 'Vigente', category: 'Ambiental' },
  { id: 'l4', title: 'Instrução Normativa PBQP-H — Sistema SCIP/EPS', year: '2022', status: 'Vigente', category: 'SCIP' },
  { id: 'l5', title: 'Resolução CONAMA 307 — Resíduos da Construção Civil', year: '2002', status: 'Vigente', category: 'Ambiental' },
];

const EVENTS = [
  { id: 'e1', title: 'SCIP World Summit 2025', date: '15 Mai 2025', location: 'São Paulo, SP', type: 'Congresso', online: false },
  { id: 'e2', title: 'Webinar: Fundações Superficiais para SCIP', date: '22 Mai 2025', location: 'Online', type: 'Webinar', online: true },
  { id: 'e3', title: 'Curso Intensivo de Aplicação EPS', date: '03 Jun 2025', location: 'Rio de Janeiro, RJ', type: 'Curso', online: false },
  { id: 'e4', title: 'Feira Nacional da Construção Civil 2025', date: '10 Jun 2025', location: 'Belo Horizonte, MG', type: 'Feira', online: false },
  { id: 'e5', title: 'Workshop: BIM e Painéis SCIP', date: '18 Jun 2025', location: 'Online', type: 'Workshop', online: true },
];

function SpecialistAvatar({ spec }: { spec: typeof SPECIALISTS_ONLINE[0] }) {
  return (
    <View style={styles.specialistItem}>
      <View style={[styles.specAvatar, { backgroundColor: spec.avatarColor + '20', borderColor: spec.avatarColor + '50' }]}>
        <Text style={[styles.specAvatarText, { color: spec.avatarColor }]}>{spec.avatarInitial}</Text>
        {spec.isOnline && <View style={styles.onlineDot} />}
      </View>
      <Text style={styles.specName} numberOfLines={1}>{spec.name.split(' ')[1]}</Text>
      <Text style={styles.specRole} numberOfLines={1}>{spec.role}</Text>
    </View>
  );
}

function PostCard({ post, onPress, onReply }: { post: CommunityPost; onPress: () => void; onReply: () => void }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity style={styles.postCard} onPress={onPress} activeOpacity={0.85}>
      <Grad
        colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={18}
      />

      {/* Author Row */}
      <View style={styles.postHeader}>
        <View style={[styles.postAvatar, { backgroundColor: post.avatarColor + '18', borderColor: post.avatarColor + '35' }]}>
          <Text style={[styles.postAvatarText, { color: post.avatarColor }]}>{post.avatarInitial}</Text>
        </View>
        <View style={styles.postAuthorBlock}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <View style={styles.postAuthorMeta}>
            <Text style={styles.postRole}>{post.role}</Text>
            <Text style={styles.postDot}>·</Text>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
        </View>
        {post.isAnswered ? (
          <View style={styles.answeredBadge}>
            <Text style={styles.answeredText}>{t('comunidade.answered')}</Text>
          </View>
        ) : (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>{t('comunidade.waiting')}</Text>
          </View>
        )}
      </View>

      {/* Question */}
      <Text style={styles.postQuestion} numberOfLines={3}>{post.question}</Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {post.tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.postFooter}>
        <View style={styles.postMetric}>
          <Text style={styles.postMetricIcon}>💬</Text>
          <Text style={styles.postMetricText}>{post.answers} {t('comunidade.answers')}</Text>
        </View>
        <View style={styles.postMetric}>
          <Text style={styles.postMetricIcon}>👁</Text>
          <Text style={styles.postMetricText}>{post.views} {t('comunidade.views')}</Text>
        </View>
        <TouchableOpacity style={styles.answerBtn} activeOpacity={0.8} onPress={(e) => { e.stopPropagation?.(); onReply(); }}>
          <Text style={styles.answerBtnText}>{t('comunidade.reply')}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Community Section Header ─────────────────────────────────────────────────
function SectionHead({ title, accent, sub }: { title: string; accent: string; sub?: string }) {
  return (
    <View style={secStyles.wrap}>
      <View style={[secStyles.bar, { backgroundColor: accent, shadowColor: accent }]} />
      <View>
        <Text style={secStyles.title}>{title}</Text>
        {sub ? <Text style={secStyles.sub}>{sub}</Text> : null}
      </View>
    </View>
  );
}

const secStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, marginTop: 28 },
  bar: { width: 4, height: 38, borderRadius: 2, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#fff', letterSpacing: 0.2 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
});

// ─── Articles Section ─────────────────────────────────────────────────────────
function ArticlesSection() {
  const { t } = useLanguage();
  const CATEGORY_COLORS: Record<string, string> = {
    Técnico: Colors.cyan, Gestão: Colors.amber, Desempenho: '#00C48C', Normas: Colors.purple,
  };
  return (
    <View>
      <SectionHead title={t('comunidade.articles')} accent={Colors.cyan} sub={t('comunidade.articlesSub')} />
      {ARTICLES.map((a) => (
        <TouchableOpacity key={a.id} style={artStyles.card} activeOpacity={0.85} onPress={() => Linking.openURL(a.url)}>
          <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={16} />
          <View style={artStyles.top}>
            <View style={[artStyles.catChip, { backgroundColor: (CATEGORY_COLORS[a.category] ?? Colors.cyan) + '20', borderColor: (CATEGORY_COLORS[a.category] ?? Colors.cyan) + '40' }]}>
              <Text style={[artStyles.catText, { color: CATEGORY_COLORS[a.category] ?? Colors.cyan }]}>{a.category}</Text>
            </View>
            <Text style={artStyles.readTime}>📖 {a.readMin} min</Text>
          </View>
          <Text style={artStyles.title} numberOfLines={2}>{a.title}</Text>
          <View style={artStyles.footer}>
            <Text style={artStyles.author}>{a.author}</Text>
            <Text style={artStyles.date}>{a.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const artStyles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 10, gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  catText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.4 },
  readTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff', lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 8 },
  author: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  date: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.35)' },
});

// ─── Laws Section ─────────────────────────────────────────────────────────────
function LawsSection() {
  const { t } = useLanguage();
  const CAT_COLORS: Record<string, string> = { Desempenho: Colors.blue, Estrutural: Colors.purple, Ambiental: '#00C48C', SCIP: Colors.cyan };
  return (
    <View>
      <SectionHead title={t('comunidade.laws')} accent={Colors.purple} sub={t('comunidade.lawsSub')} />
      {LAWS.map((law) => {
        const color = CAT_COLORS[law.category] ?? Colors.cyan;
        return (
          <TouchableOpacity key={law.id} style={lawStyles.card} activeOpacity={0.85} onPress={() => Alert.alert(law.title, `Ano: ${law.year}\nStatus: ${law.status}\nCategoria: ${law.category}`, [{ text: 'Fechar' }])}>
            <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={14} />
            <View style={lawStyles.left}>
              <View style={[lawStyles.iconBox, { backgroundColor: color + '18', borderColor: color + '35' }]}>
                <Text style={[lawStyles.iconText, { color }]}>§</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={lawStyles.title} numberOfLines={2}>{law.title}</Text>
                <View style={lawStyles.meta}>
                  <View style={[lawStyles.catBadge, { backgroundColor: color + '18', borderColor: color + '30' }]}>
                    <Text style={[lawStyles.catText, { color }]}>{law.category}</Text>
                  </View>
                  <Text style={lawStyles.year}>{law.year}</Text>
                  <View style={lawStyles.statusBadge}>
                    <Text style={lawStyles.statusText}>● {law.status}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const lawStyles = StyleSheet.create({
  card: { borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 },
  left: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconText: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  title: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#fff', lineHeight: 19 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  catText: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.3 },
  year: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  statusBadge: {},
  statusText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#00C48C' },
});

// ─── Events Section ───────────────────────────────────────────────────────────
function EventsSection() {
  const { t } = useLanguage();
  const TYPE_COLORS: Record<string, string> = { Congresso: Colors.amber, Webinar: Colors.cyan, Curso: Colors.purple, Feira: Colors.blue, Workshop: '#00C48C' };
  return (
    <View>
      <SectionHead title={t('comunidade.events')} accent={Colors.amber} sub={t('comunidade.eventsSub')} />
      {EVENTS.map((ev) => {
        const color = TYPE_COLORS[ev.type] ?? Colors.cyan;
        return (
          <TouchableOpacity key={ev.id} style={evStyles.card} activeOpacity={0.85}>
            <Grad colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']} style={StyleSheet.absoluteFill} borderRadius={16} />
            <View style={[evStyles.dateBadge, { backgroundColor: color + '18', borderColor: color + '35' }]}>
              <Text style={[evStyles.dateDay, { color }]}>{ev.date.split(' ')[0]}</Text>
              <Text style={[evStyles.dateMon, { color: color + 'BB' }]}>{ev.date.split(' ')[1]} {ev.date.split(' ')[2]}</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <View style={evStyles.titleRow}>
                <View style={[evStyles.typeBadge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
                  <Text style={[evStyles.typeText, { color }]}>{ev.type}</Text>
                </View>
                {ev.online && (
                  <View style={evStyles.onlineBadge}>
                    <Text style={evStyles.onlineText}>{t('comunidade.eventOnline')}</Text>
                  </View>
                )}
              </View>
              <Text style={evStyles.title} numberOfLines={2}>{ev.title}</Text>
              <Text style={evStyles.location}>📍 {ev.location}</Text>
            </View>
            <TouchableOpacity style={[evStyles.registerBtn, { borderColor: color + '50' }]} onPress={() => Alert.alert('Inscrição', `Inscrição para "${ev.title}" em breve!`, [{ text: 'OK' }])}>
              <Text style={[evStyles.registerText, { color }]}>{t('comunidade.register')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const evStyles = StyleSheet.create({
  card: { borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  dateBadge: { width: 52, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, flexShrink: 0 },
  dateDay: { fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 24 },
  dateMon: { fontFamily: 'Inter_500Medium', fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase' },
  titleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  typeText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.4 },
  onlineBadge: {},
  onlineText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#00C48C' },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#fff', lineHeight: 18 },
  location: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  registerBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: 'center', flexShrink: 0 },
  registerText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
});

function AskModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [question, setQuestion] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Estrutural');
  const topics = ['Estrutural', 'Materiais', 'Projetos', 'Gestão', 'Prático', 'Outro'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity style={styles.askModal} activeOpacity={1}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={28} />
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('comunidade.askModalTitle')}</Text>
            <Text style={styles.modalSubtitle}>{t('comunidade.askModalSub')}</Text>

            <Text style={styles.fieldLabel}>{t('comunidade.questionLabel')}</Text>
            <TextInput
              style={styles.questionInput}
              placeholder={t('comunidade.questionPlaceholder')}
              placeholderTextColor={Colors.textDim}
              value={question}
              onChangeText={setQuestion}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.fieldLabel}>{t('comunidade.topicLabel')}</Text>
            <View style={styles.topicsGrid}>
              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic}
                  style={[styles.topicChip, selectedTopic === topic && styles.topicChipActive]}
                  onPress={() => setSelectedTopic(topic)}
                >
                  {selectedTopic === topic && (
                    <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={999} />
                  )}
                  <Text style={[styles.topicText, selectedTopic === topic && styles.topicTextActive]}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, !question.trim() && styles.submitBtnDisabled]}
              activeOpacity={question.trim() ? 0.85 : 1}
              onPress={() => { if (question.trim()) onClose(); }}
            >
              <Grad
                colors={question.trim() ? Colors.gradients.premium : ['#0B1C3D', '#070D1A']}
                style={StyleSheet.absoluteFill}
                borderRadius={999}
              />
              <Text style={styles.submitBtnText}>{t('comunidade.publish')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function PostDetailModal({ post, onClose }: { post: CommunityPost | null; onClose: () => void }) {
  const { t } = useLanguage();
  const [reply, setReply] = useState('');
  if (!post) return null;
  return (
    <Modal visible={!!post} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity style={[styles.askModal, { maxHeight: '85%' }]} activeOpacity={1}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={28} />
            <View style={styles.modalHandle} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <View style={[styles.postAvatar, { backgroundColor: post.avatarColor + '18', borderColor: post.avatarColor + '35' }]}>
                <Text style={[styles.postAvatarText, { color: post.avatarColor }]}>{post.avatarInitial}</Text>
              </View>
              <View>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postTime}>{post.role} · {post.time}</Text>
              </View>
            </View>
            <Text style={[styles.postQuestion, { fontSize: 15, marginBottom: 12 }]}>{post.question}</Text>
            <View style={styles.tagsRow}>
              {post.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginVertical: 12 }}>
              <Text style={styles.postMetricText}>💬 {post.answers} {t('comunidade.answers')}</Text>
              <Text style={styles.postMetricText}>👁 {post.views} {t('comunidade.views')}</Text>
            </View>
            <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>{t('comunidade.replyLabel')}</Text>
            <TextInput
              style={[styles.questionInput, { height: 80 }]}
              placeholder={t('comunidade.replyPlaceholder')}
              placeholderTextColor={Colors.textDim}
              value={reply}
              onChangeText={setReply}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.submitBtn, !reply.trim() && styles.submitBtnDisabled]}
              activeOpacity={reply.trim() ? 0.85 : 1}
              onPress={() => { if (reply.trim()) { setReply(''); onClose(); } }}
            >
              <Grad
                colors={reply.trim() ? Colors.gradients.premium : ['#0B1C3D', '#070D1A']}
                style={StyleSheet.absoluteFill}
                borderRadius={999}
              />
              <Text style={styles.submitBtnText}>{t('comunidade.publishReply')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ComunidadeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { opacity, translateY } = useEntryAnimation();
  const [activeTopic, setActiveTopic] = useState('Todos');
  const [showAsk, setShowAsk] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const topicLabels: string[] = t('comunidade.topicLabels');
  const rules: string[] = t('comunidade.rules');
  const onlineCount = SPECIALISTS_ONLINE.filter((s) => s.isOnline).length;

  const filtered = COMMUNITY_POSTS.filter((p) => {
    const matchSearch = p.question.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchTopic = activeTopic === 'Todos' || p.tags.some((tag) =>
      tag.toLowerCase().includes(activeTopic.toLowerCase())
    );
    return matchSearch && matchTopic;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <Animated.ScrollView
        style={[{ opacity, transform: [{ translateY }] }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100, paddingTop: insets.top }]}
      >
        {/* ── Cover Hero ──────────────────────────────────── */}
        <View style={styles.coverHero}>
          <Image
            source={HERO_IMAGE}
            style={{ width: SW * 1.12, height: HERO_H, marginLeft: -(SW * 0.06) }}
            resizeMode="stretch"
          />
          <Grad
            colors={['rgba(4,8,15,0.6)', 'rgba(4,8,15,0.05)', 'rgba(4,8,15,0.75)', Colors.bgDeep]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          {/* Badge no topo */}
          <View style={[styles.coverTopBar, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Grad colors={['rgba(4,8,15,0.75)', 'rgba(4,8,15,0.55)']} style={StyleSheet.absoluteFill} borderRadius={999} />
              <Ionicons name="arrow-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.coverBadge}>
              <View style={styles.coverBadgeDot} />
              <Text style={styles.coverBadgeText}>SCIP COMUNIDADE</Text>
            </View>
          </View>
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>{t('comunidade.title')}</Text>
            <Text style={styles.coverSubtitle}>
              {COMMUNITY_POSTS.length} {t('comunidade.questions')} · {onlineCount} {t('comunidade.specialistsOnline')}
            </Text>
            <View style={styles.coverStats}>
              <View style={styles.coverStat}>
                <Text style={styles.coverStatValue}>2.847</Text>
                <Text style={styles.coverStatLabel}>{t('comunidade.members')}</Text>
              </View>
              <View style={styles.coverStatDiv} />
              <View style={styles.coverStat}>
                <Text style={styles.coverStatValue}>12.4k</Text>
                <Text style={styles.coverStatLabel}>{t('comunidade.questionsLabel')}</Text>
              </View>
              <View style={styles.coverStatDiv} />
              <View style={styles.coverStat}>
                <View style={styles.coverOnlineRow}>
                  <View style={styles.coverOnlineDot} />
                  <Text style={[styles.coverStatValue, { color: '#00C48C' }]}>{onlineCount}</Text>
                </View>
                <Text style={styles.coverStatLabel}>{t('comunidade.online')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Header */}
        <View style={[styles.header, { marginTop: 16 }]}>
          <View>
            <Text style={styles.headerTitle}>{t('comunidade.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {COMMUNITY_POSTS.length} {t('comunidade.questions')} · {onlineCount} {t('comunidade.specialistsOnline')}
            </Text>
          </View>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlinePulse} />
            <Text style={styles.onlineText}>{onlineCount} {t('comunidade.online')}</Text>
          </View>
        </View>

        {/* Ask Button */}
        <TouchableOpacity style={styles.askButton} onPress={() => setShowAsk(true)} activeOpacity={0.88}>
          <Grad
            colors={Colors.gradients.premium}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.askButtonContent}>
            <View style={styles.askButtonIcon}>
              <Text style={styles.askButtonIconText}>?</Text>
            </View>
            <View>
              <Text style={styles.askButtonTitle}>{t('comunidade.askQuestion')}</Text>
              <Text style={styles.askButtonSub}>{t('comunidade.askSub')}</Text>
            </View>
          </View>
          <Text style={styles.askButtonArrow}>→</Text>
          <View style={styles.askButtonGlow} />
        </TouchableOpacity>

        {/* Specialists Online */}
        <View style={styles.specialistsSection}>
          <View style={styles.specHeader}>
            <Text style={styles.specTitle}>{t('comunidade.availableSpecialists')}</Text>
            <View style={styles.specOnlineBadge}>
              <View style={styles.specOnlineDot} />
              <Text style={styles.specOnlineText}>{onlineCount} {t('comunidade.onlineNow')}</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specList}
          >
            {SPECIALISTS_ONLINE.map((spec) => (
              <SpecialistAvatar key={spec.id} spec={spec} />
            ))}
          </ScrollView>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('comunidade.search')}
            placeholderTextColor={Colors.textDim}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Topic Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topicsScroll}
        >
          {TOPIC_IDS.map((topicId, idx) => (
            <TouchableOpacity
              key={topicId}
              style={[styles.topicFilter, activeTopic === topicId && styles.topicFilterActive]}
              onPress={() => setActiveTopic(topicId)}
              activeOpacity={0.8}
            >
              {activeTopic === topicId && (
                <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={999} />
              )}
              <Text style={[styles.topicFilterText, activeTopic === topicId && styles.topicFilterTextActive]}>
                {topicLabels[idx] ?? topicId}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <Text style={styles.resultsText}>
          {filtered.length} {filtered.length !== 1 ? t('comunidade.resultsMany') : t('comunidade.resultsOne')}
        </Text>

        {/* Posts */}
        <View style={styles.postsList}>
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} onPress={() => setSelectedPost(post)} onReply={() => setShowAsk(true)} />
          ))}
        </View>

        {/* Articles */}
        <ArticlesSection />

        {/* Laws */}
        <LawsSection />

        {/* Events */}
        <EventsSection />

        {/* Community Stats */}
        <View style={styles.statsCard}>
          <Grad
            colors={['rgba(47,107,255,0.08)', 'rgba(47,107,255,0.03)']}
            style={StyleSheet.absoluteFill}
            borderRadius={20}
          />
          <Text style={styles.statsTitle}>{t('comunidade.statsTitle')}</Text>
          <View style={styles.statsGrid}>
            {[
              { value: '2.847', label: t('comunidade.statsMembers') },
              { value: '12.4k', label: t('comunidade.statsAnswered') },
              { value: '98%', label: t('comunidade.statsRate') },
              { value: '<2h', label: t('comunidade.statsTime') },
            ].map((stat, idx) => (
              <View key={idx} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rules */}
        <View style={styles.rulesCard}>
          <Grad
            colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
            style={StyleSheet.absoluteFill}
            borderRadius={18}
          />
          <Text style={styles.rulesTitle}>{t('comunidade.rulesTitle')}</Text>
          {rules.map((rule, idx) => (
            <View key={idx} style={styles.ruleItem}>
              <Text style={styles.ruleNum}>{idx + 1}</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Ask Modal */}
      <AskModal visible={showAsk} onClose={() => setShowAsk(false)} />

      {/* Post Detail Modal */}
      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 23, color: Colors.white },
  headerSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, marginTop: 3 },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,196,140,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.2)',
    marginTop: 4,
  },
  onlinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C48C',
  },
  onlineText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#00C48C',
  },
  askButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: Colors.purple, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14 },
      android: { elevation: 8 },
    }),
  },
  askButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  askButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askButtonIconText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },
  askButtonTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  askButtonSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  askButtonArrow: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, zIndex: 1 },
  askButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
  },
  specialistsSection: { marginBottom: 20 },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  specOnlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  specOnlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00C48C',
  },
  specOnlineText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: '#00C48C',
  },
  specList: { gap: 10 },
  specialistItem: { alignItems: 'center', width: 70, gap: 4 },
  specAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  specAvatarText: { fontFamily: 'Inter_500Medium', fontSize: 20 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C48C',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },
  specName: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.white, textAlign: 'center' },
  specRole: { fontFamily: 'Inter_400Regular', fontSize: 9, color: Colors.textDim, textAlign: 'center' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 15 },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    padding: 0,
  },
  topicsScroll: { gap: 8, marginBottom: 14 },
  topicFilter: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  topicFilterActive: { borderColor: 'transparent' },
  topicFilterText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  topicFilterTextActive: { color: Colors.white, fontFamily: 'Inter_500Medium', zIndex: 1 },
  resultsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
    marginBottom: 10,
  },
  postsList: { gap: 12, marginBottom: 24 },
  postCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10 },
      android: { elevation: 4 },
    }),
  },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  postAvatarText: { fontFamily: 'Inter_500Medium', fontSize: 16 },
  postAuthorBlock: { flex: 1 },
  postAuthor: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white },
  postAuthorMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  postRole: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  postDot: { fontSize: 11, color: Colors.textDim },
  postTime: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textDim },
  answeredBadge: {
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.25)',
  },
  answeredText: { fontFamily: 'Inter_400Regular', fontSize: 9, color: '#00C48C' },
  pendingBadge: {
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,184,0,0.2)',
  },
  pendingText: { fontFamily: 'Inter_400Regular', fontSize: 9, color: Colors.warning },
  postQuestion: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
    lineHeight: 22,
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: 'rgba(47,107,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.2)',
  },
  tagText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.blue },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 10,
  },
  postMetric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postMetricIcon: { fontSize: 12 },
  postMetricText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textDim },
  answerBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.35)',
  },
  answerBtnText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.amber },
  statsCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.15)',
    overflow: 'hidden',
    marginBottom: 16,
    gap: 14,
  },
  statsTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statItem: { width: '46%', gap: 3 },
  statValue: { fontFamily: 'Inter_500Medium', fontSize: 19, color: Colors.blue },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  rulesCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 10,
  },
  rulesTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, marginBottom: 4 },
  ruleItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  ruleNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.purpleMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.amber,
    flexShrink: 0,
  },
  ruleText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, lineHeight: 20 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  askModal: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    gap: 14,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
  },
  modalTitle: { fontFamily: 'Inter_500Medium', fontSize: 19, color: Colors.white },
  modalSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted, lineHeight: 20, marginTop: -6 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  questionInput: {
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
  },
  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  topicChipActive: { borderColor: 'transparent' },
  topicText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textMuted },
  topicTextActive: { color: Colors.white, zIndex: 1, fontFamily: 'Inter_400Regular' },
  submitBtn: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  submitBtnDisabled: {},
  submitBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, zIndex: 1 },
  coverHero: {
    width: SW,
    height: HERO_H,
    marginHorizontal: -16,
    overflow: 'hidden',
  },
  coverTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  coverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(4,8,15,0.55)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.45)',
  },
  coverBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.purple,
  },
  coverBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.purple,
    letterSpacing: 1.2,
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 6,
  },
  coverTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  coverSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
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
    fontSize: 16,
    color: Colors.white,
  },
  coverStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  coverStatDiv: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
  },
  coverOnlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  coverOnlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00C48C',
  },
});
