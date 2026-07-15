import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { LEARNING_PATH, LEARNING_MODULES, LearningModule, PathNode } from '../../constants/path';
import { getCompletedNodes } from '../../services/pathProgress';
import { getProgress } from '../../services/storage';
import { UserProgress } from '../../types';

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

  useFocusEffect(
    useCallback(() => {
      getCompletedNodes().then(setCompleted);
      getProgress().then(setProgress);
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

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.greetingSub}>Pronto para praticar hoje?</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={Colors.primary} />
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
      </View>

      <StreakTrail days={streak} />

      {currentNode ? (
        <Pressable style={({ pressed }) => [styles.hero, pressed && { opacity: 0.9 }]} onPress={() => openNode(currentNode)}>
          <Text style={styles.heroEyebrow}>CONTINUAR</Text>
          <Text style={styles.heroTitle}>{currentNode.icon} {currentNode.title}</Text>
          <Text style={styles.heroSubtitle}>
            {currentNode.type === 'grammar' ? 'Exercício de gramática' : 'Revisão de vocabulário'}
          </Text>
          <View style={{ marginTop: 14 }}>
            <ProgressBar value={overallPct} color={Colors.primary} trackColor={Colors.primaryDeep} />
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroPercent}>{Math.round(overallPct * 100)}% da trilha concluída</Text>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.background} />
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>PARABÉNS</Text>
          <Text style={styles.heroTitle}>🏆 Trilha completa!</Text>
          <Text style={styles.heroSubtitle}>Voltaste a praticar qualquer lição a partir dos separadores.</Text>
        </View>
      )}

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeader}>Os teus módulos</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {modulesWithState.map((mod) => (
          <ModuleCard key={mod.id} mod={mod} color={moduleColor(mod)} onPress={() => openModule(mod)} />
        ))}
      </ScrollView>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  greetingSub: { color: Colors.textMuted, fontSize: 14, marginTop: 2 },

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
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  heroEyebrow: { color: Colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  heroTitle: { color: Colors.text, fontSize: 19, fontWeight: '700', marginTop: 6 },
  heroSubtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  heroPercent: { color: Colors.textMuted, fontSize: 12 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  heroCtaText: { color: Colors.background, fontWeight: '700', fontSize: 13 },

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
  moduleCardPressed: { opacity: 0.85 },
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
});
