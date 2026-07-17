// Touch Learn Interativo — Brand Colors
// Dark "study-at-night" palette: deep ink navy background, warm coral→
// tangerine→gold→blush spectrum for identity (used in fluid multi-stop
// gradients, never as isolated contrasting colors), mint reserved strictly
// for success/completion states.
export const Colors = {
  // Backgrounds
  background: '#0d1224',
  backgroundMid: '#131a30',
  surface: '#161c33',
  card: '#1b2340',
  cardGlass: 'rgba(255,255,255,0.05)',
  border: '#2A3550',
  borderGlow: 'rgba(255,157,77,0.5)',

  // Brand spectrum — coral, tangerine, gold, blush (use 2-3 together in
  // gradients per element; never pair against error red)
  coral: '#ff6b7a',
  tangerine: '#ff9d4d',
  goldSpectrum: '#ffc93c',
  blush: '#ff8fb1',
  spectrum: ['#ff6b7a', '#ff9d4d', '#ffc93c', '#ff8fb1'] as const,

  // Brand — primary accent (tangerine), used for solid fills/icons
  primary: '#ff9d4d',
  primaryDark: '#d67f38',
  primaryDeep: '#4a3520',
  primaryLight: '#ffc93c',
  primaryGlow: 'rgba(255,157,77,0.3)',

  // Secondary accent — soft sky blue (calm, learning)
  secondary: '#5FA8D3',
  secondaryDark: '#3D6E8F',
  accent: '#5FA8D3',

  // States — error red is reserved for actual errors, never decorative
  success: '#5dcaa5',
  successDark: '#3fa886',
  error: '#e6455a',
  errorDark: '#b8354a',
  warning: '#ff9d4d',
  gold: '#ffc93c',

  // Gradients (pairs/triples) — all drawn from the coral/tangerine/gold/blush family
  gradientChat: ['#131a30', '#0d1224'] as const,
  gradientCard: ['#2A3550', '#161c33'] as const,
  gradientBtn: ['#ffc93c', '#ff9d4d'] as const,
  gradientGold: ['#ffc93c', '#ff9d4d'] as const,
  gradientHero: ['#ff6b7a', '#ff9d4d', '#ffc93c'] as const,

  // Bubbles
  userBubble: '#3D6E8F',
  aiBubble: 'rgba(255,255,255,0.07)',

  // Text
  text: '#F5F1E8',
  textSecondary: '#8B93A7',
  textMuted: '#6B7280',

  // Tabs
  tabBar: '#0d1224',
  tabBarActive: '#ff9d4d',
  tabBarInactive: '#4A5468',

  // Misc
  overlay: 'rgba(13,18,36,0.85)',
  white: '#FFFFFF',
  black: '#000000',
} as const;
