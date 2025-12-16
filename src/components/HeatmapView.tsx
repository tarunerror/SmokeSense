// Time Heatmap Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimePattern } from '../types';
import { colors, spacing, typography, borderRadius } from '../theme';

interface HeatmapViewProps {
    data: TimePattern[];
    title?: string;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({
    data,
    title = 'Smoking by Hour',
}) => {
    // Fill in all 24 hours
    const hourData = Array.from({ length: 24 }, (_, i) => {
        const found = data.find((d) => d.hour === i);
        return {
            hour: i,
            averageCount: found?.averageCount || 0,
        };
    });

    const maxCount = Math.max(...hourData.map((d) => d.averageCount), 1);

    const getIntensity = (count: number): string => {
        if (count === 0) return colors.neutral[100];
        const ratio = count / maxCount;
        if (ratio < 0.25) return colors.primary[100];
        if (ratio < 0.5) return colors.primary[200];
        if (ratio < 0.75) return colors.primary[400];
        return colors.primary[600];
    };

    const formatHour = (hour: number): string => {
        if (hour === 0) return '12a';
        if (hour === 12) return '12p';
        if (hour < 12) return `${hour}a`;
        return `${hour - 12}p`;
    };

    // Split into AM/PM rows
    const amHours = hourData.slice(0, 12);
    const pmHours = hourData.slice(12);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.heatmapContainer}>
                {/* AM Row */}
                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>AM</Text>
                    <View style={styles.row}>
                        {amHours.map(({ hour, averageCount }) => (
                            <View key={hour} style={styles.cellContainer}>
                                <View
                                    style={[
                                        styles.cell,
                                        { backgroundColor: getIntensity(averageCount) },
                                    ]}
                                />
                                <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* PM Row */}
                <View style={styles.rowContainer}>
                    <Text style={styles.rowLabel}>PM</Text>
                    <View style={styles.row}>
                        {pmHours.map(({ hour, averageCount }) => (
                            <View key={hour} style={styles.cellContainer}>
                                <View
                                    style={[
                                        styles.cell,
                                        { backgroundColor: getIntensity(averageCount) },
                                    ]}
                                />
                                <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <Text style={styles.legendLabel}>Less</Text>
                <View style={[styles.legendCell, { backgroundColor: colors.neutral[100] }]} />
                <View style={[styles.legendCell, { backgroundColor: colors.primary[100] }]} />
                <View style={[styles.legendCell, { backgroundColor: colors.primary[200] }]} />
                <View style={[styles.legendCell, { backgroundColor: colors.primary[400] }]} />
                <View style={[styles.legendCell, { backgroundColor: colors.primary[600] }]} />
                <Text style={styles.legendLabel}>More</Text>
            </View>

            {/* Peak time callout */}
            {data.length > 0 && (
                <View style={styles.peakCallout}>
                    <Text style={styles.peakText}>
                        Peak time: {formatHour(data.sort((a, b) => b.averageCount - a.averageCount)[0]?.hour || 0)}
                    </Text>
                </View>
            )}
        </View>
    );
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
    heatmapContainer: {
        gap: spacing.md,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowLabel: {
        width: 28,
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        fontWeight: typography.weights.medium,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cellContainer: {
        alignItems: 'center',
    },
    cell: {
        width: 20,
        height: 20,
        borderRadius: 4,
    },
    hourLabel: {
        fontSize: 8,
        color: colors.neutral[400],
        marginTop: 2,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
        gap: spacing.xs,
    },
    legendCell: {
        width: 16,
        height: 16,
        borderRadius: 3,
    },
    legendLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
    },
    peakCallout: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
        alignItems: 'center',
    },
    peakText: {
        fontSize: typography.sizes.sm,
        color: colors.primary[600],
        fontWeight: typography.weights.medium,
    },
});

export default HeatmapView;
