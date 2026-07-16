import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 82 : 64;

export default function TutorFAB() {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] }]}
      onPress={() => router.push('/chat')}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fab}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color={Colors.background} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 18,
    bottom: TAB_BAR_HEIGHT + 16,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
});
