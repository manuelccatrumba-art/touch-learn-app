import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Reanimated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

const PARTICLE_COUNT = 12;
const DURATION = 650;

interface ParticleConfig {
  angle: number;
  distance: number;
  color: string;
  size: number;
}

function Particle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) });
  }, []);

  const style = useAnimatedStyle(() => {
    const dx = Math.cos(config.angle) * config.distance * progress.value;
    const dy = Math.sin(config.angle) * config.distance * progress.value;
    return {
      transform: [{ translateX: dx }, { translateY: dy }, { scale: 1 - progress.value * 0.4 }],
      opacity: 1 - progress.value,
    };
  });

  return (
    <Reanimated.View
      style={[
        styles.particle,
        { backgroundColor: config.color, width: config.size, height: config.size, borderRadius: config.size / 2 },
        style,
      ]}
    />
  );
}

// Trigger by passing an incrementing number (e.g. a counter bumped on each
// correct answer / graded flashcard). Renders nothing until first triggered.
export default function ParticleBurst({ trigger }: { trigger: number }) {
  const [visible, setVisible] = useState(false);

  const particles = useMemo<ParticleConfig[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.4,
      distance: 40 + Math.random() * 36,
      color: Colors.spectrum[i % Colors.spectrum.length],
      size: 5 + Math.random() * 4,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), DURATION + 50);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((p, i) => (
        <Particle key={`${trigger}-${i}`} config={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: { position: 'absolute' },
});
