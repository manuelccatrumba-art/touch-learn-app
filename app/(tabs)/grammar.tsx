import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { GRAMMAR_EXERCISES, GRAMMAR_NOTES } from '../../constants/grammarExercises';
import ExerciseCard from '../../components/ExerciseCard';
import LessonCompleteModal from '../../components/LessonCompleteModal';
import { incrementProgress, addXP } from '../../services/storage';
import { markNodeComplete } from '../../services/pathProgress';
import { LEARNING_PATH } from '../../constants/path';
import { CEFRLevel } from '../../types';
import FadeEdgeScrollView from '../../components/FadeEdgeScrollView';

type Screen = 'home' | 'note' | 'exercise';
const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function GrammarScreen() {
  const params = useLocalSearchParams<{ noteId?: string; autostart?: string }>();
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedNoteId, setSelectedNoteId] = useState<string>('');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState(false);
  const [celebration, setCelebration] = useState<{ xp: number; next: { title: string; icon: string } | null } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const viaPath = !!params.noteId;
  const visibleNotes = selectedLevel === 'all' ? GRAMMAR_NOTES : GRAMMAR_NOTES.filter((n) => n.level === selectedLevel);

  const noteExercises = GRAMMAR_EXERCISES.filter((e) => e.noteId === selectedNoteId);

  function startNote(noteId: string) {
    setSelectedNoteId(noteId);
    setExerciseIndex(0);
    setScore({ correct: 0, total: 0 });
    setSessionDone(false);
    setScreen('exercise');
  }

  useEffect(() => {
    if (params.noteId && params.autostart) {
      startNote(params.noteId);
    }
  }, [params.noteId, params.autostart]);

  useEffect(() => {
    if (!sessionDone || score.total === 0) return;
    const pct = Math.round((score.correct / score.total) * 100);
    if (pct < 60) return;
    (async () => {
      await markNodeComplete(selectedNoteId);
      if (viaPath) {
        const idx = LEARNING_PATH.findIndex((n) => n.id === selectedNoteId);
        const next = idx >= 0 && idx + 1 < LEARNING_PATH.length ? LEARNING_PATH[idx + 1] : null;
        setCelebration({
          xp: score.correct * 15 + (score.total - score.correct) * 5,
          next: next ? { title: next.title, icon: next.icon } : null,
        });
      }
    })();
  }, [sessionDone]);

  async function handleExerciseComplete(correct: boolean) {
    const newScore = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);

    await incrementProgress({ exercisesCompleted: 1, exercisesCorrect: correct ? 1 : 0 });
    await addXP(correct ? 15 : 5);

    if (exerciseIndex + 1 >= noteExercises.length) {
      setSessionDone(true);
    }
  }

  function nextExercise() {
    if (exerciseIndex + 1 < noteExercises.length) {
      setExerciseIndex(exerciseIndex + 1);
    }
  }

  if (screen === 'exercise' && !sessionDone) {
    const exercise = noteExercises[exerciseIndex];
    const note = GRAMMAR_NOTES.find((n) => n.id === selectedNoteId);

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.exHeader}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.exTitleBlock}>
            <Text style={styles.exTitle}>{note?.icon} {note?.title}</Text>
            <Text style={styles.exCount}>{exerciseIndex + 1} de {noteExercises.length}</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${((exerciseIndex + 1) / noteExercises.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.exContent}>
          <ExerciseCard
            key={`${selectedNoteId}-${exerciseIndex}`}
            exercise={exercise}
            onComplete={handleExerciseComplete}
          />
          {score.total > exerciseIndex && (
            <TouchableOpacity style={styles.nextBtn} onPress={nextExercise}>
              <Text style={styles.nextBtnText}>
                {exerciseIndex + 1 < noteExercises.length ? 'Próxima questão →' : 'Ver resultado'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'exercise' && sessionDone) {
    const pct = Math.round((score.correct / score.total) * 100);
    const note = GRAMMAR_NOTES.find((n) => n.id === selectedNoteId);
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚';
    const resultColor = pct >= 80 ? Colors.success : pct >= 60 ? Colors.warning : Colors.primary;

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>
            {pct >= 80 ? 'Excelente!' : pct >= 60 ? 'Bom trabalho!' : 'Continue praticando!'}
          </Text>
          <Text style={styles.resultNote}>{note?.icon} {note?.title}</Text>
          <View style={[styles.resultScoreBox, { borderColor: resultColor + '44' }]}>
            <Text style={[styles.resultPct, { color: resultColor }]}>{pct}%</Text>
            <Text style={styles.resultCorrect}>{score.correct}/{score.total} corretas</Text>
          </View>
          <TouchableOpacity style={styles.tryAgainBtn} onPress={() => startNote(selectedNoteId)}>
            <Text style={styles.tryAgainText}>Tentar novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => setScreen('home')}>
            <Text style={styles.goBackText}>← Voltar para notas</Text>
          </TouchableOpacity>
        </ScrollView>

        <LessonCompleteModal
          visible={!!celebration}
          xp={celebration?.xp ?? 0}
          nextNode={celebration?.next ?? null}
          onContinue={() => {
            setCelebration(null);
            router.push('/trail');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with brand accent */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Gramática</Text>
            <Text style={styles.headerSub}>{GRAMMAR_NOTES.length} Notas Linguísticas · do A1 ao C1</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>NL</Text>
          </View>
        </View>
      </View>

      <FadeEdgeScrollView style={styles.levelScroll} contentContainerStyle={styles.levelFilterContent}>
        <TouchableOpacity
          style={[styles.levelChip, selectedLevel === 'all' && styles.levelChipActive]}
          onPress={() => setSelectedLevel('all')}
        >
          <Text style={[styles.levelChipText, selectedLevel === 'all' && styles.levelChipTextActive]}>Todos os níveis</Text>
        </TouchableOpacity>
        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelChip, selectedLevel === lvl && styles.levelChipActive]}
            onPress={() => setSelectedLevel(lvl)}
          >
            <Text style={[styles.levelChipText, selectedLevel === lvl && styles.levelChipTextActive]}>{lvl}</Text>
          </TouchableOpacity>
        ))}
      </FadeEdgeScrollView>

      <ScrollView contentContainerStyle={styles.homeContent}>
        {visibleNotes.map((note, index) => {
          const exercises = GRAMMAR_EXERCISES.filter((e) => e.noteId === note.id);
          return (
            <TouchableOpacity
              key={note.id}
              style={styles.noteCard}
              onPress={() => startNote(note.id)}
              activeOpacity={0.75}
            >
              <View style={styles.noteIndexBadge}>
                <Text style={styles.noteIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.noteLeft}>
                <Text style={styles.noteEmoji}>{note.icon}</Text>
                <View style={styles.noteInfo}>
                  <Text style={styles.noteId}>{note.id}</Text>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <Text style={styles.noteDesc}>{note.description}</Text>
                </View>
              </View>
              <View style={styles.noteRight}>
                <Text style={styles.levelBadge}>{note.level}</Text>
                <Text style={styles.exCountBadge}>{exercises.length}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          );
        })}
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
  headerBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 13, letterSpacing: 1 },

  levelScroll: { maxHeight: 44, flexGrow: 0, marginTop: 4 },
  levelFilterContent: { paddingLeft: 16, paddingRight: 28, gap: 8, alignItems: 'center', paddingBottom: 4 },
  levelChip: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelChipActive: { backgroundColor: Colors.primaryDeep, borderColor: Colors.gold },
  levelChipText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' },
  levelChipTextActive: { color: Colors.gold },

  homeContent: { padding: 16, gap: 12 },
  noteCard: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  noteIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  noteIndexText: { color: Colors.primaryLight, fontSize: 10, fontWeight: '700' },
  noteLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  noteEmoji: { fontSize: 26, width: 34 },
  noteInfo: { flex: 1 },
  noteId: { color: Colors.primary, fontSize: 10, fontWeight: '800', marginBottom: 1, letterSpacing: 0.5 },
  noteTitle: { color: Colors.text, fontSize: 15, fontWeight: '700' },
  noteDesc: { color: Colors.textSecondary, fontSize: 12, marginTop: 2, lineHeight: 16 },
  noteRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBadge: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: Colors.secondary + '22',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  exCountBadge: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exTitleBlock: { flex: 1 },
  exTitle: { color: Colors.text, fontWeight: '700', fontSize: 16 },
  exCount: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },

  progressBarBg: { height: 3, backgroundColor: Colors.border },
  progressBarFill: {
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  exContent: { padding: 20, gap: 16, paddingBottom: 40 },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  nextBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },

  resultContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { color: Colors.text, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  resultNote: { color: Colors.textSecondary, fontSize: 16, marginBottom: 28 },
  resultScoreBox: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    width: '100%',
  },
  resultPct: { fontSize: 60, fontWeight: '800' },
  resultCorrect: { color: Colors.textSecondary, fontSize: 16, marginTop: 4 },
  tryAgainBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  tryAgainText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  goBackBtn: { paddingVertical: 12 },
  goBackText: { color: Colors.textSecondary, fontSize: 15 },
  bottomPad: { height: 24 },
});
