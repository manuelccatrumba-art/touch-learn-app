import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { useFontScale } from '../contexts/FontScaleContext';

// Mesmo mecanismo do AppText, aplicado a campos de escrita — sem isto, o
// texto que o utilizador escreve (respostas de exercícios, o desafio
// diário, o listening, mensagens do chat) ficava sempre no tamanho
// original mesmo depois de aumentar o tamanho de letra no resto da app,
// o que seria inconsistente e inútil para quem precisa mesmo de letra maior.
export default function AppTextInput({ style, ...props }: TextInputProps) {
  const { scale } = useFontScale();
  const flat = StyleSheet.flatten(style) ?? {};
  const scaledOverride: { fontSize?: number; lineHeight?: number } = {};

  if (typeof flat.fontSize === 'number') {
    scaledOverride.fontSize = flat.fontSize * scale;
  }
  if (typeof flat.lineHeight === 'number') {
    scaledOverride.lineHeight = flat.lineHeight * scale;
  }

  return <RNTextInput {...props} style={[style, scaledOverride]} />;
}
