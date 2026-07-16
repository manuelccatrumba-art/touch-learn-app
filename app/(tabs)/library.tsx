import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LibraryScreen() {
  const [segment, setSegment] = useState<Segment>('grammar');
  const [level, setLevel] = useState<CEFRLevel | 'all'>('all');

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <View style={styles.pillRow}>
            {SEGMENTS.map((s) => {
              const active = s.id === segment;
              const meta = SEGMENT_ICONS[s.id];
              return (
                <Pressable
                  key={s.id}
                  style={({ pressed }) => [styles.pillWrap, pressed && { transform: [{ scale: 0.97 }] }]}
                  onPress={() => setSegment(s.id)}
                >
                  {active ? (
                    <LinearGradient
                      colors={Colors.gradientHero}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.pill}
                    >
                      <IconBadge name={meta.icon} color={Colors.background} size={14} badgeSize={22} shape="circle" />
                      <Text style={styles.pillTextActive}>{s.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.pill}>
                      <IconBadge name={meta.icon} color={meta.color} size={14} badgeSize={22} shape="circle" />
                      <Text style={styles.pillText}>{s.label}</Text>
                    </View>
                  )}
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

  pillRow: { flexDirection: 'row', gap: 8 },
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
