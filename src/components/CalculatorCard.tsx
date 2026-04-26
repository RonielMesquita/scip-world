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
import Grad from './Grad';
import Colors from '../constants/colors';
import { OBRA_TYPES } from '../data/mockData';

interface CalculatorCardProps {
  onCalculate?: (result: CalculationResult) => void;
}

export interface CalculationResult {
  area: number;
  floors: number;
  type: string;
  totalCost: number;
  costPerM2: number;
  timeMonths: number;
  panels: number;
}

export default function CalculatorCard({ onCalculate }: CalculatorCardProps) {
  const [area, setArea] = useState('');
  const [floors, setFloors] = useState('1');
  const [selectedType, setSelectedType] = useState(OBRA_TYPES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const areaNum = parseFloat(area) || 0;
    const floorsNum = parseInt(floors) || 1;
    if (areaNum <= 0) return;

    const totalArea = areaNum * floorsNum;
    const totalCost = totalArea * selectedType.costPerM2;
    const timeMonths = Math.max(1, Math.ceil(totalArea / 80));
    const panels = Math.ceil(totalArea * 4.5);

    const calc: CalculationResult = {
      area: areaNum,
      floors: floorsNum,
      type: selectedType.label,
      totalCost,
      costPerM2: selectedType.costPerM2,
      timeMonths,
      panels,
    };

    setResult(calc);
    onCalculate?.(calc);
  };

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
            <Text style={styles.iconText}>∑</Text>
          </View>
          <View>
            <Text style={styles.title}>Calculadora</Text>
            <Text style={styles.subtitle}>Estimativa SCIP instantânea</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GRÁTIS</Text>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputsGrid}>
        {/* Area Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Área (m²)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📐</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 120"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              value={area}
              onChangeText={setArea}
              returnKeyType="done"
            />
            <Text style={styles.inputUnit}>m²</Text>
          </View>
        </View>

        {/* Floors Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nº Pavimentos</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="layers-outline" size={16} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="1"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              value={floors}
              onChangeText={setFloors}
              returnKeyType="done"
            />
          </View>
        </View>
      </View>

      {/* Tipo de Obra Dropdown */}
      <View style={[styles.inputGroup, { marginBottom: 0 }]}>
        <Text style={styles.inputLabel}>Tipo de Obra</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.dropdownText}>{selectedType.label}</Text>
          <Ionicons name="chevron-down-outline" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* CTA Button */}
      <TouchableOpacity style={styles.ctaWrapper} onPress={handleCalculate} activeOpacity={0.85}>
        <Grad
          colors={Colors.gradients.premium}
          style={styles.ctaButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.ctaText}>Calcular agora</Text>
          <Text style={styles.ctaArrow}>→</Text>
        </Grad>
        <View style={styles.ctaGlow} />
      </TouchableOpacity>

      {/* Result Card */}
      {result && (
        <View style={styles.resultCard}>
          <Grad
            colors={['rgba(123,97,255,0.1)', 'rgba(255,85,0,0.04)']}
            style={StyleSheet.absoluteFill}
            borderRadius={16}
          />
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>
                {result.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
              </Text>
              <Text style={styles.resultLabel}>Investimento Total</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{result.timeMonths}m</Text>
              <Text style={styles.resultLabel}>Prazo Estimado</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{result.panels}</Text>
              <Text style={styles.resultLabel}>Painéis SCIP</Text>
            </View>
          </View>
          <Text style={styles.resultDisclaimer}>
            * Estimativa baseada em {result.area * result.floors}m² totais · {result.type}
          </Text>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownList}>
            <Grad
              colors={['#0B1C3D', '#04080F']}
              style={StyleSheet.absoluteFill}
              borderRadius={20}
            />
            <Text style={styles.dropdownTitle}>Tipo de Obra</Text>
            <FlatList
              data={OBRA_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.value === selectedType.value && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedType(item);
                    setShowDropdown(false);
                    setResult(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      item.value === selectedType.value && { color: Colors.amber },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.dropdownItemCost}>
                    R$ {item.costPerM2.toLocaleString('pt-BR')}/m²
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
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: { elevation: 10 },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.2)',
  },
  iconText: {
    fontSize: 15,
    color: Colors.amber,
  },
  title: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  badge: {
    backgroundColor: 'rgba(0,196,140,0.12)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,196,140,0.25)',
  },
  badgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: '#00C48C',
    letterSpacing: 1,
  },
  inputsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  inputIcon: {
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
    padding: 0,
  },
  inputUnit: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textDim,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  dropdownText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.white,
  },
  dropdownArrow: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 16,
  },
  ctaWrapper: {
    position: 'relative',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 999,
    gap: 10,
  },
  ctaText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  ctaArrow: {
    fontSize: 14,
    color: Colors.white,
  },
  ctaGlow: {
    position: 'absolute',
    bottom: -8,
    left: 20,
    right: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.purple,
    opacity: 0.2,
  },
  resultCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.15)',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  resultItem: {
    alignItems: 'center',
    flex: 1,
  },
  resultValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.amber,
    letterSpacing: -0.3,
  },
  resultLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  resultDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(123,97,255,0.2)',
  },
  resultDisclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textDim,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdownList: {
    width: '100%',
    maxHeight: 380,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  dropdownTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(123,97,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.2)',
  },
  dropdownItemText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
  },
  dropdownItemCost: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
