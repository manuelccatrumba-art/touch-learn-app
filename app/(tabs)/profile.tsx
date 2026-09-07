import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../components/AppText';
import TextInput from '../../components/AppTextInput';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Application from 'expo-application';
import { Colors } from '../../constants/Colors';
import { FONT_SCALE_LABELS } from '../../constants/typography';
import { useFontScale } from '../../contexts/FontScaleContext';
import { hapticSelect } from '../../utils/haptics';
import { getProgress, resetAllData } from '../../services/storage';
import { resetPathProgress } from '../../services/pathProgress';
import { resetDailyChallenge } from '../../services/dailyChallenge';
import {
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  GOALS,
  getProfile,
  updateProfile,
  UserProfile,
} from '../../services/profile';
import { UserProgress } from '../../types';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [savedPulse, setSavedPulse] = useState(false);
  const fontScale = useFontScale();

  useFocusEffect(
    useCallback(() => {
      getProfile().then((p) => {
        setProfile(p);
        setNameDraft(p.displayName);
      });
      getProgress().then(setProgress);
    }, []),
  );

  if (!profile || !progress) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil</Text>
          <Text style={styles.headerSub}>Personaliza a tua experiência</Text>
        </View>

        {/* Avatar preview */}
        <View style={styles.avatarPreviewWrap}>
          <View style={[styles.avatarPreview, { backgroundColor: profile.avatarColor + '33', borderColor: profile.avatarColor }]}>
            <Text style={styles.avatarPreviewEmoji}>{profile.avatarEmoji}</Text>
          </View>
          <Text style={styles.avatarPreviewName}>
            {profile.displayName || 'Sem nome definido'}
          </Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>NÍVEL {progress.level} · {progress.xp} XP</Text>
          </View>
        </View>

        {/* Name */}
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

        {/* Avatar picker */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Escolhe o teu avatar</Text>
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

        {/* Color picker */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Cor do teu perfil</Text>
          <View style={styles.colorRow}>
            {AVATAR_COLORS.map((color) => {
              const active = color === profile.avatarColor;
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    active && styles.colorSwatchActive,
                  ]}
                  onPress={() => persist({ avatarColor: color })}
                />
              );
            })}
          </View>
        </View>

        {/* Goal */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Qual é o teu objetivo com o inglês?</Text>
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

        {/* Tamanho do texto */}
        <View style={styles.card}>
          <View style={styles.fontSizeHeaderRow}>
            <Text style={styles.cardLabel}>Tamanho do texto</Text>
            <Text style={styles.fontSizeStepLabel}>{FONT_SCALE_LABELS[fontScale.index]}</Text>
          </View>
          <View style={styles.fontSizeControlRow}>
            <TouchableOpacity
              style={[styles.fontSizeBtn, !fontScale.canDecrease && styles.fontSizeBtnDisabled]}
              onPress={() => { hapticSelect(); fontScale.decrease(); }}
              disabled={!fontScale.canDecrease}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.fontSizeBtnText, !fontScale.canDecrease && styles.fontSizeBtnTextDisabled]}>
                A-
              </Text>
            </TouchableOpacity>

            <View style={styles.fontSizePreviewBox}>
              <Text style={styles.fontSizePreviewText} numberOfLines={1} adjustsFontSizeToFit>
                Pronto para praticar hoje?
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.fontSizeBtn, !fontScale.canIncrease && styles.fontSizeBtnDisabled]}
              onPress={() => { hapticSelect(); fontScale.increase(); }}
              disabled={!fontScale.canIncrease}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.fontSizeBtnText, !fontScale.canIncrease && styles.fontSizeBtnTextDisabled]}>
                A+
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fontSizeDotsRow}>
            {FONT_SCALE_LABELS.map((_, i) => (
              <View key={i} style={[styles.fontSizeDot, i === fontScale.index && styles.fontSizeDotActive]} />
            ))}
          </View>
        </View>

        {/* Quick stats */}
        <Animated.View entering={FadeInUp.duration(250)} style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>🔥 {progress.currentStreak}</Text>
            <Text style={styles.statLabel}>Sequência</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{progress.flashcardsLearned}</Text>
            <Text style={styles.statLabel}>Palavras</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{progress.exercisesCompleted}</Text>
            <Text style={styles.statLabel}>Exercícios</Text>
          </View>
        </Animated.View>

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            Alert.alert(
              'Redefinir progresso',
              'Isto apaga todo o teu progresso, XP, conquistas, lições da Trilha e o desafio diário. O perfil (nome/avatar) mantém-se. Continuar?',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Redefinir',
                  style: 'destructive',
                  onPress: async () => {
                    await Promise.all([resetAllData(), resetPathProgress(), resetDailyChallenge()]);
                    const fresh = await getProgress();
                    setProgress(fresh);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40, gap: 16 },

  header: { marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  headerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },

  avatarPreviewWrap: { alignItems: 'center', marginBottom: 4 },
  avatarPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarPreviewEmoji: { fontSize: 44 },
  avatarPreviewName: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  levelPill: {
    marginTop: 8,
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  levelPillText: { color: Colors.gold, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: { color: Colors.text, fontWeight: '700', fontSize: 14, marginBottom: 12 },

  fontSizeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fontSizeStepLabel: { color: Colors.primaryLight, fontSize: 12, fontWeight: '700' },
  fontSizeControlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fontSizeBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnDisabled: { opacity: 0.35 },
  fontSizeBtnText: { color: Colors.text, fontWeight: '800', fontSize: 15 },
  fontSizeBtnTextDisabled: { color: Colors.textMuted },
  fontSizePreviewBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizePreviewText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  fontSizeDotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  fontSizeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border },
  fontSizeDotActive: { backgroundColor: Colors.primary, width: 16 },

  nameRow: { flexDirection: 'row', gap: 10 },
  nameInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  saveBtnText: { color: Colors.background, fontWeight: '700', fontSize: 13 },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  emojiCell: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 22 },

  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSwatchActive: { borderColor: Colors.text },

  goalList: { gap: 8 },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  goalRowActive: { backgroundColor: Colors.primaryDeep },
  goalEmoji: { fontSize: 18 },
  goalLabel: { flex: 1, color: Colors.textSecondary, fontSize: 14 },
  goalLabelActive: { color: Colors.text, fontWeight: '700' },
  goalCheck: { color: Colors.gold, fontWeight: '800' },

  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { color: Colors.text, fontSize: 17, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 4 },

  resetBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '55',
    borderRadius: 14,
    marginTop: 4,
  },
  resetText: { color: Colors.error, fontSize: 14 },
  versionText: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 4 },
  bottomPad: { height: 20 },
});
