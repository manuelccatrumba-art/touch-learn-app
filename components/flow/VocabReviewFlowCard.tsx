import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FlashCard as FlashCardType, FlashCardCategory } from '../../types';
import { getFlashcards, updateFlashcard, incrementProgress, addXP } from '../../services/storage';
import { applySpacedRepetition, getNextReviewLabel } from '../../utils/spacedRepetition';
import FlashCardComponent from '../FlashCard';

interface Props {
  category?: FlashCardCategory;
  resolved: boolean;
  onResolved: () => void;
}

const BATCH_SIZE = 5;

export default function VocabReviewFlowCard({ category, resolved, onResolved }: Props) {
  const [cards, setCards] = useState<FlashCardType[] | null>(null);
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(resolved);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    if (resolved) return;
    getFlashcards().then((all) => {
      const now = Date.now();
      const pool = all
        .filter((c) => (category ? c.category === category : true))
        .filter((c) => c.nextReview <= now)
        .slice(0, BATCH_SIZE);
      setCards(pool);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGrade(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    if (!cards) return;
    const card = cards[index];
    const updated = applySpacedRepetition(card, { quality });
    await updateFlashcard(updated);
    const isLearned = updated.repetitions >= 3;
    await incrementProgress({ flashcardsReviewed: 1, flashcardsLearned: isLearned ? 1 : 0 });
    await addXP(quality >= 3 ? 10 : 3);
    setReviewedCount((c) => c + 1);

    if (index + 1 < cards.length) {
      setIndex(index + 1);
    } else {
      setDone(true);
      onResolved();
    }
  }

  if (done) {
    return (
      <View style={[styles.summaryCard]}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.summaryText}>Revisão concluída — {reviewedCount || ''} cards</Text>
      </View>
    );
  }

  if (!cards) return null;

  if (cards.length === 0) {
    return (
      <View style={styles.summaryCard}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.summaryText}>Sem cards pendentes agora — bom trabalho!</Text>
      </View>
    );
  }

  const card = cards[index];

  return (
    <View style={styles.wrap}>
      <Text style={styles.header}>Revisão de vocabulário · {index + 1}/{cards.length}</Text>
      <FlashCardComponent card={card} onGrade={handleGrade} />
      <Text style={styles.hint}>{getNextReviewLabel(card)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8, gap: 10 },
  header: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', marginLeft: 32 },
  hint: { color: Colors.textMuted, textAlign: 'center', fontSize: 11 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    opacity: 0.85,
  },
  summaryText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
});
