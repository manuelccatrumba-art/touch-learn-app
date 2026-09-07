import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from '../components/AppText';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { PLACEMENT_QUESTIONS, estimateLevelFromScore } from '../constants/placementQuiz';
import { CEFR_TITLE, isBelowLevel } from '../utils/cefr';
import { LEARNING_PATH } from '../constants/path';
import { GRAMMAR_NOTES } from '../constants/grammarExercises';
import { CATEGORY_LABELS } from '../constants/bookContent';
import { FlashCardCategory } from '../types';
import { markNodeComplete } from '../services/pathProgress';
import { updateProfile } from '../services/profile';
import { hapticSuccess, hapticError } from '../utils/haptics';

type Screen = 'intro' | 'quiz' | 'result';

export default function PlacementScreen() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('intro');
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function finish(skipped: boolean) {
    setSaving(true);
    const level = skipped ? 'A1' : estimateLevelFromScore(correctCount);

    if (!skipped) {
      // Marca como concluídos os nós cujo nível está ABAIXO do estimado —
      // o utilizador começa a Trilha no primeiro nó que ainda não domina,
      // em vez de repetir do zero conteúdo que já sabe.
      for (const node of LEARNING_PATH) {
        const nodeLevel =
          node.type === 'grammar'
            ? GRAMMAR_NOTES.find((n) => n.id === node.refId)?.level
            : CATEGORY_LABELS[node.refId as FlashCardCategory]?.level;
        if (nodeLevel && isBelowLevel(nodeLevel, level)) {
          await markNodeComplete(node.id);
        }
      }
    }

    await updateProfile({ placementDone: true });
    router.replace('/trail');
  }

  if (screen === 'intro') {
    return (
      <View style={[styles.safe, styles.center]}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>Vamos ver o teu nível</Text>
        <Text style={styles.subtitle}>
          8 perguntas rápidas para não te fazer repetir o que já sabes. Leva menos de 2 minutos.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('quiz')}>
          <Text style={styles.primaryBtnText}>Começar teste →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={() => finish(true)} disabled={saving}>
          <Text style={styles.skipBtnText}>Saltar e começar do zero</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'result') {
    const level = estimateLevelFromScore(correctCount);
    return (
      <View style={[styles.safe, styles.center]}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.title}>O teu nível estimado é</Text>
        <Text style={styles.levelBadge}>{CEFR_TITLE[level]} · {level}</Text>
        <Text style={styles.subtitle}>
          Acertaste {correctCount} de {PLACEMENT_QUESTIONS.length}. Já marcámos como concluído o que está abaixo
          deste nível, para começares no sítio certo da Trilha.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => finish(false)} disabled={saving}>
          <Text style={styles.primaryBtnText}>{saving ? 'A preparar...' : 'Começar →'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = PLACEMENT_QUESTIONS[index];

  function choose(option: string) {
    if (selected) return;
    setSelected(option);
    const isRight = option === q.correctAnswer;
    if (isRight) hapticSuccess(); else hapticError();
    setTimeout(() => {
      if (isRight) setCorrectCount((c) => c + 1);
      if (index + 1 < PLACEMENT_QUESTIONS.length) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        setScreen('result');
      }
    }, 500);
  }

  return (
    <View style={styles.safe}>
      <View style={styles.quizHeader}>
        <View style={styles.dotsRow}>
          {PLACEMENT_QUESTIONS.map((_, i) => (
            <View key={i} style={[styles.dot, i <= index && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={() => finish(true)} disabled={saving}>
          <Text style={styles.skipInline}>Saltar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.quizBody}>
        <Text style={styles.questionLevel}>{q.level}</Text>
        <Text style={styles.question}>{q.question}</Text>
        {q.options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = !!selected && opt === q.correctAnswer;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.option,
                isSelected && !isCorrectOpt && styles.optionWrong,
                isCorrectOpt && styles.optionCorrect,
              ]}
              onPress={() => choose(opt)}
              disabled={!!selected}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center', padding: 28 },

  emoji: { fontSize: 56, marginBottom: 16 },
  title: { color: Colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  levelBadge: {
    color: Colors.primaryLight, fontSize: 24, fontWeight: '800', marginBottom: 16,
    backgroundColor: Colors.primaryDeep, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 14,
  },

  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  skipBtn: { marginTop: 16, padding: 8 },
  skipBtnText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },

  quizHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  dotsRow: { flexDirection: 'row', gap: 6, flex: 1 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary },
  skipInline: { color: Colors.textMuted, fontSize: 13, fontWeight: '700', marginLeft: 16 },

  quizBody: { padding: 24, paddingTop: 12 },
  questionLevel: {
    color: Colors.primaryLight, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 8,
  },
  question: { color: Colors.text, fontSize: 19, fontWeight: '700', marginBottom: 24, lineHeight: 26 },
  option: {
    backgroundColor: Colors.card, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  optionCorrect: { borderColor: Colors.success, backgroundColor: Colors.success + '22' },
  optionWrong: { borderColor: Colors.coral, backgroundColor: Colors.coral + '22' },
  optionText: { color: Colors.text, fontSize: 15 },
});
