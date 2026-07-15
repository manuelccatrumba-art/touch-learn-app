import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@et:profile';

export interface UserProfile {
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  goal: string;
}

export const AVATAR_EMOJIS = [
  '🦁', '🐯', '🐼', '🦊', '🐨', '🐸',
  '🦉', '🐵', '🐶', '🐱', '🦄', '🐙',
  '🚀', '⭐', '🔥', '🎯', '🌟', '🎓',
];

export const AVATAR_COLORS = [
  '#E8A94C', '#5FA8D3', '#6FCF97', '#E5484D',
  '#B98CE0', '#F0C480', '#3D6E8F', '#C68A32',
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
  avatarColor: '#E8A94C',
  goal: '',
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
