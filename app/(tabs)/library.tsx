import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import GrammarScreen from './grammar';
import VocabularyScreen from './vocabulary';
import CultureScreen from './culture';
import TutorFAB from '../../components/TutorFAB';

type Segment = 'grammar' | 'vocabulary' | 'culture';

const SEGMENTS: { id: Segment; label: string }[] = [
  { id: 'grammar', label: 'Gramática' },
  { id: 'vocabulary', label: 'Vocabulário' },
  { id: 'culture', label: 'Cultura' },
];

export default function LibraryScreen() {
  const [segment, setSegment] = useState<Segment>('grammar');

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <View style={styles.pillRow}>
            {SEGMENTS.map((s) => {
              const active = s.id === segment;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setSegment(s.id)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.body}>
        {segment === 'grammar' && <GrammarScreen />}
        {segment === 'vocabulary' && <VocabularyScreen />}
        {segment === 'culture' && <CultureScreen />}
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
  pill: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '700' },
  pillTextActive: { color: Colors.white },
});
