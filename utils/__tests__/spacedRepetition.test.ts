import { applySpacedRepetition, getCardStatus, getDueCount } from '../spacedRepetition';
import { FlashCard } from '../../types';

function makeCard(overrides: Partial<FlashCard> = {}): FlashCard {
  return {
    id: 'c1',
    portuguese: 'Olá',
    english: 'Hello',
    category: 'greetings',
    interval: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReview: Date.now(),
    ...overrides,
  };
}

describe('applySpacedRepetition (SM-2)', () => {
  it('sets interval to 1 day on the first correct answer', () => {
    const result = applySpacedRepetition(makeCard(), { quality: 4 });
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it('sets interval to 6 days on the second correct answer', () => {
    const card = makeCard({ repetitions: 1, interval: 1 });
    const result = applySpacedRepetition(card, { quality: 4 });
    expect(result.interval).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  it('multiplies interval by ease factor from the third correct answer onward', () => {
    const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5 });
    const result = applySpacedRepetition(card, { quality: 5 });
    expect(result.interval).toBe(Math.round(6 * 2.5));
  });

  it('resets repetitions and interval on an incorrect answer', () => {
    const card = makeCard({ repetitions: 4, interval: 30 });
    const result = applySpacedRepetition(card, { quality: 1 });
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it('never lets the ease factor drop below 1.3', () => {
    let card = makeCard();
    for (let i = 0; i < 10; i++) {
      card = applySpacedRepetition(card, { quality: 0 });
    }
    expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('pushes nextReview into the future', () => {
    const result = applySpacedRepetition(makeCard(), { quality: 4 });
    expect(result.nextReview).toBeGreaterThan(Date.now());
  });
});

describe('getCardStatus', () => {
  it('is "new" for a card never reviewed', () => {
    expect(getCardStatus(makeCard({ repetitions: 0 }))).toBe('new');
  });

  it('is "learning" for a card with 1-2 repetitions', () => {
    expect(getCardStatus(makeCard({ repetitions: 2 }))).toBe('learning');
  });

  it('is "learned" once repetitions >= 3 and interval >= 21', () => {
    expect(getCardStatus(makeCard({ repetitions: 3, interval: 21 }))).toBe('learned');
  });

  it('is "review" when repetitions >= 3 but interval is still short', () => {
    expect(getCardStatus(makeCard({ repetitions: 3, interval: 6 }))).toBe('review');
  });
});

describe('getDueCount', () => {
  it('counts only cards whose nextReview has already passed', () => {
    const now = Date.now();
    const cards = [
      makeCard({ id: 'a', nextReview: now - 1000 }),
      makeCard({ id: 'b', nextReview: now + 1000 * 60 * 60 }),
      makeCard({ id: 'c', nextReview: now - 5000 }),
    ];
    expect(getDueCount(cards)).toBe(2);
  });
});
