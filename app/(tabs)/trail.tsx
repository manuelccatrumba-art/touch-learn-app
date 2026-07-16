import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { LEARNING_PATH, LEARNING_MODULES, LearningModule, PathNode } from '../../constants/path';
import { getCompletedNodes } from '../../services/pathProgress';
import { getProgress, getFlashcards } from '../../services/storage';
import { getDueCount } from '../../utils/spacedRepetition';
import { getProfile, UserProfile } from '../../services/profile';
import { CULTURE_NUGGETS } from '../../constants/culture';
import { UserProgress } from '../../types';
import TutorFAB from '../../components/TutorFAB';
import CircularProgress from '../../components/CircularProgress';
import { useAnimatedNumber } from '../../components/AnimatedNumber';

const ACHIEVEMENTS: Record<string, { title: string; emoji: string; desc: string }> = {
  first_message: { title: 'Primeira Mensagem', emoji: '💬', desc: 'Enviou a primeira mensagem para o tutor' },
  chatterbox: { title: 'Comunicativo', emoji: '🗣️', desc: '50 mensagens enviadas' },
  fluent_speaker: { title: 'Fluente', emoji: '🌟', desc: '200 mensagens enviadas' },
  grammar_student: { title: 'Estudante', emoji: '📚', desc: '10 exercícios completados' },
  grammar_master: { title: 'Mestre da Gramática', emoji: '🎓', desc: '50 exercícios completados' },
  vocabulary_builder: { title: 'Construtor de Vocabulário', emoji: '🔤', desc: '20 flashcards revisados' },
  word_collector: { title: 'Colecionador de Palavras', emoji: '📖', desc: '50 flashcards aprendidos' },
  week_warrior: { title: 'Guerreiro Semanal', emoji: '🔥', desc: '7 dias seguidos de estudo' },
  monthly_champion: { title: 'Campeão Mensal', emoji: '🏆', desc: '30 dias seguidos de estudo' },
  dedicated_learner: { title: 'Dedicado', emoji: '⭐', desc: '500 XP acumulados' },
};

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const { width } = Dimensions.get('window');
const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const WEEKLY_GOAL = 50;

type PathNodeState = PathNode & { __done: boolean; __current: boolean };
type LearningModuleState = { id: string; title: string; icon: string; nodes: PathNodeState[] };

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 19) return 'Boa tarde';
  return 'Boa noite';
}

function StreakTrail({ days }: { days: number }) {
  const dots = Array.from({ length: 7 }, (_, i) => i < days);
  return (
    <View style={styles.streakRow}>
      {dots.map((lit, i) => (
        <View key={i} style={[styles.streakDot, lit ? styles.streakDotLit : styles.streakDotDim]} />
      ))}
    </View>
  );
}

