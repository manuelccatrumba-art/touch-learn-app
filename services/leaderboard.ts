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

// Não há backend/contas multi-utilizador ainda — ranking mock local com
// alguns concorrentes fictícios de XP fixo, para o utilizador real (dados
// reais de services/profile + services/storage) se posicionar entre eles.
// Substituir por dados reais assim que existir backend com mais utilizadores.
const MOCK_COMPETITORS: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  { id: 'm1', name: 'Beatriz M.', avatarEmoji: '🦊', avatarColor: '#ff6b6b', xp: 420 },
  { id: 'm2', name: 'Carlos S.', avatarEmoji: '🐯', avatarColor: '#ffc93c', xp: 385 },
  { id: 'm3', name: 'Ana P.', avatarEmoji: '🐼', avatarColor: '#1ec9a4', xp: 310 },
  { id: 'm4', name: 'Rui F.', avatarEmoji: '🐶', avatarColor: '#8b5cf6', xp: 260 },
  { id: 'm5', name: 'Marta L.', avatarEmoji: '🐨', avatarColor: '#3b7dff', xp: 190 },
];

export async function getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
  const profile = await getProfile();
  const progress = await getProgress();

  const me: LeaderboardEntry = {
    id: 'me',
    name: profile.displayName || 'Tu',
    avatarEmoji: profile.avatarEmoji || '🎯',
    avatarColor: profile.avatarColor || '#3b7dff',
    xp: progress.xp,
    isCurrentUser: true,
  };

  const all: LeaderboardEntry[] = [
    ...MOCK_COMPETITORS.map((c) => ({ ...c, isCurrentUser: false })),
    me,
  ];

  return all.sort((a, b) => b.xp - a.xp);
}
