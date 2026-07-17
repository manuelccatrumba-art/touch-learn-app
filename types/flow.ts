import { Message } from './index';

export type FlowItemType =
  | 'tutor_message'
  | 'user_message'
  | 'grammar_card'
  | 'vocab_review_card'
  | 'daily_phrase_card'
  | 'progress_card';

interface FlowItemBase {
  id: string;
  type: FlowItemType;
  timestamp: number;
}

export interface TutorMessageItem extends FlowItemBase {
  type: 'tutor_message';
  message: Message;
}

export interface UserMessageItem extends FlowItemBase {
  type: 'user_message';
  message: Message;
}

export interface GrammarCardItem extends FlowItemBase {
  type: 'grammar_card';
  noteId: string;
  resolved: boolean;
}

export interface VocabReviewCardItem extends FlowItemBase {
  type: 'vocab_review_card';
  category?: string; // undefined = due cards across all categories
  resolved: boolean;
}

export interface DailyPhraseCardItem extends FlowItemBase {
  type: 'daily_phrase_card';
  nuggetId: string;
}

export interface ProgressCardItem extends FlowItemBase {
  type: 'progress_card';
}

export type FlowItem =
  | TutorMessageItem
  | UserMessageItem
  | GrammarCardItem
  | VocabReviewCardItem
  | DailyPhraseCardItem
  | ProgressCardItem;
