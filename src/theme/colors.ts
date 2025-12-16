// SmokeSense Theme - Calming Color Palette
export const colors = {
    // Primary - Soft teal/green (calming, associated with wellness)
    primary: {
        50: '#E6F7F5',
        100: '#B3E8E2',
        200: '#80D9CF',
        300: '#4DCABB',
        400: '#26BDA8',
        500: '#00B095', // Main primary
        600: '#009E86',
        700: '#008A74',
        800: '#007663',
        900: '#005A4A',
    },

    // Secondary - Warm amber (supportive, encouraging)
    secondary: {
        50: '#FFF8E6',
        100: '#FFEDB3',
        200: '#FFE180',
        300: '#FFD54D',
        400: '#FFCC26',
        500: '#FFC300', // Main secondary
        600: '#E6B000',
        700: '#CC9C00',
        800: '#B38800',
        900: '#8A6900',
    },

    // Neutral palette
    neutral: {
        0: '#FFFFFF',
        50: '#F8FAFA',
        100: '#F0F2F2',
        200: '#E4E7E7',
        300: '#D1D5D5',
        400: '#A8AEAE',
        500: '#7F8787',
        600: '#5C6363',
        700: '#404545',
        800: '#292D2D',
        900: '#1A1D1D',
        1000: '#000000',
    },

    // Semantic colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Mood colors (soft, non-judgmental)
    moods: {
        calm: '#81C784',
        stressed: '#FFB74D',
        social: '#64B5F6',
        bored: '#B0BEC5',
        anxious: '#CE93D8',
        happy: '#FFD54F',
        tired: '#90A4AE',
        focused: '#4FC3F7',
    },

    // Background colors
    background: {
        primary: '#FFFFFF',
        secondary: '#F8FAFA',
        tertiary: '#F0F2F2',
        dark: '#1A1D1D',
        darkSecondary: '#292D2D',
    },
};

// Dark mode colors
export const darkColors = {
    ...colors,
    background: {
        primary: '#1A1D1D',
        secondary: '#292D2D',
        tertiary: '#404545',
        dark: '#FFFFFF',
        darkSecondary: '#F8FAFA',
    },
};

export type ColorScheme = typeof colors;
