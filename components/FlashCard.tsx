import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { FlashCard as FlashCardType } from '../types';
import { Colors } from '../constants/Colors';
import { CATEGORY_LABELS } from '../constants/bookContent';
import { speakEnglish } from '../services/speech';
import ParticleBurst from './ParticleBurst';

interface Props {
  card: FlashCardType;
  onGrade: (quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
}

const SWIPE_THRESHOLD = 90;

export default function FlashCard({ card, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const translateX = useSharedValue(0);
  const [burst, setBurst] = useState(0);

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

  function grade(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    translateX.value = 0;
    setFlipped(false);
    flipAnim.setValue(0);
    if (quality >= 3) setBurst((b) => b + 1);
    onGrade(quality);
  }

  const panGesture = Gesture.Pan()
    .enabled(flipped)
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const projected = e.translationX + e.velocityX * 0.15;
      if (Math.abs(projected) > SWIPE_THRESHOLD) {
        const direction = projected > 0 ? 1 : -1;
        translateX.value = withTiming(direction * 500, { duration: 220 }, (finished) => {
          if (finished) runOnJS(grade)(direction > 0 ? 5 : 1);
        });
      } else {
        translateX.value = withSpring(0, { damping: 8, stiffness: 180 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      {
        rotate: `${interpolate(translateX.value, [-200, 200], [-12, 12], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [10, 80], [0, 1], Extrapolation.CLAMP),
  }));
  const leftHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-80, -10], [1, 0], Extrapolation.CLAMP),
  }));

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
      <ParticleBurst trigger={burst} />
      {/* Card */}
      <GestureDetector gesture={panGesture}>
        <Reanimated.View style={[styles.cardContainer, animatedCardStyle]}>
          <TouchableOpacity onPress={flip} activeOpacity={0.9} style={styles.cardTouchable}>
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
              <Reanimated.View style={[styles.swipeHint, styles.swipeHintRight, rightHintStyle]}>
                <Text style={styles.swipeHintText}>JÁ SEI</Text>
              </Reanimated.View>
              <Reanimated.View style={[styles.swipeHint, styles.swipeHintLeft, leftHintStyle]}>
                <Text style={styles.swipeHintText}>REVER</Text>
              </Reanimated.View>

              <View style={styles.englishRow}>
                <Text style={styles.english}>{card.english}</Text>
                <TouchableOpacity
                  style={styles.listenBtn}
                  onPress={() => speakEnglish(card.english, {
                    onError: (msg) => Alert.alert('Não consegui falar', msg),
                  })}
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
              <Text style={styles.swipeGuide}>Arrasta ← rever · já sei →</Text>
            </Animated.View>
          </TouchableOpacity>
        </Reanimated.View>
      </GestureDetector>

      {/* Rating buttons (only when flipped) */}
      {flipped && (
        <View style={styles.gradeRow}>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnBad]}
            onPress={() => grade(1)}
          >
            <Text style={styles.gradeBtnText}>Não lembrei</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnOk]}
            onPress={() => grade(3)}
          >
            <Text style={styles.gradeBtnText}>Mais ou menos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gradeBtn, styles.gradeBtnGood]}
            onPress={() => grade(5)}
          >
            <Text style={styles.gradeBtnText}>Fácil!</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingHorizontal: 20, position: 'relative' },
  cardContainer: { width: '100%', height: 260 },
  cardTouchable: { width: '100%', height: '100%' },
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
  swipeHint: {
    position: 'absolute',
    top: 18,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    transform: [{ rotate: '-8deg' }],
  },
  swipeHintRight: { right: 18, borderColor: Colors.success, backgroundColor: Colors.success + '22' },
  swipeHintLeft: { left: 18, borderColor: Colors.coral, backgroundColor: Colors.coral + '22', transform: [{ rotate: '8deg' }] },
  swipeHintText: { color: Colors.white, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  swipeGuide: { position: 'absolute', bottom: 12, color: 'rgba(255,255,255,0.5)', fontSize: 10 },
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
