// Touch Learn Interativo — Brand Colors
// Deep navy dashboard palette: blue→purple identity gradient, teal for
// progress/positive completion, orange/coral/gold as secondary accents
// for lesson cards and category badges.
export const Colors = {
  // Backgrounds
  background: '#0a0e2e',
  backgroundMid: '#0d1240',
  surface: '#0d1240',
  card: '#131a4f',
  cardGlass: 'rgba(255,255,255,0.05)',
  border: '#232a5e',
  borderGlow: 'rgba(59,125,255,0.5)',

  // Brand — blue → purple (primary identity gradient)
  primary: '#3b7dff',
  primaryDark: '#2f63cc',
  primaryDeep: '#1c2a5e',
  primaryLight: '#6a9dff',
  primaryGlow: 'rgba(59,125,255,0.3)',

  purple: '#8b5cf6',
  purpleDark: '#6d3fd1',
  teal: '#1ec9a4',
  tealDark: '#17a082',
  orange: '#ff9d4d',
  coral: '#ff6b6b',
  gold: '#ffc93c',
  spectrum: ['#3b7dff', '#8b5cf6', '#1ec9a4', '#ff9d4d', '#ff6b6b', '#ffc93c'] as const,

  // Secondary accent (kept for compatibility with older screens)
  secondary: '#8b5cf6',
  secondaryDark: '#6d3fd1',
  accent: '#1ec9a4',

  // States
  success: '#1ec9a4',
  successDark: '#17a082',
  error: '#ff5470',
  errorDark: '#cc3f57',
  warning: '#ff9d4d',

  // Gradients (pairs/triples)
  gradientChat: ['#0d1240', '#0a0e2e'] as const,
  gradientCard: ['#232a5e', '#131a4f'] as const,
  gradientBtn: ['#3b7dff', '#8b5cf6'] as const,
  gradientGold: ['#ffc93c', '#ff9d4d'] as const,
  gradientHero: ['#131a4f', '#3b1f6e'] as const, // navy → purple
  gradientProgress: ['#3b7dff', '#1ec9a4'] as const, // blue → teal
  gradientTutor: ['#3b7dff', '#8b5cf6'] as const, // blue → purple

  // Bubbles
  userBubble: '#2f4d8f',
  aiBubble: 'rgba(255,255,255,0.07)',

  // Text
  text: '#ffffff',
  textSecondary: '#9aa3c9',
  textMuted: '#5f6796',

  // Tabs
  tabBar: '#0a0e2e',
  tabBarActive: '#3b7dff',
  tabBarInactive: '#5f6796',

  // Misc
  overlay: 'rgba(10,14,46,0.85)',
  white: '#FFFFFF',
  black: '#000000',
} as const;
