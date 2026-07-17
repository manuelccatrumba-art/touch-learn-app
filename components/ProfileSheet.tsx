import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as Application from 'expo-application';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { getProgress, resetAllData } from '../services/storage';
import { getCompletedNodes } from '../services/pathProgress';
import { GRAMMAR_NOTES } from '../constants/grammarExercises';
import {
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  GOALS,
  getProfile,
  updateProfile,
  UserProfile,
} from '../services/profile';
import { CEFRLevel, UserProgress } from '../types';

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Nível CEFR estimado: o mais alto entre as notas de gramática já concluídas.
function estimateCEFRLevel(completedNoteIds: string[]): CEFRLevel | null {
  const levels = completedNoteIds
    .map((id) => GRAMMAR_NOTES.find((n) => n.id === id)?.level)
    .filter((l): l is CEFRLevel => !!l);
  if (levels.length === 0) return null;
  let best: CEFRLevel = 'A1';
  for (const lvl of CEFR_ORDER) {
    if (levels.includes(lvl)) best = lvl;
  }
  return best;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileSheet({ visible, onClose }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [savedPulse, setSavedPulse] = useState(false);
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!visible) return;
      getProfile().then((p) => {
        setProfile(p);
        setNameDraft(p.displayName);
      });
      getCompletedNodes().then((completed) => setCefrLevel(estimateCEFRLevel(completed)));
      getProgress().then(setProgress);
    }, [visible]),
  );

  async function persist(partial: Partial<UserProfile>) {
    const updated = await updateProfile(partial);
    setProfile(updated);
  }

  async function saveName() {
    const trimmed = nameDraft.trim();
    await persist({ displayName: trimmed });
    setSavedPulse(true);
    setTimeout(() => setSavedPulse(false), 1500);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {profile && progress && (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.avatarPreviewWrap}>
                <View style={[styles.avatarPreview, { backgroundColor: profile.avatarColor + '33', borderColor: profile.avatarColor }]}>
                  <Text style={styles.avatarPreviewEmoji}>{profile.avatarEmoji}</Text>
                </View>
                <Text style={styles.avatarPreviewName}>{profile.displayName || 'Sem nome definido'}</Text>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>NÍVEL {progress.level} · {progress.xp} XP</Text>
                </View>
                {cefrLevel && (
                  <View style={styles.cefrPill}>
                    <Ionicons name="checkmark-circle" size={11} color={Colors.success} />
                    <Text style={styles.cefrPillText}>Nível {cefrLevel} · CEFR</Text>
                  </View>
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Como te devemos chamar?</Text>
                <View style={styles.nameRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    placeholder="O teu nome"
                    placeholderTextColor={Colors.textMuted}
                    maxLength={24}
                    onSubmitEditing={saveName}
                    returnKeyType="done"
                  />
                  <TouchableOpacity style={styles.saveBtn} onPress={saveName}>
                    <Text style={styles.saveBtnText}>{savedPulse ? 'Guardado ✓' : 'Guardar'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Avatar</Text>
                <View style={styles.emojiGrid}>
                  {AVATAR_EMOJIS.map((emoji) => {
                    const active = emoji === profile.avatarEmoji;
                    return (
                      <TouchableOpacity
                        key={emoji}
                        style={[styles.emojiCell, active && { backgroundColor: profile.avatarColor + '33', borderColor: profile.avatarColor }]}
                        onPress={() => persist({ avatarEmoji: emoji })}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Cor</Text>
                <View style={styles.colorRow}>
                  {AVATAR_COLORS.map((color) => {
                    const active = color === profile.avatarColor;
                    return (
                      <TouchableOpacity
                        key={color}
                        style={[styles.colorSwatch, { backgroundColor: color }, active && styles.colorSwatchActive]}
                        onPress={() => persist({ avatarColor: color })}
                      />
                    );
                  })}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Objetivo</Text>
                <View style={styles.goalList}>
                  {GOALS.map((goal) => {
                    const active = goal.id === profile.goal;
                    return (
                      <TouchableOpacity
                        key={goal.id}
                        style={[styles.goalRow, active && styles.goalRowActive]}
                        onPress={() => persist({ goal: goal.id })}
                      >
                        <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                        <Text style={[styles.goalLabel, active && styles.goalLabelActive]}>{goal.label}</Text>
                        {active && <Text style={styles.goalCheck}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  Alert.alert(
                    'Redefinir progresso',
                    'Isto apaga todo o teu progresso, XP e conquistas. O perfil mantém-se. Continuar?',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Redefinir',
                        style: 'destructive',
                        onPress: async () => {
                          await resetAllData();
                          setProgress(await getProgress());
                        },
                      },
                    ],
                  );
                }}
              >
                <Text style={styles.resetText}>Redefinir progresso</Text>
              </TouchableOpacity>

              <Text style={styles.versionText}>
                Touch Learn v{Application.nativeApplicationVersion} (build {Application.nativeBuildVersion})
              </Text>
              <View style={styles.bottomPad} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(13,18,36,0.6)', justifyContent: 'flex-end' },
  backdropTouch: { flex: 1 },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 10,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 6 },
  content: { padding: 20, paddingTop: 6, gap: 16 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: Colors.text, fontSize: 22, fontWeight: '800' },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center',
  },

  avatarPreviewWrap: { alignItems: 'center', marginBottom: 4 },
  avatarPreview: {
    width: 84, height: 84, borderRadius: 42, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  avatarPreviewEmoji: { fontSize: 38 },
  avatarPreviewName: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  levelPill: { marginTop: 6, backgroundColor: Colors.primaryDeep, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  levelPillText: { color: Colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  cefrPill: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  cefrPillText: { color: Colors.success, fontSize: 10, fontWeight: '700' },

  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 14 },
  cardLabel: { color: Colors.text, fontWeight: '700', fontSize: 13, marginBottom: 10 },

  nameRow: { flexDirection: 'row', gap: 8 },
  nameInput: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, color: Colors.text, fontSize: 14 },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  saveBtnText: { color: Colors.background, fontWeight: '700', fontSize: 12 },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiCell: { width: 42, height: 42, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 20 },

  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorSwatch: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: 'transparent' },
  colorSwatchActive: { borderColor: Colors.text },

  goalList: { gap: 6 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  goalRowActive: { backgroundColor: Colors.primaryDeep },
  goalEmoji: { fontSize: 16 },
  goalLabel: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  goalLabelActive: { color: Colors.text, fontWeight: '700' },
  goalCheck: { color: Colors.gold, fontWeight: '800' },

  resetBtn: { paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '55', borderRadius: 12 },
  resetText: { color: Colors.error, fontSize: 13 },
  versionText: { color: Colors.textMuted, fontSize: 10, textAlign: 'center' },
  bottomPad: { height: 10 },
});
