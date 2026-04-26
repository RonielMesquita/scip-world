import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  FlatList,
  Platform,
  Image,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { OBRA_TYPES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

const { width: SW } = Dimensions.get('window');
const HERO_H = Math.round(SW * 0.667);
const HERO_IMAGE = require('../../assets/hero-estimar.png');

interface Result {
  totalArea: number;
  totalCost: number;
  costPerM2: number;
  timeMonths: number;
  panels: number;
  savings: number;
  type: string;
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const { t } = useLanguage();

  const rows = [
    {
      key: 'time',
      label: t('estimar.comparison.time'),
      scip: `30 ${t('estimar.comparison.days')}`,
      masonry: `90 ${t('estimar.comparison.days')}`,
      wood: `45 ${t('estimar.comparison.days')}`,
      scipHighlight: true,
    },
    {
      key: 'fire',
      label: t('estimar.comparison.fire'),
      scip: 'A1 ★★★★★',
      masonry: 'B ★★★☆☆',
      wood: 'C ★★☆☆☆',
      scipHighlight: true,
    },
    {
      key: 'hurricane',
      label: t('estimar.comparison.hurricane'),
      scip: 'Cat. 5 ✓',
      masonry: '✗',
      wood: '✗',
      scipHighlight: true,
    },
    {
      key: 'thermal',
      label: t('estimar.comparison.thermal'),
      scip: 'A+ ★★★★★',
      masonry: 'C ★★☆☆☆',
      wood: 'B ★★★☆☆',
      scipHighlight: true,
    },
    {
      key: 'sustainability',
      label: t('estimar.comparison.sustainability'),
      scip: 'A+ ★★★★★',
      masonry: 'C ★★☆☆☆',
      wood: 'B ★★★☆☆',
      scipHighlight: true,
    },
    {
      key: 'weight',
      label: t('estimar.comparison.weight'),
      scip: `40% ${t('estimar.comparison.lighter')}`,
      masonry: 'Base',
      wood: `20% ${t('estimar.comparison.lighter')}`,
      scipHighlight: true,
    },
  ];

  return (
    <View style={styles.comparisonCard}>
      <Grad
        colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={24}
      />
      <View style={styles.comparisonHeader}>
        <Text style={styles.comparisonTitle}>{t('estimar.comparison.title')}</Text>
        <Text style={styles.comparisonSubtitle}>{t('estimar.comparison.subtitle')}</Text>
      </View>

      {/* Column headers */}
      <View style={styles.compTableHead}>
        <View style={styles.compRowLabel} />
        <View style={[styles.compColHead, styles.compColScip]}>
          <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={8} />
          <Text style={styles.compColHeadTextScip}>{t('estimar.comparison.scip')}</Text>
        </View>
        <View style={styles.compColHead}>
          <Text style={styles.compColHeadText}>{t('estimar.comparison.masonry')}</Text>
        </View>
        <View style={styles.compColHead}>
          <Text style={styles.compColHeadText}>{t('estimar.comparison.woodFrame')}</Text>
        </View>
      </View>

      {/* Rows */}
      {rows.map((row, idx) => (
        <View key={row.key} style={[styles.compTableRow, idx % 2 === 0 && styles.compTableRowAlt]}>
          <Text style={styles.compRowLabel}>{row.label}</Text>
          <View style={[styles.compCell, styles.compCellScip]}>
            <Text style={styles.compCellTextScip}>{row.scip}</Text>
          </View>
          <View style={styles.compCell}>
            <Text style={styles.compCellText}>{row.masonry}</Text>
          </View>
          <View style={styles.compCell}>
            <Text style={styles.compCellText}>{row.wood}</Text>
          </View>
        </View>
      ))}

      <View style={styles.compFooter}>
        <View style={styles.compFooterBadge}>
          <Text style={styles.compFooterText}>
            30% {t('estimar.comparison.saveVsConv')}
          </Text>
        </View>
        <View style={styles.compFooterBadge}>
          <Text style={styles.compFooterText}>
            3× {t('estimar.comparison.faster')}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ result, onSendToPartner }: { result: Result; onSendToPartner: () => void }) {
  const { t } = useLanguage();

  const handleSave = async () => {
    const msg =
      `📊 ESTIMATIVA SCIP WORLD\n\n` +
      `🏗️ Tipo: ${result.type}\n` +
      `📐 Área: ${result.totalArea} m²\n` +
      `💰 Investimento: ${result.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}\n` +
      `📈 Economia vs Conv.: ${result.savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}\n` +
      `⏱️ Prazo estimado: ${result.timeMonths} ${result.timeMonths === 1 ? 'mês' : 'meses'}\n\n` +
      `Gerado por SCIP WORLD — scipworld.com`;
    try {
      await Share.share({ message: msg, title: 'Estimativa SCIP WORLD' });
    } catch {}
  };

  const metrics = [
    { label: t('estimar.metrics.totalInvestment'), value: result.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }), icon: '💰', highlight: true },
    { label: t('estimar.metrics.costM2'), value: `R$ ${result.costPerM2.toLocaleString('pt-BR')}`, icon: '📐', highlight: false },
    { label: t('estimar.metrics.totalArea'), value: `${result.totalArea} m²`, icon: '🏠', highlight: false },
    { label: t('estimar.metrics.deadline'), value: `${result.timeMonths} ${result.timeMonths === 1 ? t('estimar.metrics.month') : t('estimar.metrics.months')}`, icon: '⏱️', highlight: false },
    { label: t('estimar.metrics.panels'), value: `${result.panels.toLocaleString('pt-BR')} ${t('estimar.metrics.unit')}`, icon: '🧱', highlight: false },
    { label: t('estimar.metrics.savings'), value: result.savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }), icon: '📈', highlight: false },
  ];

  return (
    <View style={styles.resultCard}>
      <Grad
        colors={['rgba(123,97,255,0.1)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={24}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.resultHeader}>
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>{t('estimar.estimateGenerated')}</Text>
        </View>
        <Text style={styles.resultType}>{result.type}</Text>
      </View>

      <View style={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.metricItem,
              m.highlight && styles.metricHighlight,
              idx === 0 && { width: '100%' },
            ]}
          >
            {m.highlight && (
              <Grad
                colors={['rgba(123,97,255,0.15)', 'rgba(30,144,255,0.06)']}
                style={StyleSheet.absoluteFill}
                borderRadius={16}
              />
            )}
            <Text style={styles.metricIcon}>{m.icon}</Text>
            <Text style={[styles.metricValue, m.highlight && styles.metricValueHighlight]}>
              {m.value}
            </Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.resultDisclaimer}>{t('estimar.disclaimer')}</Text>

      <TouchableOpacity style={styles.shareCTA} activeOpacity={0.85} onPress={onSendToPartner}>
        <Grad
          colors={Colors.gradients.premium}
          style={StyleSheet.absoluteFill}
          borderRadius={999}
        />
        <Text style={styles.shareCTAText}>{t('estimar.sendToPartner')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{t('estimar.saveEstimate')}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Estimativa Screen ────────────────────────────────────────────────────────
export default function EstimarScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [floors, setFloors] = useState('1');
  const obraTypeLabels: string[] = t('obraTypeLabels');
  const translatedObraTypes = OBRA_TYPES.map((o, i) => ({ ...o, label: obraTypeLabels[i] ?? o.label }));
  const [selectedTypeValue, setSelectedTypeValue] = useState(OBRA_TYPES[0].value);
  const selectedType = translatedObraTypes.find(o => o.value === selectedTypeValue) ?? translatedObraTypes[0];
  const [showDropdown, setShowDropdown] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const isValid = parseFloat(area) > 0;

  const handleSendToPartner = () => {
    navigation.getParent<any>()?.navigate('Empresas') ?? (navigation as any).navigate('Empresas');
  };

  const handleCalculate = () => {
    const areaNum = parseFloat(area) || 0;
    const floorsNum = parseInt(floors) || 1;
    if (areaNum <= 0) return;

    const totalArea = areaNum * floorsNum;
    const totalCost = totalArea * selectedType.costPerM2;
    const conventionalCostPerM2 = selectedType.costPerM2 * 1.3;
    const savings = (conventionalCostPerM2 - selectedType.costPerM2) * totalArea;
    const timeMonths = Math.max(1, Math.ceil(totalArea / 80));
    const panels = Math.ceil(totalArea * 4.5);

    setResult({
      totalArea,
      totalCost,
      costPerM2: selectedType.costPerM2,
      timeMonths,
      panels,
      savings,
      type: selectedType.label,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* ── Cover Hero ──────────────────────────────────── */}
        <View style={styles.coverHero}>
          <Image source={HERO_IMAGE} style={{ width: SW, height: HERO_H }} resizeMode="stretch" />
          <Grad
            colors={['rgba(4,8,15,0.6)', 'rgba(4,8,15,0.05)', 'rgba(4,8,15,0.75)', Colors.bgDeep]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.coverTopBar, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Ionicons name="chevron-back" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.coverBadge}>
              <Text style={styles.coverBadgeText}>SCIP ESTIMATOR</Text>
            </View>
          </View>
          <View style={styles.coverContent}>
            <Text style={styles.coverTitle}>{t('estimar.title')}</Text>
            <Text style={styles.coverSubtitle}>{t('estimar.subtitle')}</Text>
          </View>
        </View>

        {/* Header */}
        <View style={[styles.header, { marginTop: 16 }]}>
          <View style={styles.headerIcon}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={16} />
            <Text style={styles.headerIconText}>∑</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('estimar.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('estimar.subtitle')}</Text>
          </View>
        </View>

        {/* Info strip */}
        <View style={styles.infoStrip}>
          {(t('estimar.chips') as unknown as string[]).map((label: string, idx: number) => (
            <View key={idx} style={styles.infoChip}>
              <Text style={styles.infoChipText}>✓ {label}</Text>
            </View>
          ))}
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Grad
            colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
            style={StyleSheet.absoluteFill}
            borderRadius={24}
          />

          <Text style={styles.formTitle}>{t('estimar.formTitle')}</Text>

          {/* Address */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('estimar.addressLabel')}</Text>
            <View style={styles.fieldInput}>
              <TextInput
                style={styles.textInput}
                placeholder={t('estimar.addressPlaceholder')}
                placeholderTextColor={Colors.textDim}
                value={address}
                onChangeText={setAddress}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Area */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('estimar.areaLabel')}</Text>
            <View style={styles.fieldInput}>
              <TextInput
                style={styles.textInput}
                placeholder={t('estimar.areaPlaceholder')}
                placeholderTextColor={Colors.textDim}
                keyboardType="decimal-pad"
                value={area}
                onChangeText={setArea}
                returnKeyType="next"
              />
              <Text style={styles.fieldUnit}>m²</Text>
            </View>
          </View>

          {/* Floors */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('estimar.floorsLabel')}</Text>
            <View style={styles.floorRow}>
              {['1', '2', '3', '4+'].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.floorBtn, floors === n && styles.floorBtnActive]}
                  onPress={() => setFloors(n.replace('+', ''))}
                  activeOpacity={0.8}
                >
                  {floors === n && (
                    <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={12} />
                  )}
                  <Text style={[styles.floorBtnText, floors === n && styles.floorBtnTextActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tipo de Obra */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('estimar.typeLabel')}</Text>
            <TouchableOpacity style={styles.dropBtn} onPress={() => setShowDropdown(true)} activeOpacity={0.8}>
              <View>
                <Text style={styles.dropBtnText}>{selectedType.label}</Text>
                <Text style={styles.dropBtnCost}>R$ {selectedType.costPerM2.toLocaleString('pt-BR')}/m²</Text>
              </View>
              <Text style={styles.dropBtnArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sep} />

          {/* CTA */}
          <TouchableOpacity
            style={[styles.calcBtn, !isValid && styles.calcBtnDisabled]}
            onPress={handleCalculate}
            activeOpacity={isValid ? 0.85 : 1}
          >
            <Grad
              colors={isValid ? Colors.gradients.tech : ['#0B1C3D', '#070D1A']}
              style={StyleSheet.absoluteFill}
              borderRadius={999}
            />
            <Text style={[styles.calcBtnText, !isValid && { opacity: 0.5 }]}>
              {isValid ? t('estimar.calculate') : t('estimar.fillArea')}
            </Text>
          </TouchableOpacity>

          {isValid && (
            <Text style={styles.previewText}>
              {t('estimar.previewArea')} {(parseFloat(area) * parseInt(floors || '1')).toFixed(1)} m²
            </Text>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Grad
            colors={['rgba(47,107,255,0.08)', 'rgba(47,107,255,0.03)']}
            style={StyleSheet.absoluteFill}
            borderRadius={20}
          />
          <Text style={styles.tipsTitle}>{t('estimar.tips.title')}</Text>
          {(t('estimar.tips.items') as unknown as string[]).map((tip: string, idx: number) => (
            <View key={idx} style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Result */}
        {result && <ResultCard result={result} onSendToPartner={handleSendToPartner} />}

        {/* Comparison Table */}
        <ComparisonTable />

        {/* History placeholder */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico de Estimativas</Text>
          <View style={styles.historyEmpty}>
            <Text style={styles.historyEmptyIcon}>📋</Text>
            <Text style={styles.historyEmptyText}>Suas estimativas salvas aparecerão aqui</Text>
          </View>
        </View>
      </ScrollView>

      {/* Dropdown Modal */}
      <Modal visible={showDropdown} transparent animationType="slide" onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDropdown(false)}>
          <View style={styles.modalSheet}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('estimar.typeLabel')}</Text>
            <FlatList
              data={translatedObraTypes}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, item.value === selectedType.value && styles.modalItemActive]}
                  onPress={() => { setSelectedTypeValue(item.value); setShowDropdown(false); setResult(null); }}
                >
                  <View style={styles.modalItemLeft}>
                    <Text style={[styles.modalItemText, item.value === selectedType.value && { color: Colors.amber }]}>
                      {item.label}
                    </Text>
                    <Text style={styles.modalItemCost}>R$ {item.costPerM2.toLocaleString('pt-BR')}/m²</Text>
                  </View>
                  {item.value === selectedType.value && (
                    <View style={styles.modalCheckmark}>
                      <Text style={styles.modalCheckmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  headerIconText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    color: Colors.white,
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 21,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  infoChip: {
    backgroundColor: 'rgba(0,196,140,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.2)',
  },
  infoChipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#00C48C',
  },
  formCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  formTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    height: 52,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    padding: 0,
  },
  fieldUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.amber,
  },
  floorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  floorBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  floorBtnActive: {
    borderColor: Colors.purple,
  },
  floorBtnText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
    zIndex: 1,
  },
  floorBtnTextActive: {
    color: Colors.white,
  },
  dropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
  },
  dropBtnCost: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.amber,
    marginTop: 2,
  },
  dropBtnArrow: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  sep: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 16,
  },
  calcBtn: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  calcBtnDisabled: {},
  calcBtnText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    zIndex: 1,
  },
  previewText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textDim,
    textAlign: 'center',
    marginTop: 10,
  },
  tipsCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(47,107,255,0.15)',
    overflow: 'hidden',
    marginBottom: 16,
    gap: 8,
  },
  tipsTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.blue,
    marginTop: 6,
    flexShrink: 0,
  },
  tipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 20,
  },
  resultCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.2)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultBadge: {
    backgroundColor: 'rgba(0,196,140,0.15)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.25)',
  },
  resultBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#00C48C',
    letterSpacing: 1,
  },
  resultType: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metricItem: {
    width: '47%',
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    gap: 4,
  },
  metricHighlight: {
    borderColor: 'rgba(123,97,255,0.25)',
  },
  metricIcon: { fontSize: 14 },
  metricValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
  },
  metricValueHighlight: {
    fontSize: 15,
    color: Colors.amber,
  },
  metricLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  resultDisclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textDim,
    lineHeight: 16,
    marginBottom: 16,
  },
  shareCTA: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  shareCTAText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
    zIndex: 1,
  },
  saveBtn: {
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  saveBtnText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  // ── Comparison Table
  comparisonCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  comparisonHeader: {
    marginBottom: 16,
  },
  comparisonTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 4,
  },
  comparisonSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  compTableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  compColHead: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  compColScip: {
    backgroundColor: 'transparent',
  },
  compColHeadText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  compColHeadTextScip: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.white,
    zIndex: 1,
    textAlign: 'center',
  },
  compTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
    borderRadius: 8,
  },
  compTableRowAlt: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  compRowLabel: {
    flex: 1.2,
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    paddingLeft: 4,
  },
  compCell: {
    flex: 1,
    alignItems: 'center',
  },
  compCellScip: {},
  compCellText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textDim,
    textAlign: 'center',
  },
  compCellTextScip: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.amber,
    textAlign: 'center',
  },
  compFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  compFooterBadge: {
    backgroundColor: 'rgba(0,196,140,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.2)',
  },
  compFooterText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#00C48C',
  },
  // ── History
  historySection: {
    marginBottom: 16,
  },
  historyTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 12,
  },
  historyEmpty: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
    gap: 8,
  },
  historyEmptyIcon: { fontSize: 19 },
  historyEmptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textDim,
    textAlign: 'center',
  },
  // ── Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  modalItemActive: {
    borderColor: 'rgba(123,97,255,0.25)',
    backgroundColor: 'rgba(123,97,255,0.06)',
  },
  modalItemLeft: { gap: 3 },
  modalItemText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
  },
  modalItemCost: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  modalCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCheckmarkText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.white,
  },
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(4,8,15,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 20,
    gap: 6,
  },
  coverBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(123,97,255,0.3)',
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  coverBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.purple,
    letterSpacing: 1.2,
  },
  coverTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  coverSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
});
