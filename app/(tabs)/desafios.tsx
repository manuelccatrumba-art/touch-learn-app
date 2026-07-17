import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CULTURE_NUGGETS } from '../../constants/culture';
import { addXP } from '../../services/storage';
import { getWeeklyLeaderboard, LeaderboardEntry } from '../../services/leaderboard';
import ParticleBurst from '../../components/ParticleBurst';

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function normalizeAnswer(s: string) {
  return s.trim().toLowerCase().replace(/[.?!,]/g, '');
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function DesafiosScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [burst, setBurst] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getWeeklyLeaderboard().then(setLeaderboard);
    }, []),
  );

  const dailyNugget = CULTURE_NUGGETS[dayOfYear() % CULTURE_NUGGETS.length];

  function checkChallenge() {
    const isRight =
      normalizeAnswer(answer) === normalizeAnswer(dailyNugget.phrase) ||
      (normalizeAnswer(dailyNugget.phrase).includes(normalizeAnswer(answer)) && answer.trim().length > 3);
    setChecked(true);
    setCorrect(isRight);
    if (isRight) {
      addXP(10).then(() => getWeeklyLeaderboard().then(setLeaderboard));
      setBurst((b) => b + 1);
    }
  }

  function resetChallenge() {
    setAnswer('');
    setChecked(false);
    setCorrect(false);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Desafios</Text>
        <Text style={styles.subtitle}>Desafio diário e ranking da semana</Text>
      </View>

      <LinearGradient colors={Colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.challengeCard}>
        <ParticleBurst trigger={burst} />
        <View style={styles.challengeHeaderRow}>
          <Text style={styles.challengeLabel}>DESAFIO DE HOJE</Text>
          <Text style={styles.giftIcon}>🎁</Text>
        </View>
        <Text style={styles.challengePrompt}>{dailyNugget.translation}</Text>
        <Text style={styles.challengeHint}>Traduz esta frase para inglês</Text>

        {!checked ? (
          <>
            <TextInput
              style={styles.challengeInput}
              value={answer}
              onChangeText={setAnswer}
              placeholder="A tua resposta..."
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.challengeBtn, !answer.trim() && { opacity: 0.5 }]}
              onPress={checkChallenge}
              disabled={!answer.trim()}
            >
              <Text style={styles.challengeBtnText}>Verificar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            <Text style={[styles.challengeResult, { color: correct ? Colors.success : Colors.coral }]}>
              {correct ? '✓ Certo! +10 XP' : `✗ Era: "${dailyNugget.phrase}"`}
            </Text>
            {dailyNugget.explanation && <Text style={styles.challengeExplanation}>{dailyNugget.explanation}</Text>}
            <TouchableOpacity style={styles.challengeBtnSecondary} onPress={resetChallenge}>
              <Text style={styles.challengeBtnSecondaryText}>Tentar outra vez</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <Text style={styles.sectionHeader}>Ranking semanal</Text>
      <View style={styles.rankCard}>
        {leaderboard.map((entry, i) => (
          <View key={entry.id} style={[styles.rankRow, entry.isCurrentUser && styles.rankRowMe]}>
            <View style={styles.rankPositionWrap}>
              {i < 3 ? (
                <Text style={styles.rankMedal}>{RANK_MEDALS[i]}</Text>
              ) : (
                <Text style={styles.rankPosition}>#{i + 1}</Text>
              )}
            </View>
            <View style={[styles.rankAvatar, { backgroundColor: entry.avatarColor + '33' }]}>
              <Text style={styles.rankAvatarEmoji}>{entry.avatarEmoji}</Text>
            </View>
            <Text style={styles.rankName} numberOfLines={1}>{entry.isCurrentUser ? 'Tu' : entry.name}</Text>
            <Text style={styles.rankXp}>{entry.xp} XP</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: 20 },
  title: { color: Colors.text, fontSize: 24, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: 13, marginTop: 4 },

  challengeCard: {
    borderRadius: 22, padding: 20, marginBottom: 30, position: 'relative',
    shadowColor: Colors.purple, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  challengeHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  giftIcon: { fontSize: 20 },
  challengePrompt: { color: Colors.text, fontSize: 20, fontWeight: '700', marginTop: 12 },
  challengeHint: { color: Colors.textMuted, fontSize: 12, marginTop: 6, marginBottom: 16 },
  challengeInput: {
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    color: Colors.text, fontSize: 15, marginBottom: 12,
  },
  challengeBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  challengeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  challengeResult: { fontSize: 15, fontWeight: '700', marginBottom: 8 },
  challengeExplanation: { color: Colors.textSecondary, fontSize: 12, marginBottom: 14, lineHeight: 18 },
  challengeBtnSecondary: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  challengeBtnSecondaryText: { color: Colors.primaryLight, fontWeight: '700', fontSize: 13 },

  sectionHeader: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  rankCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 8 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12 },
  rankRowMe: { backgroundColor: Colors.primary + '1a' },
  rankPositionWrap: { width: 26, alignItems: 'center' },
  rankMedal: { fontSize: 17 },
  rankPosition: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  rankAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  rankAvatarEmoji: { fontSize: 16 },
  rankName: { flex: 1, color: Colors.text, fontSize: 14, fontWeight: '600' },
  rankXp: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
});
