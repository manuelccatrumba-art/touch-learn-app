import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '../../components/AppText';
import { useFocusEffect } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { getWeeklyLeaderboard, LeaderboardEntry } from '../../services/leaderboard';
import DailyChallengeCard from '../../components/DailyChallengeCard';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export default function DesafiosScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const loadLeaderboard = useCallback(() => {
    getWeeklyLeaderboard().then(setLeaderboard);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, [loadLeaderboard]),
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Desafios</Text>
        <Text style={styles.subtitle}>Desafio diário e ranking da semana</Text>
      </View>

      <DailyChallengeCard variant="hero" onAnswered={loadLeaderboard} />

      <Text style={styles.sectionHeader}>Ranking semanal</Text>
      <Text style={styles.rankHint}>
        XP ganho esta semana. Reinicia todas as segundas-feiras.
      </Text>
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

  sectionHeader: { color: Colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  rankHint: { color: Colors.textMuted, fontSize: 12, marginBottom: 12 },

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
