import { getProfile } from './profile';
import { getProgress } from './storage';

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarEmoji: string;
  avatarColor: string;
  xp: number;
  isCurrentUser: boolean;
}

// Não há backend/contas multi-utilizador ainda — ranking com concorrentes
// fictícios para o utilizador real (dados reais de services/profile +
// services/storage) se posicionar entre eles. Diferente da versão anterior,
// isto agora é honesto em dois pontos:
// 1) Ordena por XP GANHO ESTA SEMANA (weeklyXp), não XP total acumulado —
//    o rótulo "ranking semanal" já corresponde ao que é mostrado.
// 2) Os concorrentes fictícios variam de semana para semana (seed = segunda-
//    feira da semana atual), em vez de ficarem parados nos mesmos valores
//    para sempre depois do utilizador real os ultrapassar uma vez.
// Substituir por dados reais assim que existir backend com mais utilizadores.
const MOCK_COMPETITOR_BASE = [
  { id: 'm1', name: 'Beatriz M.', avatarEmoji: '🦊', avatarColor: '#ff6b6b', baseXp: 120 },
  { id: 'm2', name: 'Carlos S.', avatarEmoji: '🐯', avatarColor: '#ffc93c', baseXp: 95 },
  { id: 'm3', name: 'Ana P.', avatarEmoji: '🐼', avatarColor: '#1ec9a4', baseXp: 70 },
  { id: 'm4', name: 'Rui F.', avatarEmoji: '🐶', avatarColor: '#8b5cf6', baseXp: 45 },
  { id: 'm5', name: 'Marta L.', avatarEmoji: '🐨', avatarColor: '#3b7dff', baseXp: 20 },
];

function weekStartOf(d: Date): string {
  const date = new Date(d);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return date.toISOString().split('T')[0];
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

// PRNG determinístico simples (mulberry32) — a mesma semana produz sempre os
// mesmos valores, mas muda automaticamente quando a semana muda.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weeklyMockCompetitors(weekStart: string): Omit<LeaderboardEntry, 'isCurrentUser'>[] {
  const rand = mulberry32(hashSeed(weekStart));
  return MOCK_COMPETITOR_BASE.map((c) => ({
    id: c.id,
    name: c.name,
    avatarEmoji: c.avatarEmoji,
    avatarColor: c.avatarColor,
    xp: Math.round(c.baseXp + rand() * 80),
  }));
}

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const profile = await getProfile();
  const progress = await getProgress();
  const weekStart = weekStartOf(new Date());

  // O XP semanal só é válido se corresponder à semana atual — se o
  // utilizador não abre a app há mais de uma semana, mostra 0 até voltar
  // a ganhar XP (o que já dispara o reset em services/storage.ts).
  const myWeeklyXp = progress.weekStartDate === weekStart ? progress.weeklyXp : 0;

  const me: LeaderboardEntry = {
    id: 'me',
    name: profile.displayName || 'Tu',
    avatarEmoji: profile.avatarEmoji || '🎯',
    avatarColor: profile.avatarColor || '#3b7dff',
    xp: myWeeklyXp,
    isCurrentUser: true,
  };

  const all: LeaderboardEntry[] = [
    ...weeklyMockCompetitors(weekStart).map((c) => ({ ...c, isCurrentUser: false })),
    me,
  ];

  return all.sort((a, b) => b.xp - a.xp);
}
