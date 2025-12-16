// Trend Chart Component - Simple custom implementation
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { colors, spacing, typography, borderRadius } from '../theme';

interface TrendChartProps {
    data: { date: string; count: number }[];
    title?: string;
    height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({
    data,
    title = 'Daily Trend',
    height = 180,
}) => {
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - spacing.lg * 3;
    const chartHeight = height - 40;

    if (data.length === 0) {
        return (
            <View style={styles.container}>
                {title && <Text style={styles.title}>{title}</Text>}
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            </View>
        );
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);
    const minY = 0;
    const paddingLeft = 30;
    const paddingBottom = 25;
    const graphWidth = chartWidth - paddingLeft;
    const graphHeight = chartHeight - paddingBottom;

    const getX = (index: number) => {
        return paddingLeft + (index / (data.length - 1 || 1)) * graphWidth;
    };

    const getY = (value: number) => {
        return graphHeight - (value / maxCount) * graphHeight;
    };

    // Create path for the line
    const linePath = data
        .map((point, index) => {
            const x = getX(index);
            const y = getY(point.count);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');

    // Create path for the area fill
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${graphHeight} L ${paddingLeft} ${graphHeight} Z`;

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Svg width={chartWidth} height={chartHeight}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                    <Line
                        key={ratio}
                        x1={paddingLeft}
                        y1={getY(maxCount * ratio)}
                        x2={chartWidth}
                        y2={getY(maxCount * ratio)}
                        stroke={colors.neutral[100]}
                        strokeWidth={1}
                        strokeDasharray="4,4"
                    />
                ))}

                {/* Y-axis labels */}
                <SvgText
                    x={paddingLeft - 8}
                    y={getY(maxCount) + 4}
                    fontSize={10}
                    fill={colors.neutral[400]}
                    textAnchor="end"
                >
                    {maxCount}
                </SvgText>
                <SvgText
                    x={paddingLeft - 8}
                    y={graphHeight + 4}
                    fontSize={10}
                    fill={colors.neutral[400]}
                    textAnchor="end"
                >
                    0
                </SvgText>

                {/* Area fill */}
                <Path d={areaPath} fill={colors.primary[100]} opacity={0.5} />

                {/* Line */}
                <Path
                    d={linePath}
                    stroke={colors.primary[500]}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {data.map((point, index) => (
                    <Circle
                        key={index}
                        cx={getX(index)}
                        cy={getY(point.count)}
                        r={4}
                        fill={colors.primary[500]}
                    />
                ))}

                {/* X-axis labels */}
                {data.map((point, index) => {
                    if (data.length <= 7 || index % Math.ceil(data.length / 7) === 0) {
                        return (
                            <SvgText
                                key={`label-${index}`}
                                x={getX(index)}
                                y={chartHeight - 5}
                                fontSize={10}
                                fill={colors.neutral[400]}
                                textAnchor="middle"
                            >
                                {point.date.split('-')[2]}
                            </SvgText>
                        );
                    }
                    return null;
                })}
            </Svg>

            {/* Summary stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {data.reduce((sum, d) => sum + d.count, 0)}
                    </Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {(data.reduce((sum, d) => sum + d.count, 0) / data.length).toFixed(1)}
                    </Text>
                    <Text style={styles.statLabel}>Daily Avg</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                        {Math.max(...data.map((d) => d.count))}
                    </Text>
                    <Text style={styles.statLabel}>Peak</Text>
                </View>
            </View>
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
        marginBottom: spacing.sm,
    },
    emptyState: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[400],
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.neutral[100],
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
});

export default TrendChart;
