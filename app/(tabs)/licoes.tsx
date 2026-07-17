import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Reanimated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { LEARNING_PATH, LEARNING_MODULES, LearningModule, PathNode } from '../../constants/path';
import { getCompletedNodes } from '../../services/pathProgress';
import { getProgress } from '../../services/storage';
import { UserProgress } from '../../types';
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

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const WEEKLY_GOAL = 50;

type PathNodeState = PathNode & { __done: boolean; __current: boolean };
type LearningModuleState = { id: string; title: string; icon: string; nodes: PathNodeState[] };

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
        <Text style={styles.moduleEmoji}>{complete ? '✅' : mod.icon}</Text>
      </View>
      <Text style={styles.moduleTitle} numberOfLines={2}>{mod.title}</Text>
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

const MODULE_COLORS = [Colors.primary, Colors.purple, Colors.teal, Colors.orange, Colors.coral, Colors.gold];

export default function LicoesScreen() {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  async function loadAll() {
    await Promise.all([getCompletedNodes().then(setCompleted), getProgress().then(setProgress)]);
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

  const weeklyActivity = progress?.weeklyActivity ?? [0, 0, 0, 0, 0, 0, 0];
  const weekTotal = weeklyActivity.reduce((a, b) => a + b, 0);
  const todayIdx = new Date().getDay();

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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Lições</Text>
        <Text style={styles.subtitle}>{completedCount}/{LEARNING_PATH.length} concluídas · {Math.round(overallPct * 100)}%</Text>
      </View>

      <View style={styles.levelBox}>
        <View style={styles.levelTopRow}>
          <CircularProgress size={90} strokeWidth={8} progress={levelPct} label={`${Math.round(levelPct)}%`} sublabel="de 100 XP" />
          <View style={styles.levelInfo}>
            <View style={styles.levelBadgeWrap}>
              <Text style={styles.levelBadge}>NÍVEL {level}</Text>
            </View>
            <Text style={styles.levelXP}>{currentLevelXP} / {xpForLevel} XP</Text>
            <Text style={styles.levelNext}>{xpForLevel - currentLevelXP} XP para o próximo nível</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Os teus módulos</Text>
      <View style={styles.moduleGrid}>
        {modulesWithState.map((mod, i) => (
          <ModuleCard key={mod.id} mod={mod} color={MODULE_COLORS[i % MODULE_COLORS.length]} onPress={() => openModule(mod)} />
        ))}
      </View>

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

      {progress && (
        <>
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
                  style={[styles.achievementCard, unlocked && styles.achievementUnlocked, !unlocked && styles.achievementLocked]}
                >
                  <Text style={[styles.achievementEmoji, !unlocked && styles.lockedEmoji]}>{unlocked ? ach.emoji : '🔒'}</Text>
                  <Text style={[styles.achievementTitle, !unlocked && styles.lockedText]}>{ach.title}</Text>
                  {unlocked && <Text style={styles.achievementDesc}>{ach.desc}</Text>}
                </Reanimated.View>
              );
            })}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.libraryLink} onPress={() => router.push('/library')}>
        <Ionicons name="albums-outline" size={16} color={Colors.primaryLight} />
        <Text style={styles.libraryLinkText}>Ver todos os flashcards</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: 20 },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },

  levelBox: {
    backgroundColor: Colors.card, borderRadius: 20, padding: 20, marginBottom: 26,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  levelTopRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  levelInfo: { flex: 1, gap: 6 },
  levelBadgeWrap: { backgroundColor: Colors.primaryDeep, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  levelBadge: { color: Colors.gold, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  levelXP: { color: Colors.textSecondary, fontSize: 14 },
  levelNext: { color: Colors.primary, fontSize: 12, fontWeight: '600' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeader: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 26 },
  moduleCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: 16, padding: 14 },
  moduleCardPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  moduleBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  moduleEmoji: { fontSize: 17 },
  moduleTitle: { color: Colors.text, fontSize: 13, fontWeight: '600', marginBottom: 4, minHeight: 34 },
  moduleCount: { color: Colors.textMuted, fontSize: 11, marginBottom: 8 },

  track: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },

  weekCard: {
    backgroundColor: Colors.surface, borderRadius: 20, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  weekMinutes: { color: Colors.success, fontWeight: '700', fontSize: 14 },
  weekMinutesMuted: { color: Colors.textMuted, fontWeight: '400' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 64, marginBottom: 12, marginTop: 6 },
  weekCol: { alignItems: 'center', flex: 1 },
  weekBar: { width: 10, borderRadius: 4 },
  weekLabel: { color: Colors.textMuted, fontSize: 11, marginTop: 6 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statBox: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 16, alignItems: 'center', flex: 1, minWidth: '30%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },

  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: {
    backgroundColor: Colors.card, borderRadius: 16, padding: 14, alignItems: 'center', flex: 1, minWidth: '45%',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  achievementUnlocked: {
    borderColor: Colors.primary + '55', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },
  achievementLocked: { opacity: 0.35 },
  achievementEmoji: { fontSize: 30, marginBottom: 6 },
  lockedEmoji: { fontSize: 22 },
  achievementTitle: { color: Colors.text, fontWeight: '700', fontSize: 12, textAlign: 'center' },
  lockedText: { color: Colors.textMuted },
  achievementDesc: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 3, lineHeight: 14 },

  libraryLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, paddingVertical: 8 },
  libraryLinkText: { color: Colors.primaryLight, fontSize: 13, fontWeight: '700' },
});
