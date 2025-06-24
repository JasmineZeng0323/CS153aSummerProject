
import { TextStyle } from 'react-native';
import { Colors } from './Colors';

export const Typography = {
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 40,
  } as TextStyle,
  
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 36,
  } as TextStyle,
  
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 32,
  } as TextStyle,
  
  h4: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 28,
  } as TextStyle,
  
  h5: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 24,
  } as TextStyle,
  
  h6: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 22,
  } as TextStyle,
  
  // Body Text
  bodyLarge: {
    fontSize: 18,
    fontWeight: 'normal',
    color: Colors.text,
    lineHeight: 26,
  } as TextStyle,
  
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.text,
    lineHeight: 22,
  } as TextStyle,
  
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.text,
    lineHeight: 20,
  } as TextStyle,
  
  // Caption and Labels
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    color: Colors.textMuted,
    lineHeight: 16,
  } as TextStyle,
  
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 18,
  } as TextStyle,
  
  labelSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 16,
  } as TextStyle,
  
  // Special Text Styles
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 20,
  } as TextStyle,
  
  buttonSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 18,
  } as TextStyle,
  
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
    lineHeight: 24,
  } as TextStyle,
  
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.rating,
    lineHeight: 18,
  } as TextStyle,
  
  badge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 14,
  } as TextStyle,
  
  // Muted variants
  bodyMuted: {
    fontSize: 16,
    fontWeight: 'normal',
    color: Colors.textMuted,
    lineHeight: 22,
  } as TextStyle,
  
  bodySmallMuted: {
    fontSize: 14,
    fontWeight: 'normal',
    color: Colors.textMuted,
    lineHeight: 20,
  } as TextStyle,
  
  // Link styles
  link: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.link,
    lineHeight: 22,
    textDecorationLine: 'underline',
  } as TextStyle,
  
  linkSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.link,
    lineHeight: 20,
    textDecorationLine: 'underline',
  } as TextStyle,
  
  // Status text
  success: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    lineHeight: 18,
  } as TextStyle,
  
  warning: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.warning,
    lineHeight: 18,
  } as TextStyle,
  
  error: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    lineHeight: 18,
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof Typography;