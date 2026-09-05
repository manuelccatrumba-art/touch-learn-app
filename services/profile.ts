import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

const KEY = '@et:profile';

export interface UserProfile {
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  goal: string;
  placementDone: boolean;
}

export const AVATAR_EMOJIS = [
  '🦁', '🐯', '🐼', '🦊', '🐨', '🐸',
  '🦉', '🐵', '🐶', '🐱', '🦄', '🐙',
  '🚀', '⭐', '🔥', '🎯', '🌟', '🎓',
];

// Ligadas aos tokens atuais de Colors.ts — antes eram hex soltos de uma
// paleta antiga (ink navy + dourado), por isso escolher uma cor de avatar
// não combinava em nada com a identidade visual atual da app.
export const AVATAR_COLORS = [
  Colors.primary, Colors.purple, Colors.teal, Colors.orange,
  Colors.coral, Colors.gold, Colors.primaryLight, Colors.tealDark,
];

export const GOALS = [
  { id: 'travel', label: 'Viajar pelo mundo', emoji: '✈️' },
  { id: 'work', label: 'Crescer na carreira', emoji: '💼' },
  { id: 'study', label: 'Estudar no estrangeiro', emoji: '🎓' },
  { id: 'movies', label: 'Entender filmes e músicas', emoji: '🎬' },
  { id: 'confidence', label: 'Ganhar confiança para falar', emoji: '💬' },
  { id: 'exam', label: 'Passar num exame de inglês', emoji: '📝' },
];

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  avatarEmoji: '🦁',
  avatarColor: Colors.primary,
  goal: '',
  placementDone: false,
};

export async function getProfile(): Promise<UserProfile> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
}

export async function updateProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
  const current = await getProfile();
  const updated = { ...current, ...partial };
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
