import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import TouchLearnLogo from './TouchLearnLogo';

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
  speaking: 'A responder...',
};

const STATE_COLOR: Record<VoiceState, string> = {
  listening: Colors.primary,
  thinking: Colors.warning,
  speaking: Colors.success,
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function VoiceConversationModal({ visible, state, caption, onClose }: Props) {
  const pulse = useSharedValue(1);
  const ringProgress = useSharedValue(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) {
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    ringProgress.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }), -1, false);
    return () => cancelAnimation(ringProgress);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (state === 'thinking') {
      cancelAnimation(pulse);
      pulse.value = withTiming(1, { duration: 150 });
      return;
    }
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 650, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [visible, state]);

  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ringProgress.value, [0, 1], [1, 1.3]) }],
    opacity: interpolate(ringProgress.value, [0, 1], [0.6, 0]),
  }));

  const color = STATE_COLOR[state];

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.timer}>{formatTimer(elapsed)}</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.center}>
          <View style={styles.halo} />
          <Animated.View style={[styles.pulseRing, { borderColor: color + '40' }, ringStyle]} />
          <Animated.View style={[styles.avatarWrapper, orbStyle]}>
            <TouchLearnLogo size={88} />
          </Animated.View>
          <Text style={[styles.stateLabel, { color }]}>{STATE_LABEL[state]}</Text>

          <View style={styles.transcriptCard}>
            <Text style={styles.transcriptLabel}>TRANSCRIÇÃO</Text>
            <Text style={styles.caption} numberOfLines={5}>
              {caption || 'A aguardar que comeces a falar...'}
            </Text>
          </View>
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
    paddingVertical: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: { color: Colors.textSecondary, fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  halo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.primary + '14',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
  },
  avatarWrapper: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  stateLabel: { fontSize: 18, fontWeight: '700', marginTop: 28 },

  transcriptCard: {
    marginTop: 24,
    width: '100%',
    minHeight: 84,
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
  },
  transcriptLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  caption: { color: Colors.textSecondary, fontSize: 15, textAlign: 'left', lineHeight: 22 },

  endBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 4,
  },
  endIcon: { transform: [{ rotate: '135deg' }] },
  endLabel: { color: Colors.textMuted, fontSize: 12, marginTop: 10, marginBottom: 8 },
});
