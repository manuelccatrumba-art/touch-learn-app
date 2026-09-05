import { CEFRLevel } from '../types';
import { GRAMMAR_NOTES } from '../constants/grammarExercises';

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const CEFR_TITLE: Record<CEFRLevel, string> = {
  A1: 'Iniciante',
  A2: 'Elementar',
  B1: 'Intermédio',
  B2: 'Intermédio-Alto',
  C1: 'Avançado',
  C2: 'Proficiente',
};

export function cefrIndex(level: CEFRLevel): number {
  return CEFR_ORDER.indexOf(level);
}

export function isBelowLevel(level: CEFRLevel, ceiling: CEFRLevel): boolean {
  return cefrIndex(level) < cefrIndex(ceiling);
}

// Nível estimado a partir das notas de gramática já concluídas na Trilha —
// o mais alto nível entre elas. Usado no cabeçalho de progresso e no perfil.
export function estimateCEFRLevel(completedNoteIds: string[]): CEFRLevel {
  const levels = completedNoteIds
    .map((id) => GRAMMAR_NOTES.find((n) => n.id === id)?.level)
    .filter((l): l is CEFRLevel => !!l);
  let best: CEFRLevel = 'A1';
  for (const lvl of CEFR_ORDER) {
    if (levels.includes(lvl)) best = lvl;
  }
  return best;
}
