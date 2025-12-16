import { spacing } from './spacing';
import { typography } from './typography';

const palette = {
  neutral: {
    0: '#FFFFFF',
    25: '#FAFAFA',
    50: '#F5F5F5',
    100: '#E6E6E6',
    200: '#CFCFCF',
    500: '#6B6B6B',
    800: '#1F1F1F',
    900: '#111111',
  },
  sage: {
    50: '#E9F5F0',
    400: '#2F8F73',
    500: '#1F6D57',
  },
  sky: {
    50: '#EAF3FF',
    400: '#3B82F6',
  },
  amber: {
    50: '#FFF6E5',
    500: '#B45309',
  },
  rose: {
    50: '#FFEFF2',
    500: '#BE123C',
  },
} as const;

export type ThemeMode = 'system' | 'light' | 'dark';

export type AppTheme = {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;

    text: string;
    textMuted: string;

    primary: string;
    primaryPressed: string;
    onPrimary: string;

    supportive: string;
    warning: string;
    danger: string;

    meterTrack: string;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  shadow: {
    card: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
};

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    background: palette.neutral[0],
    surface: palette.neutral[25],
    surfaceAlt: palette.neutral[50],
    border: palette.neutral[100],

    text: palette.neutral[900],
    textMuted: palette.neutral[500],

    primary: palette.sage[400],
    primaryPressed: palette.sage[500],
    onPrimary: palette.neutral[0],

    supportive: palette.sky[400],
    warning: palette.amber[500],
    danger: palette.rose[500],

    meterTrack: palette.neutral[100],
  },
  typography,
  spacing,
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.07,
      shadowRadius: 16,
      elevation: 2,
    },
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    background: palette.neutral[900],
    surface: palette.neutral[800],
    surfaceAlt: '#252525',
    border: '#2E2E2E',

    text: palette.neutral[0],
    textMuted: '#B7B7B7',

    primary: '#66C2A3',
    primaryPressed: '#4FB894',
    onPrimary: palette.neutral[900],

    supportive: '#7FB2FF',
    warning: '#F4B27A',
    danger: '#FF8AA1',

    meterTrack: '#2E2E2E',
  },
  typography,
  spacing,
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  shadow: {
    card: {
      shadowColor: '#000000',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 2,
    },
  },
};
