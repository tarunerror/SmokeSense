// One-Tap Log Button Component
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    Animated,
    Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

interface LogButtonProps {
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    size?: 'small' | 'medium' | 'large';
}

export const LogButton: React.FC<LogButtonProps> = ({
    onPress,
    disabled = false,
    style,
    size = 'large',
}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    // Responsive sizes based on screen width
    const sizeStyles = {
        small: {
            width: isSmallDevice ? 60 : 80,
            height: isSmallDevice ? 60 : 80,
            iconSize: isSmallDevice ? 22 : 28
        },
        medium: {
            width: isSmallDevice ? 90 : 120,
            height: isSmallDevice ? 90 : 120,
            iconSize: isSmallDevice ? 32 : 40
        },
        large: {
            width: isSmallDevice ? 120 : 160,
            height: isSmallDevice ? 120 : 160,
            iconSize: isSmallDevice ? 44 : 56
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }] },
                style,
            ]}
        >
            <TouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                activeOpacity={0.8}
                style={[
                    styles.button,
                    {
                        width: currentSize.width,
                        height: currentSize.height,
                    },
                    disabled && styles.buttonDisabled,
                ]}
            >
                <Ionicons
                    name="add-circle"
                    size={currentSize.iconSize}
                    color={colors.neutral[0]}
                />
                <Text style={styles.buttonText}>Log</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary[500],
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    buttonDisabled: {
        backgroundColor: colors.neutral[300],
    },
    buttonText: {
        color: colors.neutral[0],
        fontSize: 18,
        fontWeight: '600',
        marginTop: spacing.xs,
    },
});

export default LogButton;