function ProgressBar({ value, color = Colors.primary, trackColor = Colors.border }: { value: number; color?: string; trackColor?: string }) {
  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

function ModuleCard({ mod, color, onPress }: { mod: LearningModuleState; color: string; onPress: () => void }) {
  const done = mod.nodes.filter((n) => n.__done).length;
  const total = mod.nodes.length;
  const pct = total > 0 ? done / total : 0;
  const complete = done === total;
  return (
    <Pressable style={({ pressed }) => [styles.moduleCard, pressed && styles.moduleCardPressed]} onPress={onPress}>
      <View style={[styles.moduleBadge, { backgroundColor: color + '22' }]}>
        <Ionicons name={complete ? 'checkmark-circle' : 'book-outline'} size={18} color={color} />
      </View>
      <Text style={styles.moduleTitle}>{mod.title}</Text>
      <Text style={styles.moduleCount}>{done}/{total} lições</Text>
      <ProgressBar value={pct} color={color} />
    </Pressable>
  );
}

function StatBox({ value, label, color = Colors.primary }: { value: string | number; label: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function WeekChart({ data, todayIdx }: { data: number[]; todayIdx: number }) {
  const max = Math.max(...data, 1);
  return (
    <View style={styles.weekRow}>
      {data.map((val, i) => {
        const h = Math.max(6, (val / max) * 64);
        const isToday = i === todayIdx;
        return (
          <View key={i} style={styles.weekCol}>
            <View style={[styles.weekBar, { height: h, backgroundColor: isToday ? Colors.primary : Colors.card }]} />
            <Text style={[styles.weekLabel, isToday && { color: Colors.primary }]}>{DAYS[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function TrailScreen() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [dueCount, setDueCount] = useState(0);
  const heroScale = useSharedValue(1);
  const heroAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: heroScale.value }] }));

  useFocusEffect(
    useCallback(() => {
      getCompletedNodes().then(setCompleted);
      getProgress().then(setProgress);
      getProfile().then(setProfile);
      getFlashcards().then((cards) => setDueCount(getDueCount(cards)));
    }, []),
  );

  const nodesWithState = useMemo(() => {
    let currentAssigned = false;
    return LEARNING_PATH.map((node) => {
      const done = completed.includes(node.id);
      const isCurrent = !done && !currentAssigned;
      if (isCurrent) currentAssigned = true;
      return { ...node, __done: done, __current: isCurrent && !done };
    });
  }, [completed]);

  const currentNode = nodesWithState.find((n) => n.__current) ?? null;
  const completedCount = nodesWithState.filter((n) => n.__done).length;
  const overallPct = LEARNING_PATH.length > 0 ? completedCount / LEARNING_PATH.length : 0;

  function openNode(node: PathNode) {
    if (node.type === 'grammar') {
      router.push({ pathname: '/grammar', params: { noteId: node.refId, autostart: '1' } });
    } else {
      router.push({ pathname: '/vocabulary', params: { category: node.refId, autostart: '1' } });
    }
  }

  function openModule(mod: LearningModule) {
    const withState = mod.nodes.map((n) => nodesWithState.find((s) => s.id === n.id)!);
    const next = withState.find((n) => !n.__done) ?? withState[0];
    if (next) openNode(next);
  }

  const modulesWithState = useMemo(
    () => LEARNING_MODULES.map((mod) => ({
      ...mod,
      nodes: mod.nodes.map((n) => nodesWithState.find((s) => s.id === n.id)!),
    })),
    [nodesWithState],
  );

  function moduleColor(mod: LearningModuleState): string {
    if (mod.nodes.every((n) => n.__done)) return Colors.success;
    if (mod.nodes.some((n) => n.__current)) return Colors.primary;
    return Colors.secondary;
  }

  const weeklyActivity = progress?.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0];
  const weekTotal = weeklyActivity.reduce((a, b) => a + b, 0);
  const todayIdx = new Date().getDay();
  const streak = progress?.currentStreak ?? 0;

  const dailyNugget = CULTURE_NUGGETS[dayOfYear() % CULTURE_NUGGETS.length];

  const animatedXP = useAnimatedNumber({ value: progress?.xp ?? 0 });
  const level = progress?.level ?? 1;
  const xpForLevel = 100;
  const currentLevelXP = animatedXP % xpForLevel;
  const levelPct = (currentLevelXP / xpForLevel) * 100;
  const accuracy =
    progress && progress.exercisesCompleted > 0
      ? Math.round((progress.exercisesCorrect / progress.exercisesCompleted) * 100)
      : 0;

  return (
    <View style={styles.flex}>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {profile?.avatarEmoji && (
            <View style={[styles.headerAvatar, { backgroundColor: (profile.avatarColor ?? Colors.primary) + '33', borderColor: profile.avatarColor ?? Colors.primary }]}>
              <Text style={styles.headerAvatarEmoji}>{profile.avatarEmoji}</Text>
            </View>
          )}
          <View>
            <Text style={styles.greeting}>
              {greeting()}{profile?.displayName ? `, ${profile.displayName}` : ''}
            </Text>
            <Text style={styles.greetingSub}>Pronto para praticar hoje?</Text>
          </View>
        </View>
        <View style={styles.headerBadges}>
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={14} color={Colors.gold} />
            <Text style={styles.xpNumber}>{animatedXP}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={Colors.primary} />
            <Text style={styles.streakNumber}>{streak}</Text>
          </View>
        </View>
      </View>

      <StreakTrail days={streak} />

      {currentNode ? (
        <Pressable
          onPress={() => openNode(currentNode)}
          onPressIn={() => { heroScale.value = withSpring(0.97); }}
          onPressOut={() => { heroScale.value = withSpring(1); }}
        >
          <Reanimated.View style={heroAnimatedStyle}>
          <LinearGradient
            colors={Colors.gradientHero}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.4, y: 1 }}
            style={styles.hero}
          >
            <View style={[styles.heroDecorCircle, styles.heroDecorCircleA]} />
            <View style={[styles.heroDecorCircle, styles.heroDecorCircleB]} />

            <View style={styles.heroTopRow}>
              <View style={styles.heroIconBadge}>
                <Ionicons
                  name={currentNode.type === 'grammar' ? 'help-circle' : 'book'}
                  size={20}
                  color={Colors.background}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroEyebrow}>CONTINUAR</Text>
                <Text style={styles.heroTitle}>{currentNode.title}</Text>
              </View>
            </View>
            <Text style={styles.heroSubtitle}>
              {currentNode.type === 'grammar' ? 'Exercício de gramática' : 'Revisão de vocabulário'}
            </Text>
            <View style={styles.heroProgressTrack}>
              <View
                style={[styles.heroProgressFill, { width: `${Math.round(Math.min(1, Math.max(0, overallPct)) * 100)}%` }]}
              />
            </View>
            <View style={styles.heroFooter}>
              <Text style={styles.heroPercent}>{Math.round(overallPct * 100)}% da trilha concluída</Text>
              <View style={styles.heroCta}>
                <Text style={styles.heroCtaText}>Continuar</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primaryLight} />
              </View>
            </View>
          </LinearGradient>
          </Reanimated.View>
        </Pressable>
      ) : (
        <LinearGradient colors={Colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 0.4, y: 1 }} style={styles.hero}>
          <Text style={styles.heroEyebrow}>PARABÉNS</Text>
          <Text style={styles.heroTitle}>🏆 Trilha completa!</Text>
          <Text style={styles.heroSubtitle}>Voltaste a praticar qualquer lição a partir dos separadores.</Text>
        </LinearGradient>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Os teus módulos</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {modulesWithState.map((mod) => (
          <ModuleCard key={mod.id} mod={mod} color={moduleColor(mod)} onPress={() => openModule(mod)} />
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.dailyCard, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push('/culture')}
      >
        <View style={styles.dailyIconBadge}>
          <Ionicons name="book" size={16} color={Colors.background} />
        </View>
        <Text style={styles.dailyPhrase} numberOfLines={1}>{dailyNugget.phrase}</Text>
        <Pressable
          style={({ pressed }) => [styles.dailyPracticeBtn, pressed && { opacity: 0.8 }]}
          onPress={() =>
            router.push({
              pathname: '/chat',
              params: { seedPhrase: dailyNugget.phrase, seedTranslation: dailyNugget.translation },
            })
          }
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chatbubble-ellipses" size={16} color={Colors.primary} />
        </Pressable>
      </Pressable>

      <View style={styles.miniStatsRow}>
        <View style={styles.miniStatCard}>
          <Ionicons name="calendar" size={16} color={Colors.success} />
          <Text style={styles.miniStatValue}>{weekTotal}/{WEEKLY_GOAL}</Text>
          <Text style={styles.miniStatLabel}>esta semana</Text>
        </View>
        <Pressable style={styles.miniStatCard} onPress={() => router.push('/library')}>
          <Ionicons name="albums" size={16} color={Colors.error} />
          <Text style={styles.miniStatValue}>{dueCount}</Text>
          <Text style={styles.miniStatLabel}>a rever hoje</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.expandToggle} onPress={() => setStatsExpanded((v) => !v)} activeOpacity={0.7}>
        <Text style={styles.expandToggleText}>
          {statsExpanded ? 'Ocultar estatísticas ▲' : 'Ver estatísticas completas ▾'}
        </Text>
      </TouchableOpacity>

      {statsExpanded && progress && (
        <Reanimated.View entering={FadeInUp.duration(250)}>
          <View style={styles.weekCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Esta semana</Text>
              <Text style={styles.weekMinutes}>
                {weekTotal}<Text style={styles.weekMinutesMuted}> / {WEEKLY_GOAL} atividades</Text>
              </Text>
            </View>
            <WeekChart data={weeklyActivity} todayIdx={todayIdx} />
            <ProgressBar value={weekTotal / WEEKLY_GOAL} color={Colors.success} />
          </View>

          <View style={styles.levelBox}>
            <View style={styles.levelTopRow}>
              <CircularProgress
                size={90}
                strokeWidth={8}
                progress={levelPct}
                label={`${Math.round(levelPct)}%`}
                sublabel="de 100 XP"
              />
              <View style={styles.levelInfo}>
                <View style={styles.levelBadgeWrap}>
                  <Text style={styles.levelBadge}>NÍVEL {level}</Text>
                </View>
                <Text style={styles.levelXP}>{currentLevelXP} / {xpForLevel} XP</Text>
                <Text style={styles.levelNext}>{xpForLevel - currentLevelXP} XP para o próximo nível</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatBox value={progress.totalMessages} label="Mensagens" />
            <StatBox value={progress.exercisesCompleted} label="Exercícios" />
            <StatBox value={`${accuracy}%`} label="Precisão" />
            <StatBox value={progress.flashcardsReviewed} label="Revisados" />
            <StatBox value={progress.flashcardsLearned} label="Aprendidos" />
            <StatBox value={progress.longestStreak} label="Recorde streak" color={Colors.gold} />
          </View>

          <Text style={styles.sectionHeader}>
            Conquistas ({progress.achievements.length}/{Object.keys(ACHIEVEMENTS).length})
          </Text>
          <View style={styles.achievementGrid}>
            {Object.entries(ACHIEVEMENTS).map(([id, ach], idx) => {
              const unlocked = progress.achievements.includes(id);
              return (
                <Reanimated.View
                  key={id}
                  entering={FadeInUp.delay(idx * 40).duration(300)}
                  style={[
                    styles.achievementCard,
                    unlocked && styles.achievementUnlocked,
                    !unlocked && styles.achievementLocked,
                  ]}
                >
                  <Text style={[styles.achievementEmoji, !unlocked && styles.lockedEmoji]}>
                    {unlocked ? ach.emoji : '🔒'}
                  </Text>
                  <Text style={[styles.achievementTitle, !unlocked && styles.lockedText]}>
                    {ach.title}
                  </Text>
                  {unlocked && <Text style={styles.achievementDesc}>{ach.desc}</Text>}
                </Reanimated.View>
              );
            })}
          </View>
        </Reanimated.View>
      )}
    </ScrollView>
    <TutorFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarEmoji: { fontSize: 19 },
  greeting: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  greetingSub: { color: Colors.textMuted, fontSize: 14, marginTop: 2 },

  headerBadges: { flexDirection: 'row', gap: 8 },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  xpNumber: { color: Colors.gold, fontWeight: '700', fontSize: 14 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  streakNumber: { color: Colors.primary, fontWeight: '700', fontSize: 14 },

  streakRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 22 },
  streakDot: { width: (width - 40 - 6 * 8) / 7, height: 6, borderRadius: 3 },
  streakDotLit: { backgroundColor: Colors.primary },
  streakDotDim: { backgroundColor: Colors.card },

  hero: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  heroDecorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroDecorCircleA: { width: 140, height: 140, top: -50, right: -40 },
  heroDecorCircleB: { width: 90, height: 90, bottom: -30, left: -20, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: { color: '#3a2405', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, opacity: 0.75 },
  heroTitle: { color: '#3a2405', fontSize: 19, fontWeight: '800', marginTop: 3 },
  heroSubtitle: { color: '#3a2405', fontSize: 13, marginTop: 10, opacity: 0.8 },
  heroProgressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.18)',
    overflow: 'hidden',
    marginTop: 14,
  },
  heroProgressFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.background },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  heroPercent: { color: '#3a2405', fontSize: 12, opacity: 0.8, fontWeight: '600' },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  heroCtaText: { color: Colors.primaryLight, fontWeight: '800', fontSize: 13 },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeader: { color: Colors.text, fontSize: 16, fontWeight: '700' },

  moduleCard: {
    width: 150,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
  },
  moduleCardPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  moduleBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moduleTitle: { color: Colors.text, fontSize: 13, fontWeight: '600', marginBottom: 4 },
  moduleCount: { color: Colors.textMuted, fontSize: 11, marginBottom: 8 },

  track: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },

  dailyCard: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  dailyIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyPhrase: { flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' },
  dailyPracticeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekCard: {
    marginTop: 28,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  weekMinutes: { color: Colors.success, fontWeight: '700', fontSize: 14 },
  weekMinutesMuted: { color: Colors.textMuted, fontWeight: '400' },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 64,
    marginBottom: 12,
    marginTop: 6,
  },
  weekCol: { alignItems: 'center', flex: 1 },
  weekBar: { width: 10, borderRadius: 4 },
  weekLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 6 },

  miniStatsRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  miniStatCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 3,
  },
  miniStatValue: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  miniStatLabel: { color: Colors.textMuted, fontSize: 11 },

  expandToggle: { alignItems: 'center', marginTop: 20, paddingVertical: 8 },
  expandToggleText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },

  levelBox: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  levelTopRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  levelInfo: { flex: 1, gap: 6 },
  levelBadgeWrap: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelBadge: { color: Colors.gold, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  levelXP: { color: Colors.textSecondary, fontSize: 14 },
  levelNext: { color: Colors.primary, fontSize: 12, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  statBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },

  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
  achievementCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  achievementUnlocked: {
    borderColor: Colors.primary + '55',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  achievementLocked: { opacity: 0.35 },
  achievementEmoji: { fontSize: 30, marginBottom: 6 },
  lockedEmoji: { fontSize: 22 },
  achievementTitle: { color: Colors.text, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  lockedText: { color: Colors.textMuted },
  achievementDesc: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 3, lineHeight: 14 },
});
