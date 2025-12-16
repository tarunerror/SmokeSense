// Trigger Breakdown Component - Simple custom implementation
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { TriggerAnalysis } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

interface TriggerBreakdownProps {
    moodTriggers: TriggerAnalysis[];
    activityTriggers: TriggerAnalysis[];
}

const triggerColors = [
    colors.primary[400],
    colors.secondary[400],
    colors.moods.calm,
    colors.moods.stressed,
    colors.moods.social,
    colors.moods.bored,
    colors.moods.anxious,
    colors.moods.happy,
];

export const TriggerBreakdown: React.FC<TriggerBreakdownProps> = ({
    moodTriggers,
    activityTriggers,
}) => {
    const allTriggers = [...moodTriggers, ...activityTriggers]
        .filter((t) => t.frequency > 0)
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 6);

    if (allTriggers.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Top Triggers</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        Log more cigarettes with mood and activity to see your triggers
                    </Text>
                </View>
            </View>
        );
    }

    const total = allTriggers.reduce((sum, t) => sum + t.frequency, 0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Top Triggers</Text>

            {/* Simple bar chart visualization */}
            <View style={styles.barsContainer}>
                {allTriggers.map((trigger, index) => {
                    const percentage = (trigger.frequency / total) * 100;
                    return (
                        <View key={trigger.trigger as string} style={styles.barRow}>
                            <View style={styles.barLabelContainer}>
                                <View
                                    style={[
                                        styles.colorDot,
                                        { backgroundColor: triggerColors[index % triggerColors.length] },
                                    ]}
                                />
                                <Text style={styles.barLabel}>
                                    {formatTriggerName(trigger.trigger as string)}
                                </Text>
                            </View>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            width: `${percentage}%`,
                                            backgroundColor: triggerColors[index % triggerColors.length],
                                        },
                                    ]}
                                />
                            </View>
                            <Text style={styles.barValue}>{trigger.percentage.toFixed(0)}%</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const formatTriggerName = (name: string): string => {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    title: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginBottom: spacing.md,
    },
    emptyState: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
        textAlign: 'center',
    },
    barsContainer: {
        gap: spacing.sm,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    barLabelContainer: {
        width: 90,
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: spacing.xs,
    },
    barLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[700],
        textTransform: 'capitalize',
    },
    barContainer: {
        flex: 1,
        height: 20,
        backgroundColor: colors.neutral[100],
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        marginHorizontal: spacing.sm,
    },
    bar: {
        height: '100%',
        borderRadius: borderRadius.sm,
    },
    barValue: {
        width: 35,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        color: colors.neutral[600],
        textAlign: 'right',
    },
});

export default TriggerBreakdown;
