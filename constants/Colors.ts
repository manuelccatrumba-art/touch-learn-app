// Touch Learn Interativo — Brand Colors
// Dark "study-at-night" palette: deep ink navy background, warm amber for
// momentum/achievement, soft sky blue for calm/learning, mint for completion.
export const Colors = {
  // Backgrounds
  background: '#0F1729',
  backgroundMid: '#16203A',
  surface: '#1A2438',
  card: '#212D47',
  cardGlass: 'rgba(255,255,255,0.05)',
  border: '#2A3550',
  borderGlow: 'rgba(232,169,76,0.5)',

  // Brand — warm amber/gold (momentum, achievement)
  primary: '#E8A94C',
  primaryDark: '#C68A32',
  primaryDeep: '#4A3D26',
  primaryLight: '#F0C480',
  primaryGlow: 'rgba(232,169,76,0.3)',

  // Secondary accent — soft sky blue (calm, learning)
  secondary: '#5FA8D3',
  secondaryDark: '#3D6E8F',
  accent: '#5FA8D3',

  // States
  success: '#6FCF97',
  successDark: '#4FAF77',
  error: '#E5484D',
  errorDark: '#B03A3E',
  warning: '#E8A94C',
  gold: '#E8A94C',

  // Gradients (pairs)
  gradientChat: ['#16203A', '#0F1729'] as const,
  gradientCard: ['#2A3550', '#1A2438'] as const,
  gradientBtn: ['#F0C480', '#C68A32'] as const,
  gradientGold: ['#F0C480', '#C68A32'] as const,

  // Bubbles
  userBubble: '#3D6E8F',
  aiBubble: 'rgba(255,255,255,0.07)',

  // Text
  text: '#F5F1E8',
  textSecondary: '#8B93A7',
  textMuted: '#6B7280',

  // Tabs
  tabBar: '#0F1729',
  tabBarActive: '#E8A94C',
  tabBarInactive: '#4A5468',

  // Misc
  overlay: 'rgba(15,23,41,0.85)',
  white: '#FFFFFF',
  black: '#000000',
} as const;
