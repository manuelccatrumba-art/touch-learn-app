import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

interface Props extends ScrollViewProps {
  fadeHeight?: number;
  fadeWidth?: number;
  backgroundColor?: string;
}

// Horizontal ScrollView with a fade gradient on the right edge, signaling
// there is more scrollable content when the row overflows the screen width.
export default function FadeEdgeScrollView({
  fadeHeight,
  fadeWidth = 28,
  backgroundColor = Colors.background,
  style,
  contentContainerStyle,
  children,
  ...rest
}: Props) {
  return (
    <View style={[styles.wrapper, fadeHeight ? { height: fadeHeight } : null]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scroll, style]}
        contentContainerStyle={contentContainerStyle}
        {...rest}
      >
        {children}
      </ScrollView>
      <LinearGradient
        colors={['transparent', backgroundColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, { width: fadeWidth }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  scroll: { flexGrow: 0 },
  fade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
});
