import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GrammarExercise } from '../types';
import { Colors } from '../constants/Colors';
import ParticleBurst from './ParticleBurst';

interface Props {
  exercise: GrammarExercise;
  onComplete: (correct: boolean) => void;
}

const tokenize = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const normWord = (w: string) => w.toLowerCase().replace(/[.?!,;:]/g, '');

// Longest common subsequence mask: for each word in `a`, whether it also
// appears in matching position/order within `b`.
function lcsMask(a: string[], b: string[]): boolean[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        normWord(a[i]) === normWord(b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const mask = new Array(n).fill(false);
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (normWord(a[i]) === normWord(b[j])) {
      mask[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return mask;
}

export default function ExerciseCard({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [burst, setBurst] = useState(0);

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/[.?!,]/g, '');

  const isCorrect =
    normalize(selected) === normalize(exercise.correctAnswer) ||
    exercise.correctAnswer
      .split('/')
      .map(normalize)
      .some((ans) => ans === normalize(selected));

  // Pick the accepted answer variant closest to what the user typed, so the
  // word diff below compares against the most relevant option.
  const bestVariant = (() => {
    const variants = exercise.correctAnswer.split('/').map((v) => v.trim());
    if (variants.length === 1) return variants[0];
    const userNorm = tokenize(selected).map(normWord);
    let best = variants[0];
    let bestScore = -1;
    for (const variant of variants) {
      const score = tokenize(variant)
        .map(normWord)
        .filter((w) => userNorm.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        best = variant;
      }
    }
    return best;
  })();

  const userWords = tokenize(selected);
  const correctWords = tokenize(bestVariant);
  const userMask = lcsMask(userWords, correctWords);
  const correctMask = lcsMask(correctWords, userWords);

  const handleSubmit = () => {
    if (!selected.trim()) return;
    setSubmitted(true);
    if (isCorrect) setBurst((b) => b + 1);
    onComplete(isCorrect);
  };

  const handleOptionPress = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  return (
    <View style={styles.card}>
      <ParticleBurst trigger={burst} />
      {/* Note badge */}
      <View style={styles.noteBadge}>
        <Text style={styles.noteText}>{exercise.noteId} — {exercise.noteTitle}</Text>
      </View>

      {/* Question */}
      <Text style={styles.question}>{exercise.question}</Text>

      {/* Input area */}
      {exercise.type === 'multiple_choice' && exercise.options ? (
        <View style={styles.optionsContainer}>
          {exercise.options.map((opt) => {
            const isOpt = selected === opt;
            let bg: string = Colors.surface;
            let border: string = 'transparent';
            if (submitted) {
              if (opt === exercise.correctAnswer) {
                bg = Colors.successDark;
                border = Colors.success;
              } else if (isOpt && !isCorrect) {
                bg = Colors.errorDark;
                border = Colors.error;
              }
            } else if (isOpt) {
              bg = Colors.primaryDark;
              border = Colors.primary;
            }
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
                onPress={() => handleOptionPress(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <TextInput
          style={[
            styles.input,
            submitted && (isCorrect ? styles.inputCorrect : styles.inputWrong),
          ]}
          value={selected}
          onChangeText={setSelected}
          placeholder="Digite sua resposta..."
          placeholderTextColor={Colors.textMuted}
          editable={!submitted}
          multiline
          returnKeyType="done"
        />
      )}

      {/* Feedback */}
      {submitted && (
        <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
          <Text style={styles.feedbackIcon}>{isCorrect ? '✅' : '❌'}</Text>
          <View style={styles.feedbackTextContainer}>
            {!isCorrect && exercise.type === 'multiple_choice' && (
              <Text style={styles.correctAnswerText}>
                Resposta correta: {exercise.correctAnswer}
              </Text>
            )}
            {!isCorrect && exercise.type !== 'multiple_choice' && (
              <View style={styles.diffBlock}>
                <Text style={styles.diffLabel}>A sua resposta:</Text>
                <Text style={styles.diffLine}>
                  {userWords.map((w, idx) => (
                    <Text key={idx} style={userMask[idx] ? styles.diffWordOk : styles.diffWordBad}>
                      {w}{idx < userWords.length - 1 ? ' ' : ''}
                    </Text>
                  ))}
                </Text>
                <Text style={[styles.diffLabel, { marginTop: 8 }]}>Resposta correta:</Text>
                <Text style={styles.diffLine}>
                  {correctWords.map((w, idx) => (
                    <Text
                      key={idx}
                      style={correctMask[idx] ? styles.diffWordNeutral : styles.diffWordFix}
                    >
                      {w}{idx < correctWords.length - 1 ? ' ' : ''}
                    </Text>
                  ))}
                </Text>
              </View>
            )}
            <Text style={styles.explanationText}>{exercise.explanation}</Text>
            {exercise.tip && (
              <Text style={styles.tipText}>💡 {exercise.tip}</Text>
            )}
          </View>
        </View>
      )}

      {/* Submit button */}
      {!submitted && (
        <TouchableOpacity
          style={[styles.submitBtn, !selected.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!selected.trim()}
        >
          <Text style={styles.submitBtnText}>Confirmar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 22,
    marginHorizontal: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  noteBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  noteText: { color: Colors.primaryLight, fontSize: 11, fontWeight: '700' },
  question: { color: Colors.text, fontSize: 17, fontWeight: '600', marginBottom: 16, lineHeight: 24 },
  optionsContainer: { gap: 10 },
  option: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
  },
  optionText: { color: Colors.text, fontSize: 15, lineHeight: 21 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    color: Colors.text,
    fontSize: 15,
    minHeight: 56,
  },
  inputCorrect: { borderColor: Colors.success, backgroundColor: Colors.successDark + '33' },
  inputWrong: { borderColor: Colors.error, backgroundColor: Colors.errorDark + '33' },
  feedback: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    gap: 10,
  },
  feedbackCorrect: { backgroundColor: Colors.success + '22', borderWidth: 1, borderColor: Colors.success },
  feedbackWrong: { backgroundColor: Colors.error + '22', borderWidth: 1, borderColor: Colors.error },
  feedbackIcon: { fontSize: 20, marginTop: 1 },
  feedbackTextContainer: { flex: 1, gap: 4 },
  correctAnswerText: { color: Colors.error, fontSize: 13, fontWeight: '700' },
  diffBlock: { marginBottom: 4 },
  diffLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 3, textTransform: 'uppercase' },
  diffLine: { fontSize: 14, lineHeight: 21 },
  diffWordOk: { color: Colors.text },
  diffWordBad: { color: Colors.error, fontWeight: '700', textDecorationLine: 'line-through' },
  diffWordNeutral: { color: Colors.textSecondary },
  diffWordFix: { color: Colors.success, fontWeight: '700' },
  explanationText: { color: Colors.text, fontSize: 13, lineHeight: 19 },
  tipText: { color: Colors.warning, fontSize: 12, marginTop: 4, lineHeight: 18 },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
