export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface FlashCard {
  id: string;
  portuguese: string;
  english: string;
  usage?: string;
  category: FlashCardCategory;
  example?: string;
  // Spaced repetition fields
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: number;
  lastReview?: number;
}

export type FlashCardCategory =
  | 'greetings'
  | 'compliments'
  | 'family'
  | 'relationships'
  | 'business'
  | 'travel'
  | 'emotions'
  | 'common'
  | 'food'
  | 'nightlife'
  | 'professional'
  | 'correspondence';

export interface GrammarExercise {
  id: string;
  noteId: string; // NL1-NL15
  noteTitle: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  tip?: string;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'correction'
  | 'translation';

export interface UserProgress {
  totalMessages: number;
  exercisesCompleted: number;
  exercisesCorrect: number;
  flashcardsReviewed: number;
  flashcardsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  weeklyActivity: number[];
  achievements: string[];
  xp: number;
  level: number;
}

export interface SpacedRepetitionGrade {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
}
