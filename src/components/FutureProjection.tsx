// Future Projections Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Projection } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

interface FutureProjectionProps {
    projections: Projection[];
    currency: string;
}

export const FutureProjection: React.FC<FutureProjectionProps> = ({
    projections,
    currency,
}) => {
    const [selectedTimeframe, setSelectedTimeframe] = useState<Projection['timeframe']>('year');

    const timeframeLabels: Record<Projection['timeframe'], string> = {
        month: '1 Month',
        quarter: '3 Months',
        year: '1 Year',
        '5years': '5 Years',
    };

    const selectedProjection = projections.find((p) => p.timeframe === selectedTimeframe);

    if (!selectedProjection) return null;

    const formatTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} days`;
        if (hours > 0) return `${hours} hours`;
        return `${minutes} min`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Future Projections</Text>
            <Text style={styles.subtitle}>
                Based on your current smoking rate
            </Text>

            {/* Timeframe selector */}
            <View style={styles.timeframeRow}>
                {projections.map((projection) => (
                    <TouchableOpacity
                        key={projection.timeframe}
                        onPress={() => setSelectedTimeframe(projection.timeframe)}
                        style={[
                            styles.timeframeButton,
                            selectedTimeframe === projection.timeframe && styles.timeframeButtonActive,
                        ]}
                    >
                        <Text
                            style={[
                                styles.timeframeText,
                                selectedTimeframe === projection.timeframe && styles.timeframeTextActive,
                            ]}
                        >
                            {timeframeLabels[projection.timeframe]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Current rate projections */}
            <View style={styles.projectionCard}>
                <Text style={styles.cardLabel}>If you continue at this rate</Text>

                <View style={styles.projectionGrid}>
                    <View style={styles.projectionItem}>
                        <Ionicons name="flame-outline" size={24} color={colors.warning} />
                        <Text style={styles.projectionValue}>
                            {selectedProjection.currentRate.cigarettes.toLocaleString()}
                        </Text>
                        <Text style={styles.projectionLabel}>cigarettes</Text>
                    </View>

                    <View style={styles.projectionItem}>
                        <Ionicons name="wallet-outline" size={24} color={colors.error} />
                        <Text style={styles.projectionValue}>
                            {currency}{selectedProjection.currentRate.cost.toLocaleString()}
                        </Text>
                        <Text style={styles.projectionLabel}>spent</Text>
                    </View>

                    <View style={styles.projectionItem}>
                        <Ionicons name="time-outline" size={24} color={colors.neutral[500]} />
                        <Text style={styles.projectionValue}>
                            {formatTime(selectedProjection.currentRate.timeSpent)}
                        </Text>
                        <Text style={styles.projectionLabel}>time spent</Text>
                    </View>
                </View>
            </View>

            {/* Potential savings if reduced */}
            {selectedProjection.reducedRate && (
                <View style={[styles.projectionCard, styles.savingsCard]}>
                    <Text style={styles.cardLabel}>With 25% reduction</Text>

                    <View style={styles.savingsRow}>
                        <View style={styles.savingsItem}>
                            <Text style={styles.savingsValue}>
                                {currency}{selectedProjection.reducedRate.savings.toLocaleString()}
                            </Text>
                            <Text style={styles.savingsLabel}>saved</Text>
                        </View>
                        <View style={styles.savingsItem}>
                            <Text style={styles.savingsValue}>
                                {selectedProjection.currentRate.cigarettes - selectedProjection.reducedRate.cigarettes}
                            </Text>
                            <Text style={styles.savingsLabel}>fewer cigarettes</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
        marginTop: spacing.xs,
        marginBottom: spacing.md,
    },
    timeframeRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    timeframeButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.neutral[100],
        alignItems: 'center',
    },
    timeframeButtonActive: {
        backgroundColor: colors.primary[500],
    },
    timeframeText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        color: colors.neutral[600],
    },
    timeframeTextActive: {
        color: colors.neutral[0],
    },
    projectionCard: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    cardLabel: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
        marginBottom: spacing.md,
    },
    projectionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    projectionItem: {
        alignItems: 'center',
    },
    projectionValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.sm,
    },
    projectionLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
    savingsCard: {
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
    },
    savingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    savingsItem: {
        alignItems: 'center',
    },
    savingsValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
    },
    savingsLabel: {
        fontSize: typography.sizes.xs,
        color: colors.primary[700],
        marginTop: 2,
    },
});

export default FutureProjection;
