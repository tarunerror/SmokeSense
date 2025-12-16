// Responsive utilities for SmokeSense
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Scale factor
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Get device info
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Responsive width (based on screen width)
export const wp = (percentage: number): number => {
    return Math.round((percentage * SCREEN_WIDTH) / 100);
};

// Responsive height (based on screen height)
export const hp = (percentage: number): number => {
    return Math.round((percentage * SCREEN_HEIGHT) / 100);
};

// Scale font size based on screen width
export const fontScale = (size: number): number => {
    const newSize = size * widthScale;
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Scale size proportionally
export const scale = (size: number): number => {
    return Math.round(size * widthScale);
};

// Scale vertical size
export const verticalScale = (size: number): number => {
    return Math.round(size * heightScale);
};

// Moderate scale (less aggressive than pure scaling)
export const moderateScale = (size: number, factor: number = 0.5): number => {
    return Math.round(size + (scale(size) - size) * factor);
};

// Get responsive padding based on device
export const getResponsivePadding = (): number => {
    if (isSmallDevice) return 12;
    if (isMediumDevice) return 16;
    if (isTablet) return 24;
    return 20;
};

// Get responsive font size
export const getResponsiveFontSize = (baseSize: number): number => {
    if (isSmallDevice) return Math.max(baseSize - 2, 10);
    if (isTablet) return baseSize + 4;
    return baseSize;
};

// Get responsive icon size
export const getResponsiveIconSize = (baseSize: number): number => {
    if (isSmallDevice) return Math.max(baseSize - 4, 16);
    if (isTablet) return baseSize + 6;
    return baseSize;
};

// Get responsive component sizes
export const responsiveSizes = {
    // Padding
    paddingXs: moderateScale(4),
    paddingSm: moderateScale(8),
    paddingMd: moderateScale(16),
    paddingLg: moderateScale(24),
    paddingXl: moderateScale(32),

    // Border radius
    radiusSm: moderateScale(4),
    radiusMd: moderateScale(8),
    radiusLg: moderateScale(12),
    radiusXl: moderateScale(16),
    radiusFull: moderateScale(9999),

    // Component sizes
    buttonHeight: moderateScale(48),
    inputHeight: moderateScale(44),
    iconSm: moderateScale(16),
    iconMd: moderateScale(24),
    iconLg: moderateScale(32),

    // Screen dimensions
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
};

// Get card width for grid layouts
export const getCardWidth = (columns: number, gap: number = 12): number => {
    const totalGap = gap * (columns - 1);
    const padding = getResponsivePadding() * 2;
    return (SCREEN_WIDTH - padding - totalGap) / columns;
};

export default {
    wp,
    hp,
    fontScale,
    scale,
    verticalScale,
    moderateScale,
    getResponsivePadding,
    getResponsiveFontSize,
    getResponsiveIconSize,
    getCardWidth,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    responsiveSizes,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
};
