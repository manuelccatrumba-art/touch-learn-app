import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

export type QuickCommandKind = 'grammar' | 'vocab' | 'culture';

interface Props {
  onCommand: (kind: QuickCommandKind) => void;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { kind: QuickCommandKind; icon: IoniconName; colors: readonly [string, string]; offset: number }[] = [
  { kind: 'grammar', icon: 'help-circle', colors: [Colors.blush, Colors.coral], offset: 58 },
  { kind: 'vocab', icon: 'albums', colors: [Colors.goldSpectrum, Colors.tangerine], offset: 110 },
  { kind: 'culture', icon: 'musical-notes', colors: [Colors.success, Colors.successDark], offset: 162 },
];

function QuickOption({
  icon,
  colors,
  offset,
  scale,
  open,
  onPress,
}: {
  icon: IoniconName;
  colors: readonly [string, string];
  offset: number;
  scale: SharedValue<number>;
  open: boolean;
  onPress: () => void;
}) {
  const optStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  return (
    <Reanimated.View style={[styles.optionWrap, { bottom: offset }, optStyle]} pointerEvents={open ? 'auto' : 'none'}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionBtn}>
          <Ionicons name={icon} size={19} color={Colors.background} />
        </LinearGradient>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

export default function QuickCommandButton({ onCommand }: Props) {
  const [open, setOpen] = useState(false);
  const rotation = useSharedValue(0);
  const scales = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  function toggle() {
    const next = !open;
    setOpen(next);
    rotation.value = withTiming(next ? 45 : 0, { duration: 200 });
    scales.forEach((s, i) => {
      s.value = next
        ? withDelay(i * 50, withSpring(1, { damping: 10, stiffness: 200 }))
        : withTiming(0, { duration: 120 });
    });
  }

  function select(kind: QuickCommandKind, index: number) {
    scales[index].value = withSequence(
      withTiming(1.25, { duration: 90 }),
      withTiming(1, { duration: 90 }),
    );
    setTimeout(() => {
      setOpen(false);
      rotation.value = withTiming(0, { duration: 180 });
      scales.forEach((s) => { s.value = withTiming(0, { duration: 140 }); });
      onCommand(kind);
    }, 190);
  }

  const mainIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt, i) => (
        <QuickOption
          key={opt.kind}
          icon={opt.icon}
          colors={opt.colors}
          offset={opt.offset}
          scale={scales[i]}
          open={open}
          onPress={() => select(opt.kind, i)}
        />
      ))}

      <TouchableOpacity onPress={toggle} style={styles.mainBtn} activeOpacity={0.85}>
        <Reanimated.View style={mainIconStyle}>
          <Ionicons name="add" size={22} color={Colors.tangerine} />
        </Reanimated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  mainBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.tangerine + '59',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionWrap: { position: 'absolute' },
  optionBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
});
