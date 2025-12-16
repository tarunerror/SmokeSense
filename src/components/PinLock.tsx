// PIN Lock Screen Component
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyPin } from '../utils/security';
import { colors, spacing, typography, borderRadius } from '../theme';

interface PinLockProps {
    onUnlock: () => void;
    appName?: string;
}

export const PinLock: React.FC<PinLockProps> = ({
    onUnlock,
    appName = 'SmokeSense',
}) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    const handlePress = (digit: string) => {
        if (pin.length < 4) {
            const newPin = pin + digit;
            setPin(newPin);
            setError(false);

            if (newPin.length === 4) {
                verifyEnteredPin(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError(false);
    };

    const verifyEnteredPin = async (enteredPin: string) => {
        const isValid = await verifyPin(enteredPin);
        if (isValid) {
            onUnlock();
        } else {
            setError(true);
            setPin('');
            // Shake animation
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    };

    const renderDots = () => (
        <Animated.View
            style={[
                styles.dotsContainer,
                { transform: [{ translateX: shakeAnim }] },
            ]}
        >
            {[0, 1, 2, 3].map((i) => (
                <View
                    key={i}
                    style={[
                        styles.dot,
                        pin.length > i && styles.dotFilled,
                        error && styles.dotError,
                    ]}
                />
            ))}
        </Animated.View>
    );

    const renderKeypad = () => {
        const keys = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', 'delete'],
        ];

        return (
            <View style={styles.keypad}>
                {keys.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keypadRow}>
                        {row.map((key, keyIndex) => {
                            if (key === '') {
                                return <View key={keyIndex} style={styles.keyEmpty} />;
                            }
                            if (key === 'delete') {
                                return (
                                    <TouchableOpacity
                                        key={keyIndex}
                                        onPress={handleDelete}
                                        style={styles.key}
                                    >
                                        <Ionicons
                                            name="backspace-outline"
                                            size={28}
                                            color={colors.neutral[600]}
                                        />
                                    </TouchableOpacity>
                                );
                            }
                            return (
                                <TouchableOpacity
                                    key={keyIndex}
                                    onPress={() => handlePress(key)}
                                    style={styles.key}
                                >
                                    <Text style={styles.keyText}>{key}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="lock-closed" size={48} color={colors.primary[500]} />
                <Text style={styles.appName}>{appName}</Text>
                <Text style={styles.subtitle}>Enter your PIN</Text>
            </View>

            {renderDots()}

            {error && (
                <Text style={styles.errorText}>Incorrect PIN. Try again.</Text>
            )}

            {renderKeypad()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    appName: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.md,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
        marginTop: spacing.xs,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginBottom: spacing.lg,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: colors.neutral[300],
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: colors.primary[500],
        borderColor: colors.primary[500],
    },
    dotError: {
        borderColor: colors.error,
        backgroundColor: colors.error,
    },
    errorText: {
        color: colors.error,
        fontSize: typography.sizes.sm,
        marginBottom: spacing.md,
    },
    keypad: {
        width: '100%',
        maxWidth: 300,
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    key: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.full,
        backgroundColor: colors.neutral[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyEmpty: {
        width: 80,
        height: 80,
    },
    keyText: {
        fontSize: 32,
        fontWeight: typography.weights.medium,
        color: colors.neutral[800],
    },
});

export default PinLock;
