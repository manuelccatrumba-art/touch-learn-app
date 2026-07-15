import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, FlashCard, UserProgress } from '../types';
import { FLASHCARD_DATA } from '../constants/bookContent';

const KEYS = {
  CONVERSATIONS: '@et:conversations',
  ACTIVE_CONVERSATION: '@et:active_conversation',
  FLASHCARDS: '@et:flashcards',
  PROGRESS: '@et:progress',
} as const;

// ── Conversations ──────────────────────────────────────────────────────────────

export async function saveConversation(conversation: Conversation): Promise<void> {
  const existing = await getAllConversations();
  const idx = existing.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    existing[idx] = conversation;
  } else {
    existing.unshift(conversation);
  }
  await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(existing.slice(0, 50)));
}

export async function getAllConversations(): Promise<Conversation[]> {
  const raw = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
  return raw ? JSON.parse(raw) : [];
}

export async function getActiveConversation(): Promise<Conversation | null> {
  const raw = await AsyncStorage.getItem(KEYS.ACTIVE_CONVERSATION);
  return raw ? JSON.parse(raw) : null;
}

export async function setActiveConversation(conversation: Conversation): Promise<void> {
  await AsyncStorage.setItem(KEYS.ACTIVE_CONVERSATION, JSON.stringify(conversation));
}

export async function clearActiveConversation(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.ACTIVE_CONVERSATION);
}

// ── Flashcards ─────────────────────────────────────────────────────────────────

function buildInitialFlashcards(): FlashCard[] {
  const now = Date.now();
  return FLASHCARD_DATA.map((card) => ({
    ...card,
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: now,
    lastReview: undefined,
  }));
}

export async function getFlashcards(): Promise<FlashCard[]> {
  const raw = await AsyncStorage.getItem(KEYS.FLASHCARDS);
  if (!raw) {
    const initial = buildInitialFlashcards();
    await AsyncStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(raw);
}

export async function updateFlashcard(updated: FlashCard): Promise<void> {
  const cards = await getFlashcards();
  const idx = cards.findIndex((c) => c.id === updated.id);
  if (idx >= 0) {
    cards[idx] = updated;
    await AsyncStorage.setItem(KEYS.FLASHCARDS, JSON.stringify(cards));
  }
}

export async function getDueFlashcards(limit = 20): Promise<FlashCard[]> {
  const cards = await getFlashcards();
  const now = Date.now();
  return cards.filter((c) => c.nextReview <= now).slice(0, limit);
}

// ── Progress ───────────────────────────────────────────────────────────────────

const DEFAULT_PROGRESS: UserProgress = {
  totalMessages: 0,
  exercisesCompleted: 0,
  exercisesCorrect: 0,
  flashcardsReviewed: 0,
  flashcardsLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  achievements: [],
  xp: 0,
  level: 1,
};

export async function getProgress(): Promise<UserProgress> {
  const raw = await AsyncStorage.getItem(KEYS.PROGRESS);
  return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS };
}

type IncrementableField = 'totalMessages' | 'exercisesCompleted' | 'exercisesCorrect' | 'flashcardsReviewed' | 'flashcardsLearned';

export async function incrementProgress(delta: Partial<Record<IncrementableField, number>>): Promise<UserProgress> {
  const current = await getProgress();
  const patch: Partial<UserProgress> = {};
  (Object.keys(delta) as IncrementableField[]).forEach((key) => {
    (patch as Record<string, number>)[key] = (current[key] as number) + (delta[key] ?? 0);
  });
  return updateProgress(patch);
}

export async function updateProgress(partial: Partial<UserProgress>): Promise<UserProgress> {
  const current = await getProgress();
  const updated = { ...current, ...partial };

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  if (updated.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (updated.lastActiveDate === yesterday) {
      updated.currentStreak += 1;
    } else if (updated.lastActiveDate !== today) {
      updated.currentStreak = 1;
    }
    updated.longestStreak = Math.max(updated.currentStreak, updated.longestStreak);
    updated.lastActiveDate = today;

    // Weekly activity (0 = Sunday)
    const dayOfWeek = new Date().getDay();
    const weekly = [...updated.weeklyActivity];
    weekly[dayOfWeek] = (weekly[dayOfWeek] ?? 0) + 1;
    updated.weeklyActivity = weekly;
  }

  // Level up: every 100 XP
  updated.level = Math.floor(updated.xp / 100) + 1;

  // Check achievements
  updated.achievements = checkAchievements(updated);

  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(updated));
  return updated;
}

export async function addXP(amount: number): Promise<UserProgress> {
  const current = await getProgress();
  return updateProgress({ xp: current.xp + amount });
}

function checkAchievements(progress: UserProgress): string[] {
  const achievements = new Set(progress.achievements);

  if (progress.totalMessages >= 1) achievements.add('first_message');
  if (progress.totalMessages >= 50) achievements.add('chatterbox');
  if (progress.totalMessages >= 200) achievements.add('fluent_speaker');
  if (progress.exercisesCompleted >= 10) achievements.add('grammar_student');
  if (progress.exercisesCompleted >= 50) achievements.add('grammar_master');
  if (progress.flashcardsReviewed >= 20) achievements.add('vocabulary_builder');
  if (progress.flashcardsLearned >= 50) achievements.add('word_collector');
  if (progress.currentStreak >= 7) achievements.add('week_warrior');
  if (progress.currentStreak >= 30) achievements.add('monthly_champion');
  if (progress.xp >= 500) achievements.add('dedicated_learner');

  return Array.from(achievements);
}

export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
