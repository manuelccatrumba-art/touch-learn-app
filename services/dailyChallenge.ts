import AsyncStorage from '@react-native-async-storage/async-storage';
import { CULTURE_NUGGETS, CultureNugget } from '../constants/culture';
import { isCloseMatch } from '../utils/textMatch';
import { addXP } from './storage';

const KEY = '@et:daily_challenge';
const CHALLENGE_XP = 10;

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  completed: boolean;
  correct: boolean;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function getTodayNugget(): CultureNugget {
  return CULTURE_NUGGETS[dayOfYear() % CULTURE_NUGGETS.length];
}

// Devolve o estado de hoje, ou null se ainda não foi respondido hoje
// (inclui o caso de o registo gravado ser de um dia anterior).
export async function getDailyChallengeState(): Promise<DailyChallengeState | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  const state: DailyChallengeState = JSON.parse(raw);
  return state.date === todayStr() ? state : null;
}

// Único ponto de entrada para responder ao desafio do dia — chamado tanto pelo
// cartão compacto da Início como pelo ecrã Desafios. Grava o resultado ANTES
// de dar XP, para que reabrir a app ou trocar de separador nunca permita
// responder duas vezes ao mesmo desafio no mesmo dia.
export async function answerDailyChallenge(answer: string): Promise<{ correct: boolean; alreadyAnswered: boolean }> {
  const existing = await getDailyChallengeState();
  if (existing?.completed) {
    return { correct: existing.correct, alreadyAnswered: true };
  }

  const nugget = getTodayNugget();
  const correct = isCloseMatch(answer, nugget.phrase);
  const state: DailyChallengeState = { date: todayStr(), completed: true, correct };
  await AsyncStorage.setItem(KEY, JSON.stringify(state));

  if (correct) await addXP(CHALLENGE_XP);
  return { correct, alreadyAnswered: false };
}

export const DAILY_CHALLENGE_XP = CHALLENGE_XP;

export async function resetDailyChallenge(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
