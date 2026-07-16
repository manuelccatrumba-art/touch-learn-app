// Touch Learn Interativo — Brand Colors
// Dark "study-at-night" palette: deep ink navy background, warm-to-hot
// orange→red gradient for momentum/achievement, mint for completion.
export const Colors = {
  // Backgrounds
  background: '#0d1224',
  backgroundMid: '#131a30',
  surface: '#161c33',
  card: '#1b2340',
  cardGlass: 'rgba(255,255,255,0.05)',
  border: '#2A3550',
  borderGlow: 'rgba(240,168,63,0.5)',

  // Brand — orange→red gradient (momentum, achievement)
  primary: '#f0a83f',
  primaryDark: '#c9822a',
  primaryDeep: '#4a3520',
  primaryLight: '#ffc466',
  primaryGlow: 'rgba(240,168,63,0.3)',

  // Secondary accent — soft sky blue (calm, learning)
  secondary: '#5FA8D3',
  secondaryDark: '#3D6E8F',
  accent: '#5FA8D3',

  // States
  success: '#5dcaa5',
  successDark: '#3fa886',
  error: '#e6455a',
  errorDark: '#b8354a',
  warning: '#f0a83f',
  gold: '#f0a83f',

  // Gradients (pairs)
  gradientChat: ['#131a30', '#0d1224'] as const,
  gradientCard: ['#2A3550', '#161c33'] as const,
  gradientBtn: ['#ffc466', '#c9822a'] as const,
  gradientGold: ['#ffc466', '#c9822a'] as const,
  gradientHero: ['#f0a83f', '#e6455a'] as const,

  // Bubbles
  userBubble: '#3D6E8F',
  aiBubble: 'rgba(255,255,255,0.07)',

  // Text
  text: '#F5F1E8',
  textSecondary: '#8B93A7',
  textMuted: '#6B7280',

  // Tabs
  tabBar: '#0d1224',
  tabBarActive: '#f0a83f',
  tabBarInactive: '#4A5468',

  // Misc
  overlay: 'rgba(13,18,36,0.85)',
  white: '#FFFFFF',
  black: '#000000',
} as const;
