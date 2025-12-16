// Insights Screen - Redesigned UI
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { TrendChart } from '../../src/components/TrendChart';
import { TriggerBreakdown } from '../../src/components/TriggerBreakdown';
import { HeatmapView } from '../../src/components/HeatmapView';
import {
    getDailyTrends,
    analyzeMoodTriggers,
    analyzeActivityTriggers,
    getHourlyPatterns,
    generateInsightMessage,
} from '../../src/utils/analytics';
import { TriggerAnalysis, TimePattern } from '../../src/types';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function InsightsScreen() {
    const { recentLogs, loadRecentLogs, settings } = useAppStore();
    const [refreshing, setRefreshing] = useState(false);
    const [trendData, setTrendData] = useState<{ date: string; count: number }[]>([]);
    const [moodTriggers, setMoodTriggers] = useState<TriggerAnalysis[]>([]);
    const [activityTriggers, setActivityTriggers] = useState<TriggerAnalysis[]>([]);
    const [hourlyPatterns, setHourlyPatterns] = useState<TimePattern[]>([]);
    const [insights, setInsights] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'triggers' | 'patterns'>('overview');

    const loadAnalytics = async () => {
        try {
            const [trends, moods, activities, patterns] = await Promise.all([
                getDailyTrends(7),
                analyzeMoodTriggers(30),
                analyzeActivityTriggers(30),
                getHourlyPatterns(30),
            ]);

            setTrendData(trends);
            setMoodTriggers(moods);
            setActivityTriggers(activities);
            setHourlyPatterns(patterns);

            // Generate insights
            const peakHour = patterns.sort((a, b) => b.averageCount - a.averageCount)[0]?.hour || 12;
            const topMood = moods[0];
            const topActivity = activities[0];
            setInsights(generateInsightMessage(topMood, topActivity, peakHour));
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [recentLogs]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRecentLogs(100);
        await loadAnalytics();
        setRefreshing(false);
    };

    const hasData = recentLogs.length > 0;

    // Calculate stats
    const totalThisWeek = trendData.reduce((sum, d) => sum + d.count, 0);
    const dailyAverage = trendData.length > 0 ? (totalThisWeek / trendData.length).toFixed(1) : '0';
    const peakHour = hourlyPatterns.sort((a, b) => b.averageCount - a.averageCount)[0]?.hour;
    const formatHour = (hour: number) => {
        if (hour === 0) return '12 AM';
        if (hour === 12) return '12 PM';
        return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
    };
    const topTrigger = [...moodTriggers, ...activityTriggers].sort((a, b) => b.frequency - a.frequency)[0];
    const moneySpentWeek = (totalThisWeek / settings.financial.cigarettesPerPack) * settings.financial.pricePerPack;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Insights</Text>
                    <Text style={styles.subtitle}>
                        Your smoking patterns & trends
                    </Text>
                </View>

                {!hasData ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="analytics-outline" size={48} color={colors.primary[400]} />
                        </View>
                        <Text style={styles.emptyTitle}>No data yet</Text>
                        <Text style={styles.emptyText}>
                            Start logging cigarettes to discover your patterns and insights
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Quick Stats Cards */}
                        <View style={styles.statsGrid}>
                            <View style={[styles.statCard, styles.statCardPrimary]}>
                                <Ionicons name="flame" size={24} color={colors.primary[500]} />
                                <Text style={styles.statValue}>{totalThisWeek}</Text>
                                <Text style={styles.statLabel}>This Week</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="trending-up" size={24} color={colors.secondary[500]} />
                                <Text style={styles.statValue}>{dailyAverage}</Text>
                                <Text style={styles.statLabel}>Daily Avg</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="time" size={24} color={colors.moods.focused} />
                                <Text style={styles.statValue}>{peakHour !== undefined ? formatHour(peakHour) : '--'}</Text>
                                <Text style={styles.statLabel}>Peak Time</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="cash" size={24} color={colors.error} />
                                <Text style={styles.statValue}>{settings.financial.currency}{Math.round(moneySpentWeek)}</Text>
                                <Text style={styles.statLabel}>This Week</Text>
                            </View>
                        </View>

                        {/* Insight Banner */}
                        {insights.length > 0 && (
                            <View style={styles.insightBanner}>
                                <View style={styles.insightIconContainer}>
                                    <Ionicons name="bulb" size={24} color={colors.secondary[600]} />
                                </View>
                                <View style={styles.insightContent}>
                                    <Text style={styles.insightTitle}>Insight</Text>
                                    <Text style={styles.insightText}>{insights[0]}</Text>
                                </View>
                            </View>
                        )}

                        {/* Tab Navigation */}
                        <View style={styles.tabContainer}>
                            <TouchableOpacity
                                onPress={() => setActiveTab('overview')}
                                style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
                            >
                                <Ionicons
                                    name="stats-chart"
                                    size={18}
                                    color={activeTab === 'overview' ? colors.primary[500] : colors.neutral[400]}
                                />
                                <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
                                    Trends
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab('triggers')}
                                style={[styles.tab, activeTab === 'triggers' && styles.tabActive]}
                            >
                                <Ionicons
                                    name="flash"
                                    size={18}
                                    color={activeTab === 'triggers' ? colors.primary[500] : colors.neutral[400]}
                                />
                                <Text style={[styles.tabText, activeTab === 'triggers' && styles.tabTextActive]}>
                                    Triggers
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActiveTab('patterns')}
                                style={[styles.tab, activeTab === 'patterns' && styles.tabActive]}
                            >
                                <Ionicons
                                    name="calendar"
                                    size={18}
                                    color={activeTab === 'patterns' ? colors.primary[500] : colors.neutral[400]}
                                />
                                <Text style={[styles.tabText, activeTab === 'patterns' && styles.tabTextActive]}>
                                    Patterns
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tab Content */}
                        <View style={styles.tabContent}>
                            {activeTab === 'overview' && (
                                <View style={styles.chartCard}>
                                    <TrendChart data={trendData} title="Last 7 Days" />
                                </View>
                            )}

                            {activeTab === 'triggers' && (
                                <View style={styles.chartCard}>
                                    <TriggerBreakdown
                                        moodTriggers={moodTriggers}
                                        activityTriggers={activityTriggers}
                                    />
                                </View>
                            )}

                            {activeTab === 'patterns' && (
                                <View style={styles.chartCard}>
                                    <HeatmapView data={hourlyPatterns} />
                                </View>
                            )}
                        </View>

                        {/* Additional Insights */}
                        {insights.length > 1 && (
                            <View style={styles.moreInsights}>
                                <Text style={styles.moreInsightsTitle}>More Insights</Text>
                                {insights.slice(1).map((insight, index) => (
                                    <View key={index} style={styles.insightItem}>
                                        <View style={styles.insightDot} />
                                        <Text style={styles.insightItemText}>{insight}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.secondary,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    subtitle: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
        marginTop: spacing.xs,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxxl,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.xl,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[700],
    },
    emptyText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[400],
        textAlign: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: spacing.xl,
        lineHeight: 22,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    statCardPrimary: {
        backgroundColor: colors.primary[50],
    },
    statValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.xs,
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
    insightBanner: {
        flexDirection: 'row',
        backgroundColor: colors.secondary[50],
        borderRadius: borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.secondary[500],
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    insightIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold,
        color: colors.secondary[600],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: spacing.xs,
    },
    insightText: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[700],
        lineHeight: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.xs,
        marginBottom: spacing.lg,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    tabActive: {
        backgroundColor: colors.primary[50],
    },
    tabText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.neutral[400],
    },
    tabTextActive: {
        color: colors.primary[500],
    },
    tabContent: {
        marginBottom: spacing.lg,
    },
    chartCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    moreInsights: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    moreInsightsTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginBottom: spacing.md,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    insightDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary[400],
        marginTop: 7,
        marginRight: spacing.sm,
    },
    insightItemText: {
        flex: 1,
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
        lineHeight: 20,
    },
});
