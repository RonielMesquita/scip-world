import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/colors';

const { width: SW } = Dimensions.get('window');
const PLAYER_H = Math.round(SW * 9 / 16);

interface YoutubePlayerModalProps {
  videoId: string;
  title?: string;
  visible: boolean;
  onClose: () => void;
}

export default function YoutubePlayerModal({ videoId, title, visible, onClose }: YoutubePlayerModalProps) {
  const insets = useSafeAreaInsets();
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') setPlaying(false);
  }, []);

  const handleClose = () => {
    setPlaying(false);
    setReady(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.ytBadge}>
                <Text style={styles.ytBadgeText}>▶ YouTube</Text>
              </View>
              {title ? (
                <Text style={styles.headerTitle} numberOfLines={2}>{title}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Player */}
          <View style={styles.playerWrap}>
            {!ready && (
              <View style={styles.loader}>
                <ActivityIndicator color={Colors.cyan} size="large" />
                <Text style={styles.loaderText}>Carregando vídeo...</Text>
              </View>
            )}
            <YoutubePlayer
              height={PLAYER_H}
              videoId={videoId}
              play={playing}
              onChangeState={onStateChange}
              onReady={() => setReady(true)}
              webViewStyle={{ opacity: ready ? 1 : 0 }}
              initialPlayerParams={{
                modestbranding: true,
                rel: false,
                controls: true,
              }}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>📺 Reproduzindo no SCIP World</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.footerClose}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,8,15,0.92)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#070D1A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.15)',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  headerLeft: { flex: 1, gap: 6 },
  ytBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF0000',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ytBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  closeBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  playerWrap: {
    width: '100%',
    height: PLAYER_H,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 16,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    gap: 12,
    zIndex: 10,
  },
  loaderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  footerClose: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.cyan,
  },
});
