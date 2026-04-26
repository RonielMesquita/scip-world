import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Grad from '../components/Grad';
import Colors from '../constants/colors';
import { FEED_STORIES, COMPANIES, FeedPost, FeedStory } from '../data/mockData';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { useAuth } from '../contexts/AuthContext';
import { useFeed } from '../contexts/FeedContext';
import CreatePostModal from '../components/CreatePostModal';
import StoryViewer from '../components/StoryViewer';
import NotificationsModal from '../components/NotificationsModal';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../contexts/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SW } = Dimensions.get('window');
const POST_IMG_H = Math.round(SW * 0.65);

// ─── Story Item ───────────────────────────────────────────────────────────────
function StoryItem({
  story, isOwn, hasMyStory, onPress,
}: { story: FeedStory; isOwn?: boolean; hasMyStory?: boolean; onPress?: () => void }) {
  const { t } = useLanguage();
  return (
    <TouchableOpacity style={styles.storyItem} activeOpacity={0.82} onPress={onPress}>
      <View style={styles.storyRingWrap}>
        {/* Anel */}
        {isOwn && hasMyStory ? (
          <Grad
            colors={[story.avatarColor, '#7B61FF']}
            style={styles.storyRing}
            borderRadius={999}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : !story.viewed ? (
          <Grad
            colors={[story.avatarColor, '#7B61FF']}
            style={styles.storyRing}
            borderRadius={999}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ) : (
          <View style={[styles.storyRing, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
        )}

        {/* Avatar — mostra preview da foto se own story existe */}
        <View style={[styles.storyAvatar, { backgroundColor: story.avatarColor + '22', overflow: 'hidden' }]}>
          {isOwn && hasMyStory && story.image ? (
            <Image source={{ uri: story.image }} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
          ) : (
            <Text style={[styles.storyInitial, { color: story.avatarColor }]}>{story.avatarInitial}</Text>
          )}
        </View>

        {/* Botão "+" só aparece quando não tem story própria */}
        {isOwn && !hasMyStory && (
          <View style={styles.storyAddBtn}>
            <Grad colors={Colors.gradients.tech} style={StyleSheet.absoluteFill} borderRadius={999} />
            <Text style={styles.storyAddIcon}>+</Text>
          </View>
        )}
      </View>
      <Text style={[styles.storyName, isOwn && { color: Colors.cyan }]} numberOfLines={1}>
        {isOwn ? t('feed.myStory') : story.userName}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
type LangKey = 'pt' | 'en' | 'es';

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<NavProp>();
  const { t, language } = useLanguage();
  const lang = (['pt', 'en', 'es'].includes(language) ? language : 'pt') as LangKey;
  const caption = post.caption[lang];

  const handleAuthorPress = () => {
    if (!post.companyId) return;
    const company = COMPANIES.find((c) => c.id === post.companyId);
    if (company) navigation.navigate('EmpresaProfile', { company });
  };

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.4, duration: 110, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 180, friction: 6 }),
    ]).start();
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
  };

  const isLong = caption.length > 95;

  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity
          style={styles.postAuthorRow}
          onPress={handleAuthorPress}
          activeOpacity={post.companyId ? 0.75 : 1}
          disabled={!post.companyId}
        >
          <View style={styles.postAvatarWrap}>
            {post.isPremium ? (
              <Grad
                colors={[post.avatarColor, post.avatarColor + '55']}
                style={styles.postAvatarRing}
                borderRadius={999}
              />
            ) : (
              <View style={[styles.postAvatarRing, { backgroundColor: post.avatarColor + '30' }]} />
            )}
            <View style={[styles.postAvatar, { backgroundColor: post.avatarColor + '22' }]}>
              <Text style={[styles.postAvatarText, { color: post.avatarColor }]}>{post.avatarInitial}</Text>
            </View>
          </View>

          <View style={styles.postUserInfo}>
            <View style={styles.postNameRow}>
              <Text style={styles.postUserName} numberOfLines={1}>{post.userName}</Text>
              {post.verified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.blue} style={{ marginLeft: 4 }} />
              )}
              {post.isPremium && (
                <View style={styles.proBadge}>
                  <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={4} />
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              )}
            </View>
            <Text style={styles.postUserRole} numberOfLines={1}>{post.userRole}</Text>
            <View style={styles.postMetaRow}>
              {post.location ? (
                <Text style={styles.postMetaText}>{post.location} · </Text>
              ) : null}
              <Text style={styles.postMetaText}>{post.timeAgo}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.postMenuBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textFaded} />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <View style={styles.postImageWrap}>
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
        <Grad
          colors={['transparent', 'rgba(4,8,15,0.45)']}
          style={StyleSheet.absoluteFill}
        />
        {post.isPremium && (
          <View style={styles.postPremiumOverlay}>
            <Ionicons name="star" size={10} color={Colors.amber} />
            <Text style={styles.postPremiumText}>Conta PRO</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLike} style={styles.postActionBtn} activeOpacity={0.75}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={23}
              color={liked ? '#FF4D9D' : Colors.textMuted}
            />
          </Animated.View>
          <Text style={[styles.postActionLabel, liked && { color: '#FF4D9D' }]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.postActionsDivider} />

        <TouchableOpacity style={styles.postActionBtn} activeOpacity={0.75}>
          <Ionicons name="share-social-outline" size={21} color={Colors.textMuted} />
          <Text style={styles.postActionLabel}>{t('feed.share')}</Text>
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <View style={styles.postCaption}>
        <Text style={styles.postCaptionText} numberOfLines={expanded ? undefined : 2}>
          <Text style={styles.postCaptionName}>{post.userName.split(' ')[0]} </Text>
          {caption}
        </Text>
        {isLong && !expanded && (
          <TouchableOpacity onPress={() => setExpanded(true)} activeOpacity={0.7}>
            <Text style={styles.postSeeMore}>{t('feed.seeMore')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Stories Bar ──────────────────────────────────────────────────────────────
function StoriesBar({
  user, onOpenStory, myStoryImage, onAddStory, onViewMyStory,
}: {
  user: any;
  onOpenStory: (index: number) => void;
  myStoryImage: string | null;
  onAddStory: () => void;
  onViewMyStory: () => void;
}) {
  const { t } = useLanguage();
  const myStory: FeedStory = {
    id: 'my',
    userName: t('feed.you'),
    avatarInitial: user?.avatarInitial ?? 'U',
    avatarColor: user?.avatarColor ?? Colors.blue,
    viewed: false,
    image: myStoryImage ?? '',
  };

  return (
    <View style={styles.storiesWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}
      >
        <StoryItem
          story={myStory}
          isOwn
          hasMyStory={!!myStoryImage}
          onPress={myStoryImage ? onViewMyStory : onAddStory}
        />
        {FEED_STORIES.map((s, i) => (
          <StoryItem key={s.id} story={s} onPress={() => onOpenStory(i)} />
        ))}
      </ScrollView>
      <View style={styles.storiesDivider} />
    </View>
  );
}

// ─── Feed Screen ──────────────────────────────────────────────────────────────
export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { user, myCompany } = useAuth();
  const { posts } = useFeed();
  const { t } = useLanguage();
  const { opacity, translateY } = useEntryAnimation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotif,      setShowNotif]      = useState(false);
  const [storyIndex,    setStoryIndex]    = useState(0);
  const [showStory,     setShowStory]     = useState(false);
  const [stories,       setStories]       = useState(FEED_STORIES);
  const [myStoryImage,  setMyStoryImage]  = useState<string | null>(null);

  const openStory = (index: number) => {
    setStoryIndex(index);
    setShowStory(true);
  };

  const markViewed = (id: string) => {
    setStories((prev) => prev.map((s) => s.id === id ? { ...s, viewed: true } : s));
  };

  const handleAddStory = async () => {
    if (!myCompany) {
      Alert.alert(
        t('feed.proFeature'),
        t('feed.proFeatureDesc'),
        [{ text: t('feed.understood'), style: 'default' }],
      );
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('feed.permRequired'), t('feed.permDesc'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setMyStoryImage(result.assets[0].uri);
      // Abre imediatamente o viewer na story própria
      setStoryIndex(-1);
      setShowStory(true);
    }
  };

  // Story própria montada como FeedStory para o viewer
  const myStoryForViewer: import('../data/mockData').FeedStory | null = myStoryImage
    ? {
        id: 'my',
        userName: user?.name ?? t('feed.you'),
        avatarInitial: user?.avatarInitial ?? 'U',
        avatarColor: user?.avatarColor ?? Colors.blue,
        viewed: false,
        image: myStoryImage,
        caption: 'Sua story',
      }
    : null;

  // Lista completa para o viewer: story própria na frente se existir
  const allStoriesForViewer = myStoryForViewer
    ? [myStoryForViewer, ...stories]
    : stories;

  const viewerIndex = storyIndex === -1 ? 0 : myStoryForViewer ? storyIndex + 1 : storyIndex;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Grad colors={Colors.gradients.background} style={StyleSheet.absoluteFill} />

      {/* Header fixo */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Grad
          colors={['rgba(4,8,15,0.98)', 'rgba(4,8,15,0)']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.headerLeft}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>{t('feed.title')}</Text>
          <Text style={styles.headerSub}>{t('feed.subtitle')}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.75}>
            <Ionicons name="search-outline" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.75} onPress={() => setShowNotif(true)}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textMuted} />
            <View style={styles.headerNotifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo rolável */}
      <Animated.ScrollView
        style={[{ opacity, transform: [{ translateY }] }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 58,
          paddingBottom: insets.bottom + 110,
        }}
      >
        <StoriesBar
          user={user}
          onOpenStory={openStory}
          myStoryImage={myStoryImage}
          onAddStory={handleAddStory}
          onViewMyStory={() => { setStoryIndex(-1); setShowStory(true); }}
        />

        {/* Posts */}
        <View style={styles.postsWrap}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        {/* Fim do feed */}
        <View style={styles.feedEnd}>
          <View style={styles.feedEndLine} />
          <Text style={styles.feedEndText}>{t('feed.upToDate')}</Text>
          <View style={styles.feedEndLine} />
        </View>
      </Animated.ScrollView>

      {/* Botão flutuante – apenas para PRO */}
      {myCompany && (
        <TouchableOpacity
          style={[styles.fab, { bottom: insets.bottom + 80 }]}
          onPress={() => setShowCreatePost(true)}
          activeOpacity={0.88}
        >
          <Grad colors={Colors.gradients.cyan} style={StyleSheet.absoluteFill} borderRadius={999} />
          <Ionicons name="add" size={28} color={Colors.white} />
        </TouchableOpacity>
      )}

      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        user={user}
        company={myCompany}
      />

      <StoryViewer
        stories={allStoriesForViewer}
        startIndex={viewerIndex}
        visible={showStory}
        onClose={() => setShowStory(false)}
        onViewed={markViewed}
      />

      <NotificationsModal visible={showNotif} onClose={() => setShowNotif(false)} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgDeep },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerAccent: {
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.white,
    letterSpacing: 0.2,
  },
  headerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textFaded,
    marginTop: 2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNotifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF4D9D',
    borderWidth: 1.5,
    borderColor: Colors.bgDeep,
  },

  // Stories
  storiesWrap: { marginBottom: 4 },
  storiesContent: { paddingHorizontal: 14, paddingVertical: 14, gap: 16 },
  storyItem: { alignItems: 'center', gap: 6, width: 64 },
  storyRingWrap: { position: 'relative' },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatar: {
    position: 'absolute',
    top: 2.5,
    left: 2.5,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },
  storyInitial: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  storyAddBtn: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },
  storyAddIcon: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    lineHeight: 16,
  },
  storyName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  storiesDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 0,
  },

  // Posts
  postsWrap: { gap: 2, marginTop: 4 },
  postCard: {
    backgroundColor: '#070D1A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    marginBottom: 8,
  },

  // Post header
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  postAuthorRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAvatarWrap: { position: 'relative' },
  postAvatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatar: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },
  postAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  postUserInfo: { flex: 1 },
  postNameRow: { flexDirection: 'row', alignItems: 'center' },
  postUserName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.white,
    flexShrink: 1,
  },
  proBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  proBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  postUserRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
    marginTop: 1,
  },
  postMetaRow: { flexDirection: 'row', marginTop: 2 },
  postMetaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  postMenuBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Post image
  postImageWrap: {
    width: SW,
    height: POST_IMG_H,
    overflow: 'hidden',
  },
  postImage: {
    width: SW,
    height: POST_IMG_H,
  },
  postPremiumOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(4,8,15,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.amber + '40',
  },
  postPremiumText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    color: Colors.amber,
    letterSpacing: 0.4,
  },

  // Post actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  postActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingRight: 16,
  },
  postActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textMuted,
  },
  postActionsDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginRight: 16,
  },

  // Post caption
  postCaption: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 2,
  },
  postCaptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textDim,
    lineHeight: 20,
  },
  postCaptionName: {
    fontFamily: 'Inter_700Bold',
    color: Colors.white,
  },
  postSeeMore: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textFaded,
    marginTop: 2,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.cyan,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },

  // Feed end
  feedEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  feedEndLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  feedEndText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
  },
});
