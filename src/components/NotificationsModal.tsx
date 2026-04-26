import React from 'react';
import {
  View, Text, Modal, TouchableOpacity,
  StyleSheet, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from './Grad';
import Colors from '../constants/colors';

const NOTIFICATIONS = [
  { id: 'n1', type: 'evento', icon: '📅', title: 'SCIP World Summit 2025', body: 'Inscrições abertas — 15 de Maio em São Paulo', time: 'Agora', unread: true },
  { id: 'n2', type: 'artigo', icon: '📝', title: 'Novo artigo publicado', body: 'SCIP vs Alvenaria: Comparativo Técnico Completo', time: '2h', unread: true },
  { id: 'n3', type: 'comunidade', icon: '💬', title: 'Resposta na sua pergunta', body: 'Eng. Ricardo respondeu sua dúvida sobre argamassa SCIP', time: '5h', unread: true },
  { id: 'n4', type: 'video', icon: '▶', title: 'Novo vídeo disponível', body: '3D SCIP Building — Modelagem completa do projeto', time: '1d', unread: false },
  { id: 'n5', type: 'evento', icon: '📅', title: 'Webinar amanhã', body: 'Fundações Superficiais para SCIP — 22 de Maio, 19h', time: '1d', unread: false },
  { id: 'n6', type: 'artigo', icon: '📝', title: 'Lei atualizada', body: 'ABNT NBR 6118:2023 — Novas diretrizes para EPS', time: '3d', unread: false },
  { id: 'n7', type: 'comunidade', icon: '💬', title: 'Especialista online', body: 'Arq. Fernanda está disponível para consultas agora', time: '3d', unread: false },
];

const TYPE_COLORS: Record<string, string> = {
  evento: Colors.amber,
  artigo: Colors.cyan,
  comunidade: Colors.purple,
  video: '#00C48C',
};

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill as any} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
          <Grad colors={['#070D1A', '#04080F']} style={StyleSheet.absoluteFill} />
          <View style={styles.topBorder} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Notificações</Text>
              {unreadCount > 0 && (
                <Text style={styles.headerSub}>{unreadCount} não lidas</Text>
              )}
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.markAllBtn}>
                <Text style={styles.markAllText}>Marcar todas</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}>
            {NOTIFICATIONS.map((notif) => {
              const color = TYPE_COLORS[notif.type] ?? Colors.cyan;
              return (
                <TouchableOpacity key={notif.id} style={[styles.card, notif.unread && styles.cardUnread]} activeOpacity={0.85}>
                  <Grad
                    colors={notif.unread
                      ? [`${color}14`, 'rgba(7,13,26,0.98)']
                      : ['rgba(11,28,61,0.6)', 'rgba(7,13,26,0.8)']}
                    style={StyleSheet.absoluteFill}
                    borderRadius={16}
                  />
                  {notif.unread && <View style={[styles.unreadBar, { backgroundColor: color }]} />}
                  <View style={[styles.iconBox, { backgroundColor: color + '1A', borderColor: color + '35' }]}>
                    <Text style={[styles.iconText, { color }]}>{notif.icon}</Text>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.titleRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>{notif.title}</Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                    <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: color + '18', borderColor: color + '30' }]}>
                      <Text style={[styles.typeText, { color }]}>{notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-start' },
  sheet: {
    flex: 1,
    overflow: 'hidden',
    maxHeight: '92%',
  },
  topBorder: { position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(76,201,240,0.15)' },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.cyan, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  markAllText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  cardUnread: { borderColor: 'rgba(76,201,240,0.12)' },
  unreadBar: { position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2 },
  iconBox: {
    width: 42, height: 42, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  iconText: { fontSize: 16 },
  content: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white, flex: 1, marginRight: 8 },
  notifTime: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.textDim, flexShrink: 0 },
  notifBody: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 20, borderWidth: 1, marginTop: 2,
  },
  typeText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 0.4 },
});
