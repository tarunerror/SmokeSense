// Delay Timer Component - Using React Native Animated
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

interface DelayTimerProps {
    durationSeconds: number;
    onComplete: () => void;
    onSkip: () => void;
    showBreathing?: boolean;
    allowSkip?: boolean;
}

export const DelayTimer: React.FC<DelayTimerProps> = ({
    durationSeconds,
    onComplete,
    onSkip,
    showBreathing = true,
    allowSkip = true,
}) => {
    const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    const breathScale = useRef(new Animated.Value(1)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;

    // Breathing animation (4-7-8 technique simplified)
    useEffect(() => {
        if (showBreathing) {
            const breathCycle = () => {
                // Inhale (4s)
                setBreathPhase('inhale');
                Animated.timing(breathScale, {
                    toValue: 1.3,
                    duration: 4000,
                    useNativeDriver: true,
                }).start();

                setTimeout(() => {
                    // Hold (4s)
                    setBreathPhase('hold');
                }, 4000);

                setTimeout(() => {
                    // Exhale (6s)
                    setBreathPhase('exhale');
                    Animated.timing(breathScale, {
                        toValue: 1,
                        duration: 6000,
                        useNativeDriver: true,
                    }).start();
                }, 8000);
            };

            breathCycle();
            const interval = setInterval(breathCycle, 14000);
            return () => clearInterval(interval);
        }
    }, [showBreathing]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Progress animation
        Animated.timing(progressWidth, {
            toValue: 100,
            duration: durationSeconds * 1000,
            useNativeDriver: false,
        }).start();

        return () => clearInterval(timer);
    }, [durationSeconds]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getBreathText = () => {
        switch (breathPhase) {
            case 'inhale':
                return 'Breathe in...';
            case 'hold':
                return 'Hold...';
            case 'exhale':
                return 'Breathe out...';
        }
    };

    const progressInterpolated = progressWidth.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Take a moment</Text>
            <Text style={styles.subtitle}>
                A short pause can help you understand your urge
            </Text>

            {showBreathing && (
                <Animated.View
                    style={[
                        styles.breathCircle,
                        { transform: [{ scale: breathScale }] }
                    ]}
                >
                    <Text style={styles.breathText}>{getBreathText()}</Text>
                </Animated.View>
            )}

            <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
                <View style={styles.progressBackground}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { width: progressInterpolated }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.buttonsContainer}>
                {allowSkip && (
                    <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                        <Text style={styles.skipButtonText}>Skip & Log</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onComplete} style={styles.proceedButton}>
                    <Ionicons name="checkmark" size={20} color={colors.neutral[0]} />
                    <Text style={styles.proceedButtonText}>I'm ready to log</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.primary,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    breathCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    breathText: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.medium,
        color: colors.primary[700],
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    timerText: {
        fontSize: typography.sizes.xxxl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginBottom: spacing.md,
    },
    progressBackground: {
        width: 200,
        height: 8,
        backgroundColor: colors.neutral[200],
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary[500],
        borderRadius: borderRadius.full,
    },
    buttonsContainer: {
        width: '100%',
        gap: spacing.md,
    },
    skipButton: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    skipButtonText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
    },
    proceedButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    proceedButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
});

export default DelayTimer;
