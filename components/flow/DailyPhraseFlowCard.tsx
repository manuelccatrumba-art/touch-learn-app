import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { CULTURE_NUGGETS } from '../../constants/culture';

interface Props {
  nuggetId: string;
  onPractice: (phrase: string, translation: string) => void;
}

export default function DailyPhraseFlowCard({ nuggetId, onPractice }: Props) {
  const nugget = CULTURE_NUGGETS.find((n) => n.id === nuggetId);
  if (!nugget) return null;

  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <Ionicons name="book" size={16} color={Colors.background} />
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Frase do dia · {nugget.level}</Text>
        <Text style={styles.phrase} numberOfLines={1}>{nugget.phrase}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [styles.practiceBtn, pressed && { opacity: 0.8 }]}
        onPress={() => onPractice(nugget.phrase, nugget.translation)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chatbubble-ellipses" size={15} color={Colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginVertical: 6,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  label: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' },
  phrase: { color: Colors.text, fontSize: 13, fontWeight: '600', marginTop: 1 },
  practiceBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
