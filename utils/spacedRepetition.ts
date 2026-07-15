import { FlashCard, SpacedRepetitionGrade } from '../types';

// SM-2 (SuperMemo 2) algorithm
export function applySpacedRepetition(card: FlashCard, grade: SpacedRepetitionGrade): FlashCard {
  const q = grade.quality;
  const now = Date.now();

  let { interval, repetitions, easeFactor } = card;

  if (q >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02),
  );

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...card,
    interval,
    repetitions,
    easeFactor,
    nextReview,
    lastReview: now,
  };
}

export function isCardLearned(card: FlashCard): boolean {
  return card.repetitions >= 3 && card.interval >= 21;
}

export function getCardStatus(card: FlashCard): 'new' | 'learning' | 'review' | 'learned' {
  if (card.repetitions === 0) return 'new';
  if (card.repetitions <= 2) return 'learning';
  if (isCardLearned(card)) return 'learned';
  return 'review';
}

export function getDueCount(cards: FlashCard[]): number {
  const now = Date.now();
  return cards.filter((c) => c.nextReview <= now).length;
}

export function getNextReviewLabel(card: FlashCard): string {
  const now = Date.now();
  const diff = card.nextReview - now;

  if (diff <= 0) return 'Para revisar agora';

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `Em ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  if (hours < 24) return `Em ${hours} hora${hours !== 1 ? 's' : ''}`;
  return `Em ${days} dia${days !== 1 ? 's' : ''}`;
}
