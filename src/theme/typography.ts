// SmokeSense Typography with Responsive Scaling
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base width (iPhone 14 Pro)
const BASE_WIDTH = 393;
const scale = SCREEN_WIDTH / BASE_WIDTH;

// Responsive font scaling
const fontScale = (size: number): number => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Moderate scale (less aggressive)
const moderateScale = (size: number, factor: number = 0.5): number => {
    return Math.round(size + (size * scale - size) * factor);
};

// Device type detection
const isSmallDevice = SCREEN_WIDTH < 375;
const isLargeDevice = SCREEN_WIDTH >= 414;

export const typography = {
    fonts: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
    },

    sizes: {
        xs: moderateScale(isSmallDevice ? 10 : 12),
        sm: moderateScale(isSmallDevice ? 12 : 14),
        md: moderateScale(isSmallDevice ? 14 : 16),
        lg: moderateScale(isSmallDevice ? 16 : 18),
        xl: moderateScale(isSmallDevice ? 18 : 20),
        xxl: moderateScale(isSmallDevice ? 20 : 24),
        xxxl: moderateScale(isSmallDevice ? 28 : 32),
        giant: moderateScale(isSmallDevice ? 40 : 48),
    },

    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    weights: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const spacing = {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(isSmallDevice ? 12 : 16),
    lg: moderateScale(isSmallDevice ? 18 : 24),
    xl: moderateScale(isSmallDevice ? 24 : 32),
    xxl: moderateScale(isSmallDevice ? 36 : 48),
    xxxl: moderateScale(isSmallDevice ? 48 : 64),
};

export const borderRadius = {
    sm: moderateScale(4),
    md: moderateScale(8),
    lg: moderateScale(12),
    xl: moderateScale(16),
    xxl: moderateScale(24),
    full: 9999,
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
};

// Export helpers for custom scaling
export const responsiveHelpers = {
    fontScale,
    moderateScale,
    isSmallDevice,
    isLargeDevice,
    screenWidth: SCREEN_WIDTH,
};
