import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Grad from './Grad';
import Colors from '../constants/colors';
import { OBRA_TYPES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type LangKey = 'pt' | 'en' | 'es';
const LANG_CURRENCY: Record<LangKey, { symbol: string; locale: string }> = {
  pt: { symbol: 'R$',  locale: 'pt-BR' },
  en: { symbol: 'US$', locale: 'en-US' },
  es: { symbol: 'US$', locale: 'es-MX' },
};

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function CalculatorCard() {
  const navigation = useNavigation<NavProp>();
  const { language, t } = useLanguage();
  const lang = (language as LangKey) in LANG_CURRENCY ? (language as LangKey) : 'pt';
  const { symbol, locale } = LANG_CURRENCY[lang];

  const [area,         setArea]         = useState('');
  const [floors,       setFloors]       = useState('1');
  const [selectedType, setSelectedType] = useState(OBRA_TYPES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [result,       setResult]       = useState<{
    totalArea: number; totalCost: number; costPerUnit: number; timeMonths: number; panels: number;
  } | null>(null);

  const getCost = (type: typeof OBRA_TYPES[0]) => type.costs[lang] ?? type.costs.pt;

  const handleCalculate = () => {
    const areaNum   = parseFloat(area) || 0;
    const floorsNum = parseInt(floors) || 1;
    if (areaNum <= 0) return;

    const totalArea   = Math.round(areaNum * floorsNum);
    const costPerUnit = getCost(selectedType);
    const totalCost   = totalArea * costPerUnit;
    const timeMonths  = Math.max(1, Math.ceil(totalArea / 80));
    const panels      = Math.ceil(totalArea * 0.55);

    setResult({ totalArea, totalCost, costPerUnit, timeMonths, panels });
  };

  const handleFullEstimate = () => {
    navigation.navigate('Estimar', {
      initialArea:      area,
      initialFloors:    floors,
      initialTypeValue: selectedType.value,
    });
  };

  const fmtCurrency = (val: number) =>
    `${symbol} ${val.toLocaleString(locale, { maximumFractionDigits: 0 })}`;

  return (
    <View style={styles.container}>
      <Grad
        colors={['rgba(11,28,61,0.95)', 'rgba(7,13,26,0.98)']}
        style={StyleSheet.absoluteFill}
        borderRadius={24}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={12} />
            <Ionicons name="calculator-outline" size={18} color={Colors.white} style={{ zIndex: 1 }} />
          </View>
          <View>
            <Text style={styles.title}>{t('calculatorCard.title')}</Text>
            <Text style={styles.subtitle}>{t('calculatorCard.subtitle')}</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t('calculatorCard.free')}</Text>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputsGrid}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('calculatorCard.areaLabel')}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="expand-outline" size={15} color={Colors.cyan} />
            <TextInput
              style={styles.input}
              placeholder={t('calculatorCard.areaPlaceholder')}
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              value={area}
              onChangeText={(v) => { setArea(v); setResult(null); }}
              returnKeyType="done"
            />
            <Text style={styles.inputUnit}>m²</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('calculatorCard.floorsLabel')}</Text>
          <View style={styles.floorRow}>
            {['1', '2', '3', '4+'].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.floorBtn, floors === n.replace('+', '') && styles.floorBtnActive]}
                onPress={() => { setFloors(n.replace('+', '')); setResult(null); }}
                activeOpacity={0.8}
              >
                {floors === n.replace('+', '') && (
                  <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={8} />
                )}
                <Text style={[styles.floorBtnText, floors === n.replace('+', '') && { color: Colors.white }]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Tipo de Obra */}
      <View style={[styles.inputGroup, { marginBottom: 0 }]}>
        <Text style={styles.inputLabel}>{t('estimar.typeLabel')}</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="construct-outline" size={15} color={Colors.amber} />
          <Text style={styles.dropdownText}>{selectedType.label}</Text>
          <Ionicons name="chevron-down-outline" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaWrapper, !area && { opacity: 0.5 }]}
        onPress={handleCalculate}
        activeOpacity={0.85}
        disabled={!area}
      >
        <Grad colors={area ? Colors.gradients.tech : ['#0B1C3D', '#070D1A']} style={styles.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Ionicons name="flash-outline" size={16} color={Colors.white} />
          <Text style={styles.ctaText}>{t('calculatorCard.calculate')}</Text>
        </Grad>
        {!!area && <View style={styles.ctaGlow} />}
      </TouchableOpacity>

      {/* Result Card */}
      {result && (
        <View style={styles.resultCard}>
          <Grad colors={['rgba(123,97,255,0.1)', 'rgba(30,144,255,0.05)']} style={StyleSheet.absoluteFill} borderRadius={16} />

          {/* 3 métricas */}
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{fmtCurrency(result.totalCost)}</Text>
              <Text style={styles.resultLabel}>{t('calculatorCard.totalCost')}</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{result.timeMonths}m</Text>
              <Text style={styles.resultLabel}>{t('calculatorCard.deadline')}</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{result.panels}</Text>
              <Text style={styles.resultLabel}>{t('calculatorCard.panels')}</Text>
            </View>
          </View>

          <Text style={styles.resultDisclaimer}>
            {fmtCurrency(result.costPerUnit)}/m² · {result.totalArea} m² · {selectedType.label}
          </Text>

          {/* CTA para tela completa */}
          <TouchableOpacity style={styles.fullEstimateBtn} onPress={handleFullEstimate} activeOpacity={0.85}>
            <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={12} />
            <Ionicons name="document-text-outline" size={15} color={Colors.white} />
            <Text style={styles.fullEstimateBtnText}>{t('calculatorCard.fullEstimate')}</Text>
            <Ionicons name="arrow-forward-outline" size={14} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal visible={showDropdown} transparent animationType="fade" onRequestClose={() => setShowDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDropdown(false)}>
          <View style={styles.dropdownList}>
            <Grad colors={['#0B1C3D', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={20} />
            <Text style={styles.dropdownTitle}>{t('estimar.typeLabel')}</Text>
            <FlatList
              data={OBRA_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.dropdownItem, item.value === selectedType.value && styles.dropdownItemActive]}
                  onPress={() => { setSelectedType(item); setShowDropdown(false); setResult(null); }}
                >
                  <Text style={[styles.dropdownItemText, item.value === selectedType.value && { color: Colors.amber }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.dropdownItemCost}>
                    {symbol} {getCost(item).toLocaleString(locale)}/m²
                  </Text>
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
  container: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox:     { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  title:       { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  subtitle:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  badge:       { backgroundColor: 'rgba(0,196,140,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(0,196,140,0.25)' },
  badgeText:   { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#00C48C', letterSpacing: 1 },
  inputsGrid:  { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inputGroup:  { flex: 1, marginBottom: 12 },
  inputLabel:  { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textMuted, marginBottom: 6, letterSpacing: 0.3 },
  inputWrapper:{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, height: 48, gap: 8 },
  input:       { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white, padding: 0 },
  inputUnit:   { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.textDim },
  floorRow:    { flexDirection: 'row', gap: 6 },
  floorBtn:    { flex: 1, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  floorBtnActive: { borderColor: Colors.purple },
  floorBtnText:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted, zIndex: 1 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, height: 48, gap: 8 },
  dropdownText:{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  separator:   { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 16 },
  ctaWrapper:  { position: 'relative' },
  ctaButton:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 999, gap: 8 },
  ctaText:     { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  ctaGlow:     { position: 'absolute', bottom: -8, left: 20, right: 20, height: 20, borderRadius: 10, backgroundColor: Colors.purple, opacity: 0.2 },
  resultCard:  { marginTop: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(123,97,255,0.2)', overflow: 'hidden', gap: 10 },
  resultRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  resultItem:  { alignItems: 'center', flex: 1 },
  resultValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.amber, letterSpacing: -0.3 },
  resultLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  resultDivider:{ width: 1, height: 32, backgroundColor: 'rgba(123,97,255,0.2)' },
  resultDisclaimer: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, textAlign: 'center' },
  fullEstimateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 12, overflow: 'hidden' },
  fullEstimateBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white, zIndex: 1, flex: 1, textAlign: 'center' },
  modalOverlay:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dropdownList:{ width: '100%', maxHeight: 380, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  dropdownTitle:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white, marginBottom: 12, textAlign: 'center' },
  dropdownItem:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },
  dropdownItemActive: { backgroundColor: 'rgba(123,97,255,0.1)', borderWidth: 1, borderColor: 'rgba(123,97,255,0.2)' },
  dropdownItemText:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  dropdownItemCost:{ fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
});
