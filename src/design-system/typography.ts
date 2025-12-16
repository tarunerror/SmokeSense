export const typography = {
  fontFamily: {
    regular: undefined,
    medium: undefined,
    semibold: undefined,
    mono: undefined,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 30,
    xxl: 36,
  },
} as const;

export type Typography = typeof typography;
