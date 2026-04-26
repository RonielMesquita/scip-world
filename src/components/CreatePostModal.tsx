import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  TextInput, Image, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, ScrollView, Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Grad from './Grad';
import Colors from '../constants/colors';
import { useFeed } from '../contexts/FeedContext';
import { FeedPost } from '../data/mockData';
import { MyCompany, User } from '../contexts/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  user: User | null;
  company: MyCompany | null;
}

export default function CreatePostModal({ visible, onClose, user, company }: Props) {
  const insets = useSafeAreaInsets();
  const { addPost } = useFeed();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!imageUri) { Alert.alert('Foto obrigatória', 'Adicione uma foto para publicar.'); return; }
    if (!caption.trim()) { Alert.alert('Legenda obrigatória', 'Escreva uma legenda para a publicação.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const post: FeedPost = {
      id: `fp_${Date.now()}`,
      userName: company?.name ?? user?.name ?? 'Usuário',
      userRole: company?.category ?? user?.role ?? '',
      avatarInitial: company?.logoInitial ?? user?.avatarInitial ?? 'U',
      avatarColor: company?.logoColor ?? user?.avatarColor ?? Colors.cyan,
      verified: true,
      isPremium: true,
      image: imageUri,
      caption: caption.trim(),
      likes: 0,
      timeAgo: 'agora',
      location: company?.location ?? user?.location ?? '',
    };

    addPost(post);
    setLoading(false);
    setImageUri(null);
    setCaption('');
    onClose();
  };

  const handleClose = () => {
    setImageUri(null);
    setCaption('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
                <Grad colors={['#0D1F42', '#04080F']} style={StyleSheet.absoluteFill} borderRadius={28} />

                {/* Handle */}
                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity onPress={handleClose} style={styles.headerBtn} activeOpacity={0.7}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Nova Publicação</Text>
                  <TouchableOpacity
                    onPress={handlePublish}
                    style={[styles.publishBtn, (!imageUri || !caption.trim()) && styles.publishBtnDisabled]}
                    activeOpacity={0.85}
                    disabled={loading || !imageUri || !caption.trim()}
                  >
                    {loading
                      ? <ActivityIndicator size="small" color={Colors.white} />
                      : <Text style={styles.publishBtnText}>Publicar</Text>
                    }
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {/* Autor */}
                  <View style={styles.authorRow}>
                    <View style={[styles.avatar, { backgroundColor: (company?.logoColor ?? user?.avatarColor ?? Colors.cyan) + '22', borderColor: company?.logoColor ?? user?.avatarColor ?? Colors.cyan }]}>
                      <Text style={[styles.avatarText, { color: company?.logoColor ?? user?.avatarColor ?? Colors.cyan }]}>
                        {company?.logoInitial ?? user?.avatarInitial ?? 'U'}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.authorName}>{company?.name ?? user?.name}</Text>
                      <View style={styles.proBadge}>
                        <Grad colors={Colors.gradients.premium} style={StyleSheet.absoluteFill} borderRadius={4} />
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    </View>
                  </View>

                  {/* Caption */}
                  <TextInput
                    style={styles.captionInput}
                    placeholder="Escreva uma legenda para sua publicação..."
                    placeholderTextColor={Colors.textFaded}
                    value={caption}
                    onChangeText={(v) => v.length <= 300 && setCaption(v)}
                    multiline
                    maxLength={300}
                    textAlignVertical="top"
                  />
                  <Text style={styles.charCount}>{caption.length}/300</Text>

                  {/* Foto */}
                  <TouchableOpacity style={styles.imageArea} onPress={pickImage} activeOpacity={0.85}>
                    {imageUri ? (
                      <>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                        <View style={styles.changePhotoOverlay}>
                          <Ionicons name="camera" size={20} color={Colors.white} />
                          <Text style={styles.changePhotoText}>Trocar foto</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Grad
                          colors={['rgba(76,201,240,0.08)', 'rgba(123,97,255,0.06)']}
                          style={StyleSheet.absoluteFill}
                          borderRadius={16}
                        />
                        <View style={styles.imagePickerIcon}>
                          <Grad colors={Colors.gradients.cyan} style={StyleSheet.absoluteFill} borderRadius={999} />
                          <Ionicons name="camera" size={22} color={Colors.white} />
                        </View>
                        <Text style={styles.imagePickerTitle}>Adicionar Foto</Text>
                        <Text style={styles.imagePickerSub}>Toque para escolher da galeria</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Dicas */}
                  <View style={styles.tipsRow}>
                    {['Obra concluída', 'Promoção', 'Novidade', 'Projeto'].map((tip) => (
                      <TouchableOpacity
                        key={tip}
                        style={styles.tipChip}
                        onPress={() => setCaption((c) => c ? `${c} #${tip}` : `#${tip}`)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.tipText}>#{tip}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4,8,15,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(76,201,240,0.12)',
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: 'hidden',
    maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center', marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBtn: { padding: 4 },
  cancelText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
  publishBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 72,
    alignItems: 'center',
  },
  publishBtnDisabled: {
    backgroundColor: 'rgba(76,201,240,0.25)',
  },
  publishBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.white,
  },

  // Autor
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  authorName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 3,
  },
  proBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  proBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: Colors.white,
    letterSpacing: 0.5,
  },

  // Caption
  captionInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.white,
    minHeight: 80,
    marginBottom: 6,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textFaded,
    textAlign: 'right',
    marginBottom: 16,
  },

  // Image
  imageArea: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(76,201,240,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
    marginBottom: 16,
  },
  imagePreview: { ...StyleSheet.absoluteFillObject as any },
  changePhotoOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(4,8,15,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  changePhotoText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.white,
  },
  imagePickerIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePickerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  imagePickerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textFaded,
  },

  // Tips
  tipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tipChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(123,97,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(123,97,255,0.25)',
  },
  tipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.purple,
  },
});
