import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { LEARNING_PATH, LEARNING_MODULES, LearningModule, PathNode } from '../../constants/path';
import { GRAMMAR_NOTES } from '../../constants/grammarExercises';
import { getCompletedNodes } from '../../services/pathProgress';
import { getProgress, getFlashcards, addXP } from '../../services/storage';
import { getDueCount } from '../../utils/spacedRepetition';
import { getProfile, UserProfile } from '../../services/profile';
import { getWeeklyLeaderboard, LeaderboardEntry } from '../../services/leaderboard';
import { CULTURE_NUGGETS } from '../../constants/culture';
import { CEFRLevel, UserProgress } from '../../types';
import { useAnimatedNumber } from '../../components/AnimatedNumber';
import HeroIllustration from '../../components/HeroIllustration';
import ParticleBurst from '../../components/ParticleBurst';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CEFR_TITLE: Record<CEFRLevel, string> = {
  A1: 'Iniciante', A2: 'Elementar', B1: 'Intermédio', B2: 'Intermédio-Alto', C1: 'Avançado', C2: 'Proficiente',
};

function estimateCEFRLevel(completedNoteIds: string[]): CEFRLevel {
  const levels = completedNoteIds
    .map((id) => GRAMMAR_NOTES.find((n) => n.id === id)?.level)
    .filter((l): l is CEFRLevel => !!l);
  let best: CEFRLevel = 'A1';
  for (const lvl of CEFR_ORDER) {
    if (levels.includes(lvl)) best = lvl;
  }
  return best;
}

const MODULE_GRADIENTS: readonly (readonly [string, string])[] = [
  [Colors.purple, Colors.primary],
  [Colors.teal, Colors.tealDark],
  [Colors.orange, Colors.coral],
  [Colors.primary, Colors.purple],
];

const MOTIVATIONAL_QUOTES = [
  '"O sucesso é a soma de pequenos esforços repetidos todos os dias."',
  '"Cada palavra nova é uma porta que se abre."',
  '"A fluência não é um destino, é um hábito."',
  '"Não pares agora — estás mais perto do que pensas."',
];

function normalizeAnswer(s: string) {
  return s.trim().toLowerCase().replace(/[.?!,]/g, '');
}

type PathNodeState = PathNode & { __done: boolean; __current: boolean };
type LearningModuleState = { id: string; title: string; icon: string; nodes: PathNodeState[] };

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 19) return 'Boa tarde';
  return 'Boa noite';
}

const CATEGORIES: { id: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string; route?: string; comingSoon?: boolean }[] = [
  { id: 'vocab', label: 'Vocabulário', icon: 'albums', color: Colors.gold, route: '/vocabulary' },
  { id: 'conversation', label: 'Conversação', icon: 'chatbubbles', color: Colors.primary, route: '/chat' },
  { id: 'grammar', label: 'Gramática', icon: 'help-circle', color: Colors.purple, route: '/grammar' },
  { id: 'pronunciation', label: 'Pronúncia', icon: 'mic', color: Colors.teal, route: '/culture' },
  { id: 'listening', label: 'Listening', icon: 'headset', color: Colors.coral, comingSoon: true },
];

