import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CEFRLevel, FlashCard as FlashCardType, FlashCardCategory } from '../../types';
import { Colors } from '../../constants/Colors';
import { CATEGORY_LABELS } from '../../constants/bookContent';
import {
  getFlashcards,
  updateFlashcard,
  incrementProgress,
  addXP,
} from '../../services/storage';
import {
  applySpacedRepetition,
  getDueCount,
  getCardStatus,
  getNextReviewLabel,
} from '../../utils/spacedRepetition';
import { markNodeComplete } from '../../services/pathProgress';
import { LEARNING_PATH } from '../../constants/path';
import FlashCardComponent from '../../components/FlashCard';
import LessonCompleteModal from '../../components/LessonCompleteModal';
import FadeEdgeScrollView from '../../components/FadeEdgeScrollView';

type Screen = 'home' | 'session';

interface Props {
  level?: CEFRLevel | 'all'; // controlado pela Biblioteca; sem filtro adicional quando não fornecido
}

export default function VocabularyScreen({ level }: Props) {
  const params = useLocalSearchParams<{ category?: string; autostart?: string }>();
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('home');
  const [cards, setCards] = useState<FlashCardType[]>([]);
  const [sessionCards, setSessionCards] = useState<FlashCardType[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FlashCardCategory | 'all'>('all');
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, learned: 0 });
  const [pathCheckpointId, setPathCheckpointId] = useState<string | null>(null);
  const [sessionXP, setSessionXP] = useState(0);
  const [celebration, setCelebration] = useState<{ xp: number; next: { title: string; icon: string } | null } | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, []),
  );

  useEffect(() => {
    if (!params.category || !params.autostart || cards.length === 0) return;
    const category = params.category as FlashCardCategory;
    setSelectedCategory(category);
    const pool = cards.filter((c) => c.category === category);
    if (pool.length === 0) return;
    setSessionCards(pool.slice(0, 20));
    setCardIndex(0);
    setSessionStats({ reviewed: 0, learned: 0 });
    setSessionXP(0);
    setPathCheckpointId(`vocab-${category}`);
    setScreen('session');
  }, [params.category, params.autostart, cards]);

  async function loadCards() {
    setLoading(true);
    const all = await getFlashcards();
    setCards(all);
    setLoading(false);
  }

  const filteredCards = cards
    .filter((c) => selectedCategory === 'all' || c.category === selectedCategory)
    .filter((c) => !level || level === 'all' || CATEGORY_LABELS[c.category].level === level);

  const now = Date.now();
  const THREE_DAYS_MS = 3 * 86400000;
  const dueCards = filteredCards.filter((c) => c.nextReview <= now);
  const soonCards = filteredCards.filter((c) => c.nextReview > now && c.nextReview <= now + THREE_DAYS_MS);
  const consolidatedCards = filteredCards.filter((c) => c.nextReview > now + THREE_DAYS_MS);

  function startSession(all = false) {
    const pool = all ? filteredCards : dueCards;
    if (pool.length === 0) return;
    setSessionCards(pool.slice(0, 20));
    setCardIndex(0);
    setSessionStats({ reviewed: 0, learned: 0 });
    setSessionXP(0);
    setPathCheckpointId(null);
    setScreen('session');
  }

  async function handleGrade(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    const card = sessionCards[cardIndex];
    const updated = applySpacedRepetition(card, { quality });
    await updateFlashcard(updated);

    const isLearned = updated.repetitions >= 3;
    const cardXP = quality >= 3 ? 10 : 3;
    setSessionStats((s) => ({
      reviewed: s.reviewed + 1,
      learned: s.learned + (isLearned ? 1 : 0),
    }));
    await addXP(cardXP);
    await incrementProgress({ flashcardsReviewed: 1, flashcardsLearned: isLearned ? 1 : 0 });

    if (cardIndex + 1 < sessionCards.length) {
      setCardIndex(cardIndex + 1);
      setSessionXP((xp) => xp + cardXP);
    } else {
      const totalXP = sessionXP + cardXP;
      if (pathCheckpointId) {
        await markNodeComplete(pathCheckpointId);
        const idx = LEARNING_PATH.findIndex((n) => n.id === pathCheckpointId);
        const next = idx >= 0 && idx + 1 < LEARNING_PATH.length ? LEARNING_PATH[idx + 1] : null;
        setCelebration({ xp: totalXP, next: next ? { title: next.title, icon: next.icon } : null });
      }
      setScreen('home');
      await loadCards();
    }
  }

  const categories = Object.keys(CATEGORY_LABELS) as FlashCardCategory[];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (screen === 'session') {
    const card = sessionCards[cardIndex];
    if (!card) return null;
    const progress = cardIndex / sessionCards.length;

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.sessionHeader}>
          <TouchableOpacity
            onPress={() => { setScreen('home'); loadCards(); }}
            style={styles.closeBtn}
          >
            <Text style={styles.sessionClose}>✕</Text>
          </TouchableOpacity>
          <View style={styles.sessionMeta}>
            <Text style={styles.sessionProg}>
              {cardIndex + 1} / {sessionCards.length}
            </Text>
            <Text style={styles.sessionStats}>
              ✅ {sessionStats.reviewed}
            </Text>
          </View>
        </View>
        <View style={styles.sessionProgressBg}>
          <View
            style={[
              styles.sessionProgressFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
        <View style={styles.sessionCardWrapper}>
          <FlashCardComponent card={card} onGrade={handleGrade} />
        </View>
        <Text style={styles.nextReviewHint}>{getNextReviewLabel(card)}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header with brand accent */}
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Vocabulário</Text>
            <Text style={styles.headerSub}>{cards.length} expressões do livro</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>FC</Text>
          </View>
        </View>
      </View>

      {/* Buckets de urgência de revisão (spaced repetition) */}
      <View style={styles.urgencyRow}>
        <View style={[styles.urgencyBox, { borderColor: Colors.error + '55' }]}>
          <Text style={[styles.urgencyCount, { color: Colors.error }]}>{dueCards.length}</Text>
          <Text style={styles.urgencyLabel}>Urgentes</Text>
        </View>
        <View style={[styles.urgencyBox, { borderColor: Colors.primary + '55' }]}>
          <Text style={[styles.urgencyCount, { color: Colors.primary }]}>{soonCards.length}</Text>
          <Text style={styles.urgencyLabel}>Em breve</Text>
        </View>
        <View style={[styles.urgencyBox, { borderColor: Colors.success + '55' }]}>
          <Text style={[styles.urgencyCount, { color: Colors.success }]}>{consolidatedCards.length}</Text>
          <Text style={styles.urgencyLabel}>Consolidados</Text>
        </View>
      </View>

      {dueCards.length > 0 && (
        <TouchableOpacity style={styles.dueBanner} onPress={() => startSession(false)}>
          <View style={styles.dueBannerLeft}>
            <Text style={styles.dueBannerIcon}>🔔</Text>
            <View>
              <Text style={styles.dueBannerTitle}>
                Rever os {dueCards.length} urgente{dueCards.length !== 1 ? 's' : ''}
              </Text>
              <Text style={styles.dueBannerSub}>Prioridade: nunca revistos ou vencidos primeiro</Text>
            </View>
          </View>
          <View style={styles.dueBannerArrow}>
            <Text style={styles.dueBannerArrowText}>→</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Category filter */}
      <FadeEdgeScrollView
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextActive]}>
            🗂 Tudo ({cards.length})
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const label = CATEGORY_LABELS[cat];
          const count = cards.filter((c) => c.category === cat).length;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                {label.emoji} {label.title} · {label.level} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </FadeEdgeScrollView>

      {/* Card list */}
      <ScrollView contentContainerStyle={styles.cardList}>
        {filteredCards.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>Nenhum card nesta categoria.</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.studyAllBtn}
              onPress={() => startSession(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.studyAllText}>
                Estudar todos ({filteredCards.length}) →
              </Text>
            </TouchableOpacity>
            {filteredCards.map((card) => {
              const status = getCardStatus(card);
              const statusColor =
                status === 'learned' ? Colors.success :
                status === 'review' ? Colors.warning :
                status === 'learning' ? Colors.primary :
                Colors.textMuted;
              const statusEmoji =
                status === 'learned' ? '✅' :
                status === 'review' ? '🔄' :
                status === 'learning' ? '📖' : '🆕';
              return (
                <View key={card.id} style={styles.cardRow}>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  <View style={styles.cardRowText}>
                    <Text style={styles.cardPt}>{card.portuguese}</Text>
                    <Text style={styles.cardEn}>{card.english}</Text>
                  </View>
                  <Text style={styles.cardStatus}>{statusEmoji}</Text>
                </View>
              );
            })}
          </>
        )}
        <View style={styles.bottomPad} />
      </ScrollView>

      <LessonCompleteModal
        visible={!!celebration}
        xp={celebration?.xp ?? 0}
        nextNode={celebration?.next ?? null}
        onContinue={() => {
          setCelebration(null);
          router.push('/trail');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { alignItems: 'center', justifyContent: 'center' },

  header: {
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  headerAccent: {
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  headerSub: { color: Colors.textSecondary, fontSize: 13, marginTop: 2 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 13, letterSpacing: 1 },

  urgencyRow: { flexDirection: 'row', gap: 10, marginHorizontal: 14, marginTop: 4 },
  urgencyBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  urgencyCount: { fontSize: 20, fontWeight: '800' },
  urgencyLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

  dueBanner: {
    margin: 14,
    backgroundColor: Colors.primaryDeep,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  dueBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dueBannerIcon: { fontSize: 24 },
  dueBannerTitle: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  dueBannerSub: { color: Colors.primaryLight, fontSize: 11, marginTop: 2 },
  dueBannerArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueBannerArrowText: { color: Colors.white, fontSize: 18, fontWeight: '700' },

  filterScroll: { maxHeight: 52, flexGrow: 0 },
  filterContent: { paddingLeft: 14, paddingRight: 28, gap: 8, alignItems: 'center', paddingBottom: 4 },
  filterChip: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: { color: Colors.textSecondary, fontSize: 13 },
  filterChipTextActive: { color: Colors.white, fontWeight: '700' },

  cardList: { padding: 14, gap: 8 },
  studyAllBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  studyAllText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  cardRow: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  cardRowText: { flex: 1 },
  cardPt: { color: Colors.text, fontSize: 14, fontWeight: '600' },
  cardEn: { color: Colors.textSecondary, fontSize: 13, marginTop: 1 },
  cardStatus: { fontSize: 18 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },

  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionClose: { color: Colors.textSecondary, fontSize: 16, fontWeight: '700' },
  sessionMeta: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  sessionProg: { color: Colors.text, fontWeight: '700' },
  sessionStats: { color: Colors.success, fontSize: 13, fontWeight: '600' },
  sessionProgressBg: { height: 3, backgroundColor: Colors.border },
  sessionProgressFill: {
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionCardWrapper: { flex: 1, justifyContent: 'center', paddingTop: 20 },
  nextReviewHint: {
    color: Colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 20,
  },
  bottomPad: { height: 24 },
});
