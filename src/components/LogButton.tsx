// One-Tap Log Button Component
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';

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

    const sizeStyles = {
        small: { width: 80, height: 80, iconSize: 28 },
        medium: { width: 120, height: 120, iconSize: 40 },
        large: { width: 160, height: 160, iconSize: 56 },
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
