import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export type VoiceState = 'listening' | 'thinking' | 'speaking';

interface Props {
  visible: boolean;
  state: VoiceState;
  caption: string;
  onClose: () => void;
}

const STATE_LABEL: Record<VoiceState, string> = {
  listening: 'A ouvir...',
  thinking: 'A pensar...',
  speaking: 'A falar...',
};

const STATE_COLOR: Record<VoiceState, string> = {
  listening: Colors.primary,
  thinking: Colors.warning,
  speaking: Colors.success,
};

export default function VoiceConversationModal({ visible, state, caption, onClose }: Props) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    if (state === 'thinking') {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 150 });
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [visible, state]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const color = STATE_COLOR[state];

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.safe}>
        <View style={styles.center}>
          <Animated.View style={[styles.glowRing, { borderColor: color + '55' }, ringStyle]} />
          <View style={[styles.avatar, { borderColor: color, shadowColor: color }]}>
            <Text style={styles.avatarText}>TL</Text>
          </View>
          <Text style={[styles.stateLabel, { color }]}>{STATE_LABEL[state]}</Text>
          <Text style={styles.caption} numberOfLines={4}>
            {caption}
          </Text>
        </View>

        <TouchableOpacity style={styles.endBtn} onPress={onClose}>
          <Ionicons name="call" size={26} color={Colors.white} style={styles.endIcon} />
        </TouchableOpacity>
        <Text style={styles.endLabel}>Terminar conversa</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: 40, letterSpacing: 1 },
  stateLabel: { fontSize: 18, fontWeight: '700', marginTop: 28 },
  caption: { color: Colors.textSecondary, fontSize: 15, textAlign: 'center', marginTop: 14, lineHeight: 22 },
  endBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  endIcon: { transform: [{ rotate: '135deg' }] },
  endLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 10 },
});
