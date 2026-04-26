import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
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

// On web: WebView renders as <iframe src="..."> pointing directly to YouTube embed
// On native: WebView renders natively with the same URI
function YoutubeEmbed({ videoId, onLoad }: { videoId: string; onLoad: () => void }) {
  const embedUri = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  if (Platform.OS === 'web') {
    // For web, render a real iframe via dangerouslySetInnerHTML workaround
    const IframeComponent = 'iframe' as any;
    return (
      <View style={styles.webview}>
        <IframeComponent
          src={embedUri}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="autoplay; fullscreen; accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={onLoad}
        />
      </View>
    );
  }

  return (
    <WebView
      style={styles.webview}
      source={{ uri: embedUri }}
      allowsFullscreenVideo
      javaScriptEnabled
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      onLoadEnd={onLoad}
      originWhitelist={['*']}
    />
  );
}

export default function YoutubePlayerModal({ videoId, title, visible, onClose }: YoutubePlayerModalProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  const handleClose = () => {
    setLoading(true);
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
            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator color={Colors.cyan} size="large" />
                <Text style={styles.loaderText}>Carregando vídeo...</Text>
              </View>
            )}
            <YoutubeEmbed videoId={videoId} onLoad={() => setLoading(false)} />
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
  webview: {
    flex: 1,
    backgroundColor: '#000',
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
