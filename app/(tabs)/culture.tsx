import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CULTURE_NUGGETS, CULTURE_TYPE_LABELS, CultureType } from '../../constants/culture';
import { CEFRLevel } from '../../types';
import CultureCard from '../../components/CultureCard';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TYPES = Object.keys(CULTURE_TYPE_LABELS) as CultureType[];

export default function CultureScreen() {
  const [selectedType, setSelectedType] = useState<CultureType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');

  const filtered = useMemo(() => {
    return CULTURE_NUGGETS.filter((n) => {
      if (selectedType !== 'all' && n.type !== selectedType) return false;
      if (selectedLevel !== 'all' && n.level !== selectedLevel) return false;
      return true;
    });
  }, [selectedType, selectedLevel]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Cultura</Text>
            <Text style={styles.headerSub}>Música, filmes, gírias e expressões reais</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{CULTURE_NUGGETS.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={[styles.filterChipText, selectedType === 'all' && styles.filterChipTextActive]}>
            🗂 Tudo
          </Text>
        </TouchableOpacity>
        {TYPES.map((t) => {
          const meta = CULTURE_TYPE_LABELS[t];
          return (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
              onPress={() => setSelectedType(t)}
            >
              <Text style={[styles.filterChipText, selectedType === t && styles.filterChipTextActive]}>
                {meta.emoji} {meta.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.levelScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.levelChip, selectedLevel === 'all' && styles.levelChipActive]}
          onPress={() => setSelectedLevel('all')}
        >
          <Text style={[styles.levelChipText, selectedLevel === 'all' && styles.levelChipTextActive]}>Todos os níveis</Text>
        </TouchableOpacity>
        {LEVELS.map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.levelChip, selectedLevel === lvl && styles.levelChipActive]}
            onPress={() => setSelectedLevel(lvl)}
          >
            <Text style={[styles.levelChipText, selectedLevel === lvl && styles.levelChipTextActive]}>{lvl}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Nada por aqui com este filtro.</Text>
          </View>
        ) : (
          filtered.map((nugget) => <CultureCard key={nugget.id} nugget={nugget} />)
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: { backgroundColor: Colors.background, overflow: 'hidden' },
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
  headerBadgeText: { color: Colors.white, fontWeight: '800', fontSize: 15 },

  filterScroll: { maxHeight: 48, flexGrow: 0 },
  levelScroll: { maxHeight: 44, flexGrow: 0, marginBottom: 6 },
  filterContent: { paddingHorizontal: 14, gap: 8, alignItems: 'center', paddingBottom: 4 },

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
  },
  filterChipText: { color: Colors.textSecondary, fontSize: 13 },
  filterChipTextActive: { color: Colors.white, fontWeight: '700' },

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

  list: { padding: 14, gap: 10 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 16 },
  bottomPad: { height: 24 },
});
