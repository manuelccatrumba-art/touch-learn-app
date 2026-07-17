import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { SEGMENT_ICONS } from '../../constants/categoryIcons';
import { CEFRLevel } from '../../types';
import GrammarScreen from './grammar';
import VocabularyScreen from './vocabulary';
import CultureScreen from './culture';
import TutorFAB from '../../components/TutorFAB';
import IconBadge from '../../components/IconBadge';
import FadeEdgeScrollView from '../../components/FadeEdgeScrollView';

type Segment = 'grammar' | 'vocabulary' | 'culture';

const SEGMENTS: { id: Segment; label: string }[] = [
  { id: 'grammar', label: 'Gramática' },
  { id: 'vocabulary', label: 'Vocabulário' },
  { id: 'culture', label: 'Cultura' },
];
const GAP = 8;

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LibraryScreen() {
  const [segment, setSegment] = useState<Segment>('grammar');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');
  const [rowWidth, setRowWidth] = useState(0);

  const activeIndex = SEGMENTS.findIndex((s) => s.id === segment);
  const pillWidth = rowWidth > 0 ? (rowWidth - GAP * 2) / 3 : 0;
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    if (pillWidth > 0) {
      indicatorX.value = withSpring(activeIndex * (pillWidth + GAP), { damping: 16, stiffness: 160 });
    }
  }, [activeIndex, pillWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: pillWidth,
  }));

  function onRowLayout(e: LayoutChangeEvent) {
    setRowWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <View style={styles.pillRow} onLayout={onRowLayout}>
            {pillWidth > 0 && (
              <Reanimated.View style={[styles.pillIndicator, indicatorStyle]}>
                <LinearGradient
                  colors={Colors.gradientHero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pillIndicatorFill}
                />
              </Reanimated.View>
            )}
            {SEGMENTS.map((s) => {
              const active = s.id === segment;
              const meta = SEGMENT_ICONS[s.id];
              return (
                <Pressable
                  key={s.id}
                  style={({ pressed }) => [styles.pillWrap, pressed && { transform: [{ scale: 0.97 }] }]}
                  onPress={() => setSegment(s.id)}
                >
                  <View style={[styles.pill, active && styles.pillActive]}>
                    <IconBadge name={meta.icon} color={active ? Colors.background : meta.color} size={14} badgeSize={22} shape="circle" />
                    <Text style={active ? styles.pillTextActive : styles.pillText}>{s.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FadeEdgeScrollView style={styles.levelScroll} contentContainerStyle={styles.levelContent}>
          <TouchableOpacity
            style={[styles.levelChip, level === 'all' && styles.levelChipActive]}
            onPress={() => setLevel('all')}
          >
            <Text style={[styles.levelChipText, level === 'all' && styles.levelChipTextActive]}>Todos os níveis</Text>
          </TouchableOpacity>
          {LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[styles.levelChip, level === lvl && styles.levelChipActive]}
              onPress={() => setLevel(lvl)}
            >
              <Text style={[styles.levelChipText, level === lvl && styles.levelChipTextActive]}>{lvl}</Text>
            </TouchableOpacity>
          ))}
        </FadeEdgeScrollView>
      </SafeAreaView>

      <View style={styles.body}>
        {segment === 'grammar' && <GrammarScreen level={level} />}
        {segment === 'vocabulary' && <VocabularyScreen level={level} />}
        {segment === 'culture' && <CultureScreen level={level} />}
      </View>

      <TutorFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  safe: { backgroundColor: Colors.background },
  body: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
  },
  headerTitle: { color: Colors.text, fontSize: 26, fontWeight: '800', marginBottom: 12 },

  pillRow: { flexDirection: 'row', gap: GAP, position: 'relative' },
  pillIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  pillIndicatorFill: { flex: 1 },
  pillWrap: { flex: 1 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 9,
  },
  pillActive: { backgroundColor: 'transparent' },
  pillText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },
  pillTextActive: { color: Colors.background, fontSize: 13, fontWeight: '800' },

  levelScroll: { maxHeight: 44, flexGrow: 0, marginTop: 4 },
  levelContent: { paddingLeft: 20, paddingRight: 32, gap: 8, alignItems: 'center', paddingBottom: 10 },
  levelChip: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelChipActive: { backgroundColor: Colors.primaryDeep, borderColor: Colors.gold },
  levelChipText: { color: Colors.textMuted, fontSize: 11, fontWeight: '700' },
  levelChipTextActive: { color: Colors.gold },
});
