import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Application from 'expo-application';
import { Colors } from '../../constants/Colors';
import { getProgress, resetAllData } from '../../services/storage';
import { UserProgress } from '../../types';
import CircularProgress from '../../components/CircularProgress';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

function StatBox({ value, label, color = Colors.primary }: { value: string | number; label: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LevelBar({ xp, level }: { xp: number; level: number }) {
  const xpForLevel = 100;
  const currentXP = xp % xpForLevel;
  const pct = (currentXP / xpForLevel) * 100;

  return (
    <View style={styles.levelBox}>
      <View style={styles.levelTopRow}>
        <CircularProgress
          size={96}
          strokeWidth={9}
          progress={pct}
          label={`${Math.round(pct)}%`}
          sublabel={`de 100 XP`}
        />
        <View style={styles.levelInfo}>
          <View style={styles.levelBadgeWrap}>
            <Text style={styles.levelBadge}>NÍVEL {level}</Text>
          </View>
          <Text style={styles.levelXP}>{currentXP} / {xpForLevel} XP</Text>
          <Text style={styles.levelNext}>{xpForLevel - currentXP} XP para o próximo nível</Text>
        </View>
      </View>
      <View style={styles.levelBarBg}>
        <View style={[styles.levelBarFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.levelTotal}>Total acumulado: {xp} XP</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getProgress().then(setProgress);
    }, []),
  );

  if (!progress) return null;

  const accuracy =
    progress.exercisesCompleted > 0
      ? Math.round((progress.exercisesCorrect / progress.exercisesCompleted) * 100)
      : 0;

  const maxActivity = Math.max(...progress.weeklyActivity, 1);
  const todayIdx = new Date().getDay();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Progresso</Text>
            <Text style={styles.headerSub}>Seu desempenho de aprendizado</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>XP</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Level */}
        <LevelBar xp={progress.xp} level={progress.level} />

        {/* Streak */}
        <View style={styles.streakRow}>
          <View style={styles.streakBox}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>{progress.currentStreak}</Text>
            <Text style={styles.streakLabel}>Dias seguidos</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={styles.streakFire}>🏅</Text>
            <Text style={styles.streakNum}>{progress.longestStreak}</Text>
            <Text style={styles.streakLabel}>Recorde pessoal</Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatBox value={progress.totalMessages} label="Mensagens" />
          <StatBox value={progress.exercisesCompleted} label="Exercícios" />
          <StatBox value={`${accuracy}%`} label="Precisão" />
          <StatBox value={progress.flashcardsReviewed} label="Revisados" />
          <StatBox value={progress.flashcardsLearned} label="Aprendidos" />
          <StatBox value={progress.level} label="Nível" color={Colors.gold} />
        </View>

        {/* Weekly activity chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Atividade Semanal</Text>
          <View style={styles.chart}>
            {DAYS.map((day, i) => {
              const val = progress.weeklyActivity[i] ?? 0;
              const height = Math.max((val / maxActivity) * 80, 4);
              const isToday = todayIdx === i;
              return (
                <View key={day} style={styles.chartBar}>
                  <View style={styles.chartBarTrack}>
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height,
                          backgroundColor: isToday ? Colors.primary : Colors.primaryDeep,
                          shadowColor: isToday ? Colors.primary : 'transparent',
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: isToday ? 0.8 : 0,
                          shadowRadius: 4,
                          elevation: isToday ? 3 : 0,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.chartDay, isToday && styles.chartDayActive]}>
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>
          Conquistas ({progress.achievements.length}/{Object.keys(ACHIEVEMENTS).length})
        </Text>
        <View style={styles.achievementGrid}>
          {Object.entries(ACHIEVEMENTS).map(([id, ach], idx) => {
            const unlocked = progress.achievements.includes(id);
            return (
              <Animated.View
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
              </Animated.View>
            );
          })}
        </View>

        {/* Reset */}
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={async () => {
            await resetAllData();
            const fresh = await getProgress();
            setProgress(fresh);
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

  header: {
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  headerAccent: {
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  headerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: { color: Colors.gold, fontWeight: '800', fontSize: 13, letterSpacing: 1 },

  content: { padding: 18, gap: 18, paddingBottom: 32 },

  levelBox: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  levelTopRow: { flexDirection: 'row', alignItems: 'center', gap: 18, marginBottom: 14 },
  levelInfo: { flex: 1, gap: 6 },
  levelBadgeWrap: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  levelBadge: { color: Colors.gold, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  levelXP: { color: Colors.textSecondary, fontSize: 14 },
  levelBarBg: { height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  levelBarFill: {
    height: 10,
    backgroundColor: Colors.gold,
    borderRadius: 5,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  levelTotal: { color: Colors.textMuted, fontSize: 12, marginTop: 8, textAlign: 'center' },
  levelNext: { color: Colors.primary, fontSize: 12, fontWeight: '600' },

  streakRow: { flexDirection: 'row', gap: 12 },
  streakBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  streakFire: { fontSize: 30, marginBottom: 6 },
  streakNum: { color: Colors.text, fontSize: 30, fontWeight: '800' },
  streakLabel: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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

  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: { color: Colors.text, fontWeight: '700', fontSize: 16, marginBottom: 14 },
  chart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 110 },
  chartBar: { alignItems: 'center', gap: 6, flex: 1 },
  chartBarTrack: { height: 80, justifyContent: 'flex-end', alignItems: 'center' },
  chartBarFill: { width: 22, borderRadius: 5 },
  chartDay: { color: Colors.textMuted, fontSize: 10 },
  chartDayActive: { color: Colors.primary, fontWeight: '700' },

  achievementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
