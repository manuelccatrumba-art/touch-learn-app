import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useFontScale } from '../contexts/FontScaleContext';

// Substituto directo do <Text> nativo — em vez de reescrever o tamanho de
// letra em dezenas de ecrãs manualmente, cada ficheiro só troca o import
// ("import { Text } from 'react-native'" -> "import Text from
// '.../AppText'") e todo o texto passa a responder ao controlo global de
// tamanho de letra na Perfil, sem tocar em nenhum JSX.
export default function AppText({ style, ...props }: TextProps) {
  const { scale } = useFontScale();
  const flat = StyleSheet.flatten(style) ?? {};
  const scaledOverride: { fontSize?: number; lineHeight?: number } = {};

  if (typeof flat.fontSize === 'number') {
    scaledOverride.fontSize = flat.fontSize * scale;
  }
  if (typeof flat.lineHeight === 'number') {
    scaledOverride.lineHeight = flat.lineHeight * scale;
  }

  return <RNText {...props} style={[style, scaledOverride]} />;
}
