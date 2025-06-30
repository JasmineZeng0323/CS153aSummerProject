//app/components/styles/Colors.ts
export const Colors = {
  // Primary Colors
  primary: '#00A8FF',
  primaryDark: '#0088CC',
  primaryLight: '#33BBFF',
  
  // Secondary Colors
  secondary: '#FF6B35',
  secondaryDark: '#E55A2B',
  secondaryLight: '#FF8A5C',
  
  // Background Colors
  background: '#0A0A0A',
  surface: '#1A1A1A',
  card: '#2A2A2A',
  overlay: 'rgba(0,0,0,0.7)',
  
  // Text Colors
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  textDisabled: '#666666',
  
  // Status Colors
  success: '#4CAF50',
  successLight: '#66BB6A',
  warning: '#FF9800',
  warningLight: '#FFB74D',
  error: '#FF5722',
  errorLight: '#FF8A65',
  info: '#2196F3',
  infoLight: '#64B5F6',
  
  // Special Colors
  rating: '#FFD700',
  online: '#4CAF50',
  verified: '#4CAF50',
  badge: '#FF6B35',
  artist: '#1A3A2A',
  
  // Border Colors
  border: '#333333',
  borderLight: '#444444',
  borderDark: '#1A1A1A',
  
  // Interactive Colors
  link: '#00A8FF',
  linkHover: '#0088CC',
  
  // Transparent Colors
  transparent: 'transparent',
  blackTransparent: 'rgba(0,0,0,0.5)',
  whiteTransparent: 'rgba(255,255,255,0.1)',
  
  // Gradient Colors
  gradientPrimary: ['#00A8FF', '#0088CC'],
  gradientSecondary: ['#FF6B35', '#E55A2B'],
  gradientSuccess: ['#4CAF50', '#388E3C'],
  gradientWarning: ['#FF9800', '#F57C00'],
  gradientError: ['#FF5722', '#D32F2F'],
} as const;

export type ColorKey = keyof typeof Colors;