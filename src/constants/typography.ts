import { StyleSheet } from 'react-native';
import Colors from './colors';

export const Typography = StyleSheet.create({
  // Display
  displayXL: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    lineHeight: 40,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  displayLG: {
    fontFamily: 'Inter_500Medium',
    fontSize: 23,
    lineHeight: 36,
    color: Colors.white,
    letterSpacing: -0.3,
  },
  displayMD: {
    fontFamily: 'Inter_500Medium',
    fontSize: 21,
    lineHeight: 32,
    color: Colors.white,
    letterSpacing: -0.2,
  },

  // Headings
  h1: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    lineHeight: 30,
    color: Colors.white,
  },
  h2: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 26,
    color: Colors.white,
  },
  h3: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 24,
    color: Colors.white,
  },
  h4: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },

  // Body
  bodyLG: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 26,
    color: Colors.textMuted,
  },
  bodyMD: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textMuted,
  },
  bodySM: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  bodyXS: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textDim,
  },

  // Labels
  labelLG: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  labelMD: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  labelSM: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    lineHeight: 16,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Accent
  accent: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: Colors.orange,
  },
  accentSM: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.orange,
  },

  // Price
  price: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 28,
    color: Colors.orange,
  },
  priceSM: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.orange,
  },
});

export default Typography;
