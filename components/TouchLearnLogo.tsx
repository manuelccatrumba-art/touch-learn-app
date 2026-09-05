import React from 'react';
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/Colors';

interface Props {
  size?: number;
  waveColor?: string;
}

// "Onda de voz" — círculo com gradiente radial e uma waveform centrada,
// usado como avatar do Tutor em toda a app (bolhas de chat, indicador de
// "a escrever", ecrã de voz contínua). O gradiente segue a identidade
// azul→roxo atual (antes usava laranja→vermelho de uma paleta já
// abandonada, dessincronizado do resto da app).
export default function TouchLearnLogo({ size = 40, waveColor = Colors.background }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="touchLearnLogoGrad" cx="35%" cy="30%" r="75%">
          <Stop offset="0%" stopColor={Colors.primaryLight} />
          <Stop offset="55%" stopColor={Colors.primary} />
          <Stop offset="100%" stopColor={Colors.purple} />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="50" fill="url(#touchLearnLogoGrad)" />
      <Path
        d="M18,52 L28,52 L34,38 L42,66 L52,26 L62,72 L70,52 L82,52"
        stroke={waveColor}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
