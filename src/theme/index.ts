import { colors, darkColors, ColorScheme } from './colors';
import { typography, spacing, borderRadius, shadows } from './typography';

export interface Theme {
    colors: ColorScheme;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
    isDark: boolean;
}

export const lightTheme: Theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark: false,
};

export const darkTheme: Theme = {
    colors: darkColors,
    typography,
    spacing,
    borderRadius,
    shadows,
    isDark: true,
};

export { colors, darkColors, typography, spacing, borderRadius, shadows };
