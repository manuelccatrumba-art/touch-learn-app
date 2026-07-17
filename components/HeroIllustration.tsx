import React from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface Props {
  size?: number;
}

// Ilustração de marca própria (vetorial, gerada localmente — sem depender de
// fetch remoto nem foto de stock): um aluno estilizado, em pose de vitória,
// nas cores da identidade azul→roxo.
export default function HeroIllustration({ size = 120 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="heroBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={Colors.primary} />
          <Stop offset="100%" stopColor={Colors.purple} />
        </LinearGradient>
        <LinearGradient id="heroSkinGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#ffd9a8" />
          <Stop offset="100%" stopColor="#ffc888" />
        </LinearGradient>
      </Defs>

      {/* sombra */}
      <Ellipse cx="60" cy="108" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />

      {/* braço levantado (comemorando) */}
      <Path d="M78,66 Q94,50 90,32" stroke="url(#heroBodyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
      <Circle cx="90" cy="30" r="7" fill="url(#heroSkinGrad)" />

      {/* corpo */}
      <Path d="M38,100 Q34,66 60,64 Q86,66 82,100 Z" fill="url(#heroBodyGrad)" />

      {/* outro braço */}
      <Path d="M42,70 Q26,78 24,94" stroke="url(#heroBodyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
      <Circle cx="23" cy="96" r="7" fill="url(#heroSkinGrad)" />

      {/* cabeça */}
      <Circle cx="60" cy="42" r="24" fill="url(#heroSkinGrad)" />

      {/* cabelo */}
      <Path d="M38,36 Q40,16 60,16 Q82,16 82,38 Q74,28 60,28 Q46,28 38,36 Z" fill="#3a2a1a" />

      {/* olhos */}
      <Circle cx="52" cy="42" r="2.6" fill="#1a1a2e" />
      <Circle cx="68" cy="42" r="2.6" fill="#1a1a2e" />

      {/* sorriso */}
      <Path d="M50,50 Q60,58 70,50" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* bochechas */}
      <Circle cx="46" cy="48" r="3.5" fill="#ff9d9d" opacity={0.5} />
      <Circle cx="74" cy="48" r="3.5" fill="#ff9d9d" opacity={0.5} />
    </Svg>
  );
}
