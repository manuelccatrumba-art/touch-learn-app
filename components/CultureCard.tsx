import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { CultureNugget, CULTURE_TYPE_LABELS } from '../constants/culture';
import { speakEnglish } from '../services/speech';

interface Props {
  nugget: CultureNugget;
}

export default function CultureCard({ nugget }: Props) {
  const [open, setOpen] = useState(false);
  const meta = CULTURE_TYPE_LABELS[nugget.type];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: meta.color }]}
      onPress={() => setOpen(!open)}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={[styles.typeChip, { backgroundColor: meta.color + '22' }]}>
          <Text style={[styles.typeChipText, { color: meta.color }]}>{meta.emoji} {meta.title}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{nugget.level}</Text>
        </View>
      </View>

      <View style={styles.phraseRow}>
        <Text style={styles.phrase}>{nugget.phrase}</Text>
        <TouchableOpacity
          style={styles.listenBtn}
          onPress={() => speakEnglish(nugget.phrase, {
            onError: (msg) => Alert.alert('Não consegui falar', msg),
          })}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="volume-high" size={17} color={meta.color} />
        </TouchableOpacity>
      </View>

      {nugget.source && <Text style={styles.source}>— {nugget.source}</Text>}

      {open ? (
        <Animated.View entering={FadeIn.duration(180)} style={styles.reveal}>
          <Text style={styles.translation}>{nugget.translation}</Text>
          <Text style={styles.explanation}>{nugget.explanation}</Text>
        </Animated.View>
      ) : (
        <View style={styles.hintRow}>
          <Text style={styles.hint}>Toca para ver o significado</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  typeChipText: { fontSize: 11, fontWeight: '700' },
  levelBadge: {
    backgroundColor: Colors.primaryDeep,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelBadgeText: { color: Colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  phraseRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  phrase: { flex: 1, color: Colors.text, fontSize: 19, fontWeight: '700', lineHeight: 25 },
  listenBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  source: { color: Colors.textMuted, fontSize: 12, fontStyle: 'italic', marginTop: 4 },

  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  hint: { color: Colors.textMuted, fontSize: 11 },

  reveal: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  translation: { color: Colors.primaryLight, fontSize: 15, fontWeight: '700', marginBottom: 6 },
  explanation: { color: Colors.textSecondary, fontSize: 13.5, lineHeight: 20 },
});
