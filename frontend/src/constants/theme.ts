// BharatBazaar AI - Premium Design System
export const Colors = {
  // Backgrounds
  background: '#FAFAF9',
  card: '#FFFFFF',
  cardBorder: '#E7E5E4',
  
  // Primary Colors
  primary: '#F97316',      // Saffron Orange
  primaryLight: '#FFF7ED',
  primaryDark: '#EA580C',
  
  // Secondary Colors
  secondary: '#0F766E',    // Deep Teal
  secondaryLight: '#CCFBF1',
  
  // AI Accent
  accent: '#7C3AED',       // Violet for AI features
  accentLight: '#EDE9FE',
  
  // Status Colors
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#EAB308',
  warningLight: '#FEF9C3',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Text Colors
  textPrimary: '#1C1917',    // Warm black
  textSecondary: '#57534E',
  textMuted: '#78716C',
  textWhite: '#FFFFFF',
  
  // WhatsApp Colors
  whatsappGreen: '#25D366',
  whatsappBubble: '#DCF8C6',
  
  // Misc
  border: '#E7E5E4',
  divider: '#F5F5F4',
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E7E5E4',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
};