export default function TrailScreen() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteIdx] = useState(() => dayOfYear() % MOTIVATIONAL_QUOTES.length);

  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [burst, setBurst] = useState(0);

  const heroScale = useSharedValue(1);
  const heroAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: heroScale.value }] }));

  const flameScale = useSharedValue(1);
  const flameRotate = useSharedValue(0);
  const badgeGlow = useSharedValue(0);
  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }, { rotate: `${flameRotate.value}deg` }],
  }));
  const badgeGlowStyle = useAnimatedStyle(() => ({ opacity: badgeGlow.value }));

  function bounceStreak() {
    flameScale.value = withSequence(
      withSpring(1.6, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );
    flameRotate.value = withSequence(
      withTiming(-14, { duration: 90 }),
      withTiming(14, { duration: 140 }),
      withTiming(0, { duration: 140 }),
    );
    badgeGlow.value = withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 500 }));
  }

  async function loadAll() {
    await Promise.all([
      getCompletedNodes().then(setCompleted),
      getProgress().then(setProgress),
      getProfile().then(setProfile),
      getFlashcards().then((cards) => setDueCount(getDueCount(cards))),
      getWeeklyLeaderboard().then(setLeaderboard),
    ]);
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadAll();
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

  const completedCount = nodesWithState.filter((n) => n.__done).length;
  const overallPct = LEARNING_PATH.length > 0 ? completedCount / LEARNING_PATH.length : 0;
  const cefrLevel = estimateCEFRLevel(completed);

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

  const streak = progress?.currentStreak ?? 0;
  const dailyNugget = CULTURE_NUGGETS[dayOfYear() % CULTURE_NUGGETS.length];
  const animatedXP = useAnimatedNumber({ value: progress?.xp ?? 0 });
  const notificationCount = dueCount > 0 ? Math.min(dueCount, 9) : 0;

  function checkChallenge() {
    const isRight =
      normalizeAnswer(answer) === normalizeAnswer(dailyNugget.phrase) ||
      normalizeAnswer(dailyNugget.phrase).includes(normalizeAnswer(answer)) && answer.trim().length > 3;
    setChecked(true);
    setCorrect(isRight);
    if (isRight) {
      addXP(10);
      setBurst((b) => b + 1);
    }
  }

  function resetChallenge() {
    setAnswer('');
    setChecked(false);
    setCorrect(false);
  }

  const myRank = leaderboard.findIndex((e) => e.isCurrentUser) + 1;

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} colors={[Colors.primary]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {greeting()}{profile?.displayName ? `, ${profile.displayName}` : ''}! 👋
            </Text>
            <Text style={styles.greetingSub}>Pronto para praticar hoje?</Text>
          </View>
          <View style={styles.headerBadges}>
            <Pressable onPress={bounceStreak}>
              <View style={styles.pill}>
                <Reanimated.View style={[styles.streakGlow, badgeGlowStyle]} />
                <Reanimated.View style={flameAnimatedStyle}>
                  <Text style={styles.pillEmoji}>🔥</Text>
                </Reanimated.View>
                <Text style={styles.pillText}>{streak}</Text>
              </View>
            </Pressable>
            <View style={styles.pill}>
              <Text style={styles.pillEmoji}>💎</Text>
              <Text style={styles.pillText}>{animatedXP}</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={18} color={Colors.textSecondary} />
              {notificationCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero de progresso */}
        <LinearGradient colors={Colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={[styles.heroDecorCircle, styles.heroDecorCircleA]} />
          <View style={styles.heroRow}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>SEU PROGRESSO</Text>
              <Text style={styles.heroPct}>{Math.round(overallPct * 100)}%</Text>
              <View style={styles.heroLevelPill}>
                <Text style={styles.heroLevelText}>{CEFR_TITLE[cefrLevel]} {cefrLevel}</Text>
              </View>
              <View style={styles.heroProgressTrack}>
                <LinearGradient
                  colors={Colors.gradientProgress}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.heroProgressFill, { width: `${Math.round(Math.min(1, Math.max(0, overallPct)) * 100)}%` }]}
                />
              </View>
              <TouchableOpacity style={styles.heroDetailsBtn} onPress={() => router.push('/licoes')}>
                <Text style={styles.heroDetailsText}>Ver detalhes →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroRight}>
              <HeroIllustration size={92} />
              <View style={styles.speechBubble}>
                <Text style={styles.speechBubbleText}>Great job! Keep going! 🚀</Text>
              </View>
            </View>
          </View>
          <Text style={styles.heroQuote}>{MOTIVATIONAL_QUOTES[quoteIdx]}</Text>
        </LinearGradient>

        {/* Continue aprendendo */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Continue aprendendo</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 4 }}>
          {modulesWithState.map((mod, i) => {
            const done = mod.nodes.filter((n) => n.__done).length;
            const total = mod.nodes.length;
            const pct = total > 0 ? done / total : 0;
            const gradient = MODULE_GRADIENTS[i % MODULE_GRADIENTS.length];
            return (
              <Pressable
                key={mod.id}
                style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}
                onPress={() => openModule(mod)}
              >
                <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.lessonCard}>
                  <View style={styles.lessonTopRow}>
                    <Text style={styles.lessonNumber}>{String(i + 1).padStart(2, '0')}</Text>
                    <Text style={styles.lessonEmoji}>{mod.icon}</Text>
                  </View>
                  <Text style={styles.lessonTitle} numberOfLines={2}>{mod.title}</Text>
                  <View style={styles.lessonBottomRow}>
                    <View style={styles.lessonProgressWrap}>
                      <View style={styles.lessonProgressTrack}>
                        <View style={[styles.lessonProgressFill, { width: `${Math.round(pct * 100)}%` }]} />
                      </View>
                      <Text style={styles.lessonPct}>{Math.round(pct * 100)}%</Text>
                    </View>
                    <View style={styles.lessonPlayBtn}>
                      <Ionicons name="play" size={14} color={Colors.text} />
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Pratique por categoria */}
        <View style={[styles.sectionHeaderRow, { marginTop: 28 }]}>
          <Text style={styles.sectionHeader}>Pratique por categoria</Text>
        </View>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              activeOpacity={0.8}
              onPress={() => {
                if (cat.comingSoon) return;
                if (cat.id === 'pronunciation') {
                  router.push('/culture');
                } else if (cat.route) {
                  router.push(cat.route as any);
                }
              }}
            >
              <View style={[styles.categoryBadge, { backgroundColor: cat.color + '22' }]}>
                <Ionicons name={cat.icon} size={22} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              {cat.comingSoon && <Text style={styles.categorySoon}>Em breve</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Desafio diário + Ranking */}
        <View style={styles.bottomRow}>
          <View style={styles.challengeCard}>
            <ParticleBurst trigger={burst} />
            <View style={styles.challengeHeader}>
              <Text style={styles.cardTitle}>Desafio diário</Text>
              <Text style={styles.giftIcon}>🎁</Text>
            </View>
            <Text style={styles.challengePrompt} numberOfLines={2}>{dailyNugget.translation}</Text>
            {!checked ? (
              <>
                <TextInput
                  style={styles.challengeInput}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Traduz para inglês..."
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity style={styles.challengeBtn} onPress={checkChallenge} disabled={!answer.trim()}>
                  <Text style={styles.challengeBtnText}>Verificar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <Text style={[styles.challengeResult, { color: correct ? Colors.success : Colors.coral }]}>
                  {correct ? '✓ Certo! +10 XP' : `✗ Era: "${dailyNugget.phrase}"`}
                </Text>
                <TouchableOpacity style={styles.challengeBtn} onPress={resetChallenge}>
                  <Text style={styles.challengeBtnText}>Tentar outra vez</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.rankCard}>
            <Text style={styles.cardTitle}>Ranking semanal</Text>
            {leaderboard.slice(0, 3).map((entry, i) => (
              <View key={entry.id} style={[styles.rankRow, entry.isCurrentUser && styles.rankRowMe]}>
                <Text style={styles.rankMedal}>{['🥇', '🥈', '🥉'][i]}</Text>
                <View style={[styles.rankAvatar, { backgroundColor: entry.avatarColor + '33' }]}>
                  <Text style={styles.rankAvatarEmoji}>{entry.avatarEmoji}</Text>
                </View>
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName} numberOfLines={1}>{entry.isCurrentUser ? 'Tu' : entry.name}</Text>
                  <Text style={styles.rankXp}>{entry.xp} XP</Text>
                </View>
              </View>
            ))}
            {myRank > 3 && (
              <Text style={styles.rankMyPosition}>A tua posição: #{myRank}</Text>
            )}
            <TouchableOpacity style={styles.rankFullBtn} onPress={() => router.push('/desafios')}>
              <Text style={styles.rankFullBtnText}>Ver ranking completo →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { color: Colors.text, fontSize: 20, fontWeight: '700' },
  greetingSub: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },

  headerBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.card, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20,
    position: 'relative',
  },
  pillEmoji: { fontSize: 13 },
  pillText: { color: Colors.text, fontWeight: '700', fontSize: 13 },
  streakGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.orange, borderRadius: 20,
  },
  bellBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.card,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  bellBadge: {
    position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.coral, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  bellBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '800' },

  hero: {
    borderRadius: 22, padding: 20, marginTop: 20, marginBottom: 26, overflow: 'hidden',
    shadowColor: Colors.purple, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  heroDecorCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
  heroDecorCircleA: { width: 200, height: 200, top: -80, right: -60 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLeft: { flex: 1, gap: 6 },
  heroLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroPct: { color: Colors.text, fontSize: 40, fontWeight: '800' },
  heroLevelPill: { backgroundColor: 'rgba(255,255,255,0.12)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 2 },
  heroLevelText: { color: Colors.text, fontSize: 11, fontWeight: '700' },
  heroProgressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden', marginTop: 10, width: 150 },
  heroProgressFill: { height: '100%', borderRadius: 4 },
  heroDetailsBtn: { marginTop: 10 },
  heroDetailsText: { color: Colors.primaryLight, fontSize: 12, fontWeight: '700' },
  heroRight: { alignItems: 'center', width: 110 },
  speechBubble: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, marginTop: 6 },
  speechBubbleText: { color: Colors.text, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  heroQuote: { color: Colors.textSecondary, fontSize: 11, fontStyle: 'italic', marginTop: 16 },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeader: { color: Colors.text, fontSize: 16, fontWeight: '700' },

  lessonCard: { width: 160, borderRadius: 18, padding: 16, height: 140, justifyContent: 'space-between' },
  lessonTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonNumber: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '800' },
  lessonEmoji: { fontSize: 20 },
  lessonTitle: { color: Colors.white, fontSize: 14, fontWeight: '700', marginTop: 6 },
  lessonBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lessonProgressWrap: { flex: 1, gap: 3 },
  lessonProgressTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  lessonProgressFill: { height: '100%', backgroundColor: Colors.white, borderRadius: 2 },
  lessonPct: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '700' },
  lessonPlayBtn: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  categoryItem: { width: '18%', alignItems: 'center', gap: 6, minWidth: 60 },
  categoryBadge: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  categorySoon: { color: Colors.textMuted, fontSize: 8, fontWeight: '700' },

  bottomRow: { flexDirection: 'row', gap: 12, marginTop: 28 },
  cardTitle: { color: Colors.text, fontSize: 13, fontWeight: '700' },

  challengeCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 18, padding: 14, position: 'relative' },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  giftIcon: { fontSize: 16 },
  challengePrompt: { color: Colors.textSecondary, fontSize: 12, marginBottom: 10, minHeight: 32 },
  challengeInput: {
    backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    color: Colors.text, fontSize: 12, marginBottom: 8,
  },
  challengeBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
  challengeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
  challengeResult: { fontSize: 11, fontWeight: '700', marginBottom: 8 },

  rankCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 18, padding: 14 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, borderRadius: 10, padding: 4 },
  rankRowMe: { backgroundColor: Colors.primary + '1a' },
  rankMedal: { fontSize: 13 },
  rankAvatar: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  rankAvatarEmoji: { fontSize: 11 },
  rankInfo: { flex: 1 },
  rankName: { color: Colors.text, fontSize: 11, fontWeight: '700' },
  rankXp: { color: Colors.textMuted, fontSize: 9 },
  rankMyPosition: { color: Colors.textMuted, fontSize: 10, marginTop: 8 },
  rankFullBtn: { marginTop: 10 },
  rankFullBtnText: { color: Colors.primaryLight, fontSize: 11, fontWeight: '700' },
});
