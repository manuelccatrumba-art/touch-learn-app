import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface Props {
  value: number;
  duration?: number;
}

// Animates the displayed number smoothly toward `value` whenever it changes,
// instead of snapping instantly (used for XP counters).
export function useAnimatedNumber({ value, duration = 600 }: Props): number {
  const animated = useRef(new Animated.Value(value)).current;
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current === value) return;
    prevValue.current = value;
    const listenerId = animated.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(animated, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => animated.removeListener(listenerId);
  }, [value, duration]);

  return display;
}
