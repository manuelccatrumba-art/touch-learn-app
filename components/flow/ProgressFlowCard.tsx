import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { getProgress } from '../../services/storage';
import { UserProgress } from '../../types';

export default function ProgressFlowCard() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    getProgress().then(setProgress);
  }, []);

  if (!progress) return null;

  const weekTotal = progress.weeklyActivity.reduce((a, b) => a + b, 0);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="stats-chart" size={16} color={Colors.gold} />
        <Text style={styles.title}>O teu progresso</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.level}</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>🔥 {progress.currentStreak}</Text>
          <Text style={styles.statLabel}>Sequência</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{weekTotal}</Text>
          <Text style={styles.statLabel}>Esta semana</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{progress.flashcardsLearned}</Text>
          <Text style={styles.statLabel}>Palavras</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  title: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: Colors.text, fontSize: 16, fontWeight: '800' },
  statLabel: { color: Colors.textMuted, fontSize: 10, marginTop: 3 },
});
