import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from './Grad';
import Colors from '../constants/colors';
import { Lead, LeadCredits } from '../hooks/useLeads';

const PRO_MONTHLY_LIMIT = 5;

interface Props {
  visible: boolean;
  onClose: () => void;
  lead: Lead | null;
  credits: LeadCredits | null;
  onUnlock: (leadId: string) => Promise<boolean>;
}

export default function LeadUnlockModal({ visible, onClose, lead, credits, onUnlock }: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  if (!lead) return null;

  const proRemaining = Math.max(0, PRO_MONTHLY_LIMIT - (credits?.pro_used ?? 0));
  const walletCredits = credits?.credits ?? 0;

  const handleUnlock = async (method: 'pro' | 'credit' | 'avulso') => {
    if (method === 'pro' && proRemaining === 0) {
      Alert.alert('Limite atingido', 'Você usou todos os leads PRO do mês. Compre créditos ou pague avulso.');
      return;
    }
    if (method === 'credit' && walletCredits === 0) {
      Alert.alert('Sem créditos', 'Você não tem créditos. Compre um pacote ou pague avulso.');
      return;
    }

    setLoading(true);
    const ok = await onUnlock(lead.id);
    setLoading(false);

    if (ok) {
      Alert.alert('Lead desbloqueado! ✅', 'Agora você pode ver os dados de contato do cliente.', [
        { text: 'Ver contato', onPress: onClose },
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível desbloquear. Tente novamente.');
    }
  };

  const OPTIONS = [
    {
      key: 'pro' as const,
      icon: 'rocket-outline',
      color: Colors.amber,
      title: 'Lead PRO mensal',
      subtitle: `${proRemaining} de ${PRO_MONTHLY_LIMIT} disponíveis este mês`,
      badge: proRemaining > 0 ? 'GRÁTIS' : 'ESGOTADO',
      badgeColor: proRemaining > 0 ? '#00C48C' : Colors.textFaded,
      disabled: proRemaining === 0,
    },
    {
      key: 'credit' as const,
      icon: 'wallet-outline',
      color: Colors.cyan,
      title: 'Usar crédito',
      subtitle: `${walletCredits} crédito${walletCredits !== 1 ? 's' : ''} na carteira`,
      badge: walletCredits > 0 ? `${walletCredits} crédito${walletCredits !== 1 ? 's' : ''}` : 'SEM CRÉDITOS',
      badgeColor: walletCredits > 0 ? Colors.cyan : Colors.textFaded,
      disabled: walletCredits === 0,
    },
    {
      key: 'avulso' as const,
      icon: 'card-outline',
      color: Colors.purple,
      title: 'Pagar avulso',
      subtitle: 'Desbloquear este lead individualmente',
      badge: 'R$ 12',
      badgeColor: Colors.purple,
      disabled: false,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheet}>
          <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={24} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.lockIcon}>
              <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={12} />
              <Ionicons name="lock-closed" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Desbloquear Lead</Text>
              <Text style={styles.subtitle}>
                {lead.project_type ?? 'Projeto'}{lead.city ? ` · ${lead.city}` : ''}
                {lead.area_m2 ? ` · ${lead.area_m2} m²` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={Colors.textFaded} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Opções */}
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.option, opt.disabled && styles.optionDisabled]}
              onPress={() => !opt.disabled && handleUnlock(opt.key)}
              activeOpacity={opt.disabled ? 1 : 0.82}
              disabled={loading}
            >
              <View style={[styles.optionIcon, { backgroundColor: opt.color + '18' }]}>
                <Ionicons name={opt.icon as any} size={18} color={opt.disabled ? Colors.textFaded : opt.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, opt.disabled && { color: Colors.textFaded }]}>
                  {opt.title}
                </Text>
                <Text style={styles.optionSub}>{opt.subtitle}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: opt.badgeColor + '22' }]}>
                <Text style={[styles.badgeText, { color: opt.disabled ? Colors.textFaded : opt.badgeColor }]}>
                  {opt.badge}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Comprar pacote */}
          <View style={styles.divider} />
          <TouchableOpacity style={styles.buyPackage} activeOpacity={0.85}>
            <Grad colors={['rgba(123,97,255,0.12)', 'rgba(76,201,240,0.08)']} style={StyleSheet.absoluteFill} borderRadius={14} />
            <Ionicons name="bag-add-outline" size={16} color={Colors.purple} />
            <Text style={styles.buyPackageText}>Comprar pacote de créditos</Text>
            <Text style={styles.buyPackageSub}>5 por R$49 · 15 por R$119 · 30 por R$199</Text>
          </TouchableOpacity>

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={Colors.cyan} size="large" />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,8,15,0.85)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  sheet: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.12)',
    padding: 20,
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  lockIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textFaded,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 14,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
  optionSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.3,
  },

  buyPackage: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.2)',
  },
  buyPackageText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.purple,
    flex: 1,
  },
  buyPackageSub: {
    width: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,15,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
});
