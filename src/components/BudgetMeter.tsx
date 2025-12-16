// Budget Meter Component - Using React Native Animated
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, spacing, typography } from '../theme';

interface BudgetMeterProps {
    used: number;
    limit: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const BudgetMeter: React.FC<BudgetMeterProps> = ({
    used,
    limit,
    size = 200,
    strokeWidth = 16,
    showLabel = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const percentage = Math.min(used / limit, 1);
    const remaining = limit - used;

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: percentage,
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    // Determine color based on usage
    const getColor = () => {
        if (percentage >= 1) return colors.error;
        if (percentage >= 0.8) return colors.warning;
        if (percentage >= 0.6) return colors.secondary[500];
        return colors.primary[500];
    };

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.container}>
            <View style={[styles.meterContainer, { width: size, height: size }]}>
                <Svg width={size} height={size}>
                    <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                        {/* Background circle */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={colors.neutral[200]}
                            strokeWidth={strokeWidth}
                            fill="none"
                        />
                        {/* Progress circle */}
                        <AnimatedCircle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke={getColor()}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </G>
                </Svg>

                {/* Center content */}
                <View style={styles.centerContent}>
                    <Text style={styles.usedCount}>{used}</Text>
                    <Text style={styles.limitText}>of {limit}</Text>
                    {showLabel && (
                        <Text style={styles.labelText}>today</Text>
                    )}
                </View>
            </View>

            {/* Status message */}
            <View style={styles.statusContainer}>
                {percentage >= 1 ? (
                    <Text style={[styles.statusText, { color: colors.error }]}>
                        Budget reached
                    </Text>
                ) : percentage >= 0.8 ? (
                    <Text style={[styles.statusText, { color: colors.warning }]}>
                        {remaining} remaining
                    </Text>
                ) : (
                    <Text style={[styles.statusText, { color: colors.primary[500] }]}>
                        {remaining} remaining
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    meterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    usedCount: {
        fontSize: typography.sizes.giant,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    limitText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
        marginTop: -4,
    },
    labelText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
        marginTop: 4,
    },
    statusContainer: {
        marginTop: spacing.md,
    },
    statusText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.medium,
    },
});

export default BudgetMeter;
