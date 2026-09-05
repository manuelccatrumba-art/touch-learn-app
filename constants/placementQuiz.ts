import { CEFRLevel } from '../types';
import { GRAMMAR_EXERCISES } from './grammarExercises';

export interface PlacementQuestion {
  level: CEFRLevel;
  exerciseId: string; // referencia um exercício multiple_choice já existente em GRAMMAR_EXERCISES
}

// 8 perguntas de escolha múltipla, 2 por nível A1/A2/B1, mais 1 B2 e 1 C1 —
// amostra pequena mas espalhada por toda a escala coberta pela app (NL1-30
// vai de A1 a C1). Reaproveita os exercícios já escritos e revistos em vez
// de inventar perguntas novas só para o placement.
const QUESTION_REFS: PlacementQuestion[] = [
  { level: 'A1', exerciseId: 'nl2_1' },
  { level: 'A1', exerciseId: 'nl3_3' },
  { level: 'A2', exerciseId: 'nl4_1' },
  { level: 'A2', exerciseId: 'nl8_1' },
  { level: 'B1', exerciseId: 'nl1_1' },
  { level: 'B1', exerciseId: 'nl9_1' },
  { level: 'B2', exerciseId: 'nl13_1' },
  { level: 'C1', exerciseId: 'nl30_1' },
];

export interface PlacementQuestionResolved extends PlacementQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export const PLACEMENT_QUESTIONS: PlacementQuestionResolved[] = QUESTION_REFS.map((ref) => {
  const exercise = GRAMMAR_EXERCISES.find((e) => e.id === ref.exerciseId);
  if (!exercise || !exercise.options) {
    throw new Error(`Pergunta de placement inválida: ${ref.exerciseId}`);
  }
  return {
    ...ref,
    question: exercise.question,
    options: exercise.options,
    correctAnswer: exercise.correctAnswer,
  };
});

// Regra simples: quanto mais perguntas certas, mais alto o nível estimado.
// Não exige acertar todas de um nível — é só uma estimativa inicial de
// posicionamento, não uma certificação.
export function estimateLevelFromScore(correctCount: number): CEFRLevel {
  if (correctCount <= 1) return 'A1';
  if (correctCount <= 3) return 'A2';
  if (correctCount <= 5) return 'B1';
  if (correctCount <= 6) return 'B2';
  return 'C1';
}
