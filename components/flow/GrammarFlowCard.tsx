import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GRAMMAR_EXERCISES, GRAMMAR_NOTES } from '../../constants/grammarExercises';
import { incrementProgress, addXP } from '../../services/storage';
import { markNodeComplete } from '../../services/pathProgress';
import ExerciseCard from '../ExerciseCard';
import IconBadge from '../IconBadge';

interface Props {
  noteId: string;
  resolved: boolean;
  onResolved: () => void;
}

export default function GrammarFlowCard({ noteId, resolved, onResolved }: Props) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(resolved);

  const note = GRAMMAR_NOTES.find((n) => n.id === noteId);
  const exercises = GRAMMAR_EXERCISES.filter((e) => e.noteId === noteId);
  if (!note) return null;

  async function handleComplete(correct: boolean) {
    const next = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(next);
    await incrementProgress({ exercisesCompleted: 1, exercisesCorrect: correct ? 1 : 0 });
    await addXP(correct ? 15 : 5);

    if (index + 1 >= exercises.length) {
      const pct = Math.round((next.correct / next.total) * 100);
      if (pct >= 60) {
        await markNodeComplete(noteId);
        setDone(true);
        onResolved();
      }
    }
  }

  if (done) {
    return (
      <View style={[styles.card, styles.cardDone]}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.doneText}>{note.title} — concluída</Text>
      </View>
    );
  }

  if (!started) {
    return (
      <TouchableOpacity style={styles.card} onPress={() => setStarted(true)} activeOpacity={0.85}>
        <IconBadge name="help-circle" color={Colors.error} size={18} badgeSize={36} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{note.title}</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>{note.level}</Text>
            </View>
          </View>
          <Text style={styles.desc} numberOfLines={1}>{note.description}</Text>
          <View style={styles.cefrTag}>
            <Ionicons name="checkmark-circle" size={11} color={Colors.success} />
            <Text style={styles.cefrTagText}>Estruturado segundo o CEFR</Text>
          </View>
        </View>
        <View style={styles.ctaBtn}>
          <Text style={styles.ctaText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.background} />
        </View>
      </TouchableOpacity>
    );
  }

  const exercise = exercises[index];
  if (!exercise) return null;

  return (
    <View style={styles.sessionWrap}>
      <Text style={styles.sessionHeader}>{note.title} · {index + 1}/{exercises.length}</Text>
      <ExerciseCard
        key={`${noteId}-${index}`}
        exercise={exercise}
        onComplete={handleComplete}
      />
      {score.total > index && index + 1 < exercises.length && (
        <TouchableOpacity style={styles.nextBtn} onPress={() => setIndex(index + 1)}>
          <Text style={styles.nextBtnText}>Próxima questão →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  cardDone: { opacity: 0.6, gap: 8 },
  doneText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { color: Colors.text, fontSize: 14, fontWeight: '700' },
  levelPill: { backgroundColor: Colors.secondary + '22', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 },
  levelPillText: { color: Colors.secondary, fontSize: 9, fontWeight: '800' },
  desc: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  cefrTag: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  cefrTagText: { color: Colors.success, fontSize: 9, fontWeight: '700' },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ctaText: { color: Colors.background, fontSize: 11, fontWeight: '800' },

  sessionWrap: { marginHorizontal: 8, marginVertical: 8, gap: 10 },
  sessionHeader: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', marginLeft: 12 },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  nextBtnText: { color: Colors.background, fontWeight: '700', fontSize: 14 },
});
