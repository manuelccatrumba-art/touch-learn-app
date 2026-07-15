import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashCard as FlashCardType } from '../types';
import { Colors } from '../constants/Colors';
import { CATEGORY_LABELS } from '../constants/bookContent';
import { speakEnglish } from '../services/speech';

interface Props {
  card: FlashCardType;
  onGrade: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

export default function FlashCard({ card, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const category = CATEGORY_LABELS[card.category];

  const flip = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      {/* Card */}
      <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.cardContainer}>
        {/* Front */}
        <Animated.View
          style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}
        >
          <View style={[styles.categoryBadge, { backgroundColor: category?.color ?? Colors.primary }]}>
            <Text style={styles.categoryText}>
              {category?.emoji} {category?.title}
            </Text>
          </View>
          <Text style={styles.portuguese}>{card.portuguese}</Text>
          <Text style={styles.hint}>Toque para ver a tradução</Text>
        </Animated.View>

        {/* Back */}
        <Animated.View
          style={[
            styles.card,
            styles.cardBack,
            { transform: [{ rotateY: backInterpolate }] },
          ]}
        >
          <View style={styles.englishRow}>
            <Text style={styles.english}>{card.english}</Text>
            <TouchableOpacity
              style={styles.listenBtn}
              onPress={() => speakEnglish(card.english)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="volume-high" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          {card.usage && (
            <View style={styles.usageBox}>
              <Text style={styles.usageLabel}>Uso:</Text>
              <Text style={styles.usageText}>{card.usage}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Rating buttons (only when flipped) */}
      {flipped && (
        <View style={styles.gradeRow}>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnBad]}
            onPress={() => { setFlipped(false); flipAnim.setValue(0); onGrade(1); }}
          >
            <Text style={styles.gradeBtnText}>Não lembrei</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnOk]}
            onPress={() => { setFlipped(false); flipAnim.setValue(0); onGrade(3); }}
          >
            <Text style={styles.gradeBtnText}>Mais ou menos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnGood]}
            onPress={() => { setFlipped(false); flipAnim.setValue(0); onGrade(5); }}
          >
            <Text style={styles.gradeBtnText}>Fácil!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingHorizontal: 20 },
  cardContainer: { width: '100%', height: 260 },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFront: { backgroundColor: Colors.card },
  cardBack: { backgroundColor: Colors.primaryDark },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  portuguese: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
  hint: { position: 'absolute', bottom: 16, color: Colors.textMuted, fontSize: 12 },
  englishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  english: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  listenBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usageBox: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginTop: 8,
  },
  usageLabel: { color: Colors.primaryLight, fontSize: 11, fontWeight: '600', marginBottom: 2 },
  usageText: { color: Colors.text, fontSize: 13, lineHeight: 18 },
  gradeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 4,
  },
  gradeBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  gradeBtnBad: { backgroundColor: Colors.error },
  gradeBtnOk: { backgroundColor: Colors.warning },
  gradeBtnGood: { backgroundColor: Colors.success },
  gradeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 12 },
});
