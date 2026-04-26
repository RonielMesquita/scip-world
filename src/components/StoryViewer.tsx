import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Modal, Image, TouchableOpacity,
  StyleSheet, Animated, Dimensions, StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Grad from './Grad';
import Colors from '../constants/colors';
import { FeedStory } from '../data/mockData';

const { width: SW, height: SH } = Dimensions.get('window');
const STORY_DURATION = 5000;

interface Props {
  stories: FeedStory[];
  startIndex: number;
  visible: boolean;
  onClose: () => void;
  onViewed?: (id: string) => void;
}

export default function StoryViewer({ stories, startIndex, visible, onClose, onViewed }: Props) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(startIndex);
  const progress = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const pausedAt = useRef(0);
  const isPaused = useRef(false);

  const story = stories[current];

  const startProgress = (from = 0) => {
    progress.setValue(from);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION * (1 - from),
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) advance();
    });
  };

  const advance = () => {
    if (current < stories.length - 1) {
      onViewed?.(stories[current].id);
      setCurrent((c) => c + 1);
    } else {
      onViewed?.(stories[current].id);
      onClose();
    }
  };

  const goBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
    else onClose();
  };

  useEffect(() => {
    if (!visible) return;
    animRef.current?.stop();
    startProgress(0);
    return () => { animRef.current?.stop(); };
  }, [current, visible]);

  useEffect(() => {
    if (!visible) {
      animRef.current?.stop();
      progress.setValue(0);
      setCurrent(startIndex);
    }
  }, [visible]);

  if (!story) return null;

  const handleLongPressIn = () => {
    isPaused.current = true;
    animRef.current?.stop();
    progress.stopAnimation((v) => { pausedAt.current = v; });
  };

  const handleLongPressOut = () => {
    isPaused.current = false;
    startProgress(pausedAt.current);
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.root}>
        {/* Background image */}
        <Image source={{ uri: story.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <Grad
          colors={['rgba(4,8,15,0.55)', 'transparent', 'transparent', 'rgba(4,8,15,0.72)']}
          style={StyleSheet.absoluteFill}
          locations={[0, 0.25, 0.65, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Progress bars */}
        <View style={[styles.progressRow, { top: insets.top + 10 }]}>
          {stories.map((_, i) => (
            <View key={i} style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width:
                      i < current
                        ? '100%'
                        : i === current
                        ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={[styles.header, { top: insets.top + 26 }]}>
          <View style={styles.headerUser}>
            <View style={[styles.avatar, { backgroundColor: story.avatarColor + '30', borderColor: story.avatarColor }]}>
              <Text style={[styles.avatarText, { color: story.avatarColor }]}>{story.avatarInitial}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{story.userName}</Text>
              <Text style={styles.timeAgo}>agora</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Tap zones */}
        <View style={styles.tapZones}>
          <TouchableWithoutFeedback
            onPress={goBack}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          >
            <View style={styles.tapLeft} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={advance}
            onLongPress={handleLongPressIn}
            onPressOut={handleLongPressOut}
          >
            <View style={styles.tapRight} />
          </TouchableWithoutFeedback>
        </View>

        {/* Caption */}
        {story.caption ? (
          <View style={[styles.captionWrap, { bottom: insets.bottom + 40 }]}>
            <Text style={styles.captionText}>{story.caption}</Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  progressRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
    zIndex: 20,
  },
  progressTrack: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.white,
  },

  header: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  userName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.white,
  },
  timeAgo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
  },

  tapZones: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 10,
  },
  tapLeft: {
    flex: 1,
  },
  tapRight: {
    flex: 1,
  },

  captionWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
  },
  captionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    lineHeight: 21,
  },
});
