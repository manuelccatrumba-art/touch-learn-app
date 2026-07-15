import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface Props {
  visible: boolean;
  xp: number;
  nextNode: { title: string; icon: string } | null;
  onContinue: () => void;
}

export default function LessonCompleteModal({ visible, xp, nextNode, onContinue }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Lição completa!</Text>
          <Text style={styles.xp}>+{xp} XP</Text>
          {nextNode && (
            <View style={styles.nextBox}>
              <Text style={styles.nextLabel}>Próxima lição desbloqueada</Text>
              <Text style={styles.nextTitle}>{nextNode.icon} {nextNode.title}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000CC', alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 26,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji: { fontSize: 52, marginBottom: 8 },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800', marginBottom: 4 },
  xp: { color: Colors.gold, fontSize: 18, fontWeight: '700', marginBottom: 18 },
  nextBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  nextLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  nextTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
