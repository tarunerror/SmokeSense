// Budget Screen - Redesigned
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../src/store/useAppStore';
import { BudgetMeter } from '../../src/components/BudgetMeter';
import { calculateProjections } from '../../src/utils/analytics';
import { Projection } from '../../src/types';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

export default function BudgetScreen() {
    const {
        todayCount,
        todayBudget,
        settings,
        recentLogs,
        setDailyBudgetLimit,
    } = useAppStore();

    const [editingBudget, setEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput] = useState('');

    // Calculate statistics
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = recentLogs.filter((log) => log.date === today);

    const last7Days = recentLogs.filter((log) => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return log.timestamp >= sevenDaysAgo;
    });

    const last30Days = recentLogs.filter((log) => {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return log.timestamp >= thirtyDaysAgo;
    });

    const totalToday = todayLogs.length;
    const weeklyTotal = last7Days.length;
    const monthlyTotal = last30Days.length;

    const dailyAverage = last7Days.length > 0 ? (weeklyTotal / 7).toFixed(1) : '0';
    const pricePerCigarette = settings.financial.pricePerPack / settings.financial.cigarettesPerPack;

    const todaySpent = totalToday * pricePerCigarette;
    const weeklySpent = weeklyTotal * pricePerCigarette;
    const monthlySpent = monthlyTotal * pricePerCigarette;

    const budgetLimit = todayBudget?.limit || settings.dailyBudget;
    const budgetRemaining = Math.max(0, budgetLimit - todayCount);
    const budgetPercentage = Math.min((todayCount / budgetLimit) * 100, 100);

    const handleSaveBudget = () => {
        const newLimit = parseInt(budgetInput, 10);
        if (!isNaN(newLimit) && newLimit > 0) {
            setDailyBudgetLimit(newLimit);
        }
        setEditingBudget(false);
    };

    const startEditing = () => {
        setBudgetInput(String(budgetLimit));
        setEditingBudget(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Budget & Spending</Text>
                    <Text style={styles.subtitle}>
                        Track your limits and costs
                    </Text>
                </View>

                {/* Today's Budget Card */}
                <View style={styles.budgetCard}>
                    <View style={styles.budgetCardHeader}>
                        <Text style={styles.cardTitle}>Today's Budget</Text>
                        <TouchableOpacity onPress={startEditing} style={styles.editButton}>
                            <Ionicons name="pencil" size={16} color={colors.primary[500]} />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {editingBudget ? (
                        <View style={styles.editContainer}>
                            <Text style={styles.editLabel}>Set daily limit:</Text>
                            <TextInput
                                style={styles.budgetInput}
                                value={budgetInput}
                                onChangeText={setBudgetInput}
                                keyboardType="number-pad"
                                autoFocus
                            />
                            <View style={styles.editButtons}>
                                <TouchableOpacity
                                    onPress={() => setEditingBudget(false)}
                                    style={styles.cancelButton}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSaveBudget}
                                    style={styles.saveButton}
                                >
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.budgetContent}>
                            <BudgetMeter
                                used={todayCount}
                                limit={budgetLimit}
                                size={160}
                            />
                            <View style={styles.budgetStats}>
                                <View style={styles.budgetStatRow}>
                                    <Text style={styles.budgetStatLabel}>Used</Text>
                                    <Text style={styles.budgetStatValue}>{todayCount}</Text>
                                </View>
                                <View style={styles.budgetStatRow}>
                                    <Text style={styles.budgetStatLabel}>Limit</Text>
                                    <Text style={styles.budgetStatValue}>{budgetLimit}</Text>
                                </View>
                                <View style={styles.budgetStatRow}>
                                    <Text style={styles.budgetStatLabel}>Remaining</Text>
                                    <Text style={[
                                        styles.budgetStatValue,
                                        { color: budgetRemaining === 0 ? colors.error : colors.primary[500] }
                                    ]}>
                                        {budgetRemaining}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Quick Stats Grid */}
                <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Your Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, styles.statCardHighlight]}>
                            <Ionicons name="today" size={24} color={colors.primary[500]} />
                            <Text style={styles.statCardValue}>{totalToday}</Text>
                            <Text style={styles.statCardLabel}>Today</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="calendar" size={24} color={colors.secondary[500]} />
                            <Text style={styles.statCardValue}>{weeklyTotal}</Text>
                            <Text style={styles.statCardLabel}>This Week</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="calendar-outline" size={24} color={colors.moods.focused} />
                            <Text style={styles.statCardValue}>{monthlyTotal}</Text>
                            <Text style={styles.statCardLabel}>This Month</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="trending-up" size={24} color={colors.moods.stressed} />
                            <Text style={styles.statCardValue}>{dailyAverage}</Text>
                            <Text style={styles.statCardLabel}>Daily Avg</Text>
                        </View>
                    </View>
                </View>

                {/* Spending Section */}
                <View style={styles.spendingSection}>
                    <Text style={styles.sectionTitle}>Money Spent</Text>
                    <View style={styles.spendingCard}>
                        <View style={styles.spendingRow}>
                            <View style={styles.spendingItem}>
                                <Text style={styles.spendingLabel}>Today</Text>
                                <Text style={styles.spendingValue}>
                                    {settings.financial.currency}{Math.round(todaySpent)}
                                </Text>
                            </View>
                            <View style={styles.spendingDivider} />
                            <View style={styles.spendingItem}>
                                <Text style={styles.spendingLabel}>This Week</Text>
                                <Text style={styles.spendingValue}>
                                    {settings.financial.currency}{Math.round(weeklySpent)}
                                </Text>
                            </View>
                            <View style={styles.spendingDivider} />
                            <View style={styles.spendingItem}>
                                <Text style={styles.spendingLabel}>This Month</Text>
                                <Text style={styles.spendingValue}>
                                    {settings.financial.currency}{Math.round(monthlySpent)}
                                </Text>
                            </View>
                        </View>

                        {/* Yearly Projection */}
                        <View style={styles.projectionBox}>
                            <Ionicons name="warning" size={20} color={colors.warning} />
                            <View style={styles.projectionText}>
                                <Text style={styles.projectionLabel}>Yearly Projection</Text>
                                <Text style={styles.projectionValue}>
                                    {settings.financial.currency}{Math.round(monthlySpent * 12)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Cost Per Cigarette Info */}
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={20} color={colors.primary[500]} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Your Cost Settings</Text>
                        <Text style={styles.infoText}>
                            Pack of {settings.financial.cigarettesPerPack} = {settings.financial.currency}{settings.financial.pricePerPack}
                        </Text>
                        <Text style={styles.infoText}>
                            Per cigarette = {settings.financial.currency}{pricePerCigarette.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Savings Potential */}
                <View style={styles.savingsCard}>
                    <Text style={styles.savingsTitle}>💡 Potential Savings</Text>
                    <Text style={styles.savingsSubtitle}>
                        If you reduce by 25% (from {dailyAverage} to {(parseFloat(dailyAverage) * 0.75).toFixed(1)}/day):
                    </Text>
                    <View style={styles.savingsRow}>
                        <View style={styles.savingsItem}>
                            <Text style={styles.savingsLabel}>Monthly</Text>
                            <Text style={styles.savingsValue}>
                                {settings.financial.currency}{Math.round(monthlySpent * 0.25)}
                            </Text>
                        </View>
                        <View style={styles.savingsItem}>
                            <Text style={styles.savingsLabel}>Yearly</Text>
                            <Text style={styles.savingsValue}>
                                {settings.financial.currency}{Math.round(monthlySpent * 12 * 0.25)}
                            </Text>
                        </View>
                    </View>
                </View>
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
    budgetCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    budgetCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    editButtonText: {
        fontSize: typography.sizes.sm,
        color: colors.primary[500],
    },
    budgetContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    budgetStats: {
        flex: 1,
        marginLeft: spacing.lg,
        gap: spacing.sm,
    },
    budgetStatRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: colors.neutral[100],
    },
    budgetStatLabel: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
    },
    budgetStatValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    editContainer: {
        alignItems: 'center',
        gap: spacing.md,
    },
    editLabel: {
        fontSize: typography.sizes.md,
        color: colors.neutral[600],
    },
    budgetInput: {
        fontSize: typography.sizes.giant,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        textAlign: 'center',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary[500],
        paddingVertical: spacing.sm,
        minWidth: 100,
    },
    editButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    cancelButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    cancelButtonText: {
        fontSize: typography.sizes.md,
        color: colors.neutral[500],
    },
    saveButton: {
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
    },
    saveButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
        marginBottom: spacing.md,
    },
    statsSection: {
        marginBottom: spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    statCardHighlight: {
        backgroundColor: colors.primary[50],
    },
    statCardValue: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.xs,
    },
    statCardLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
    spendingSection: {
        marginBottom: spacing.lg,
    },
    spendingCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    spendingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    spendingItem: {
        flex: 1,
        alignItems: 'center',
    },
    spendingDivider: {
        width: 1,
        backgroundColor: colors.neutral[200],
    },
    spendingLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
    },
    spendingValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.xs,
    },
    projectionBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.warning + '15',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    projectionText: {
        flex: 1,
    },
    projectionLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[600],
    },
    projectionValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        color: colors.warning,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        color: colors.primary[700],
    },
    infoText: {
        fontSize: typography.sizes.sm,
        color: colors.primary[600],
        marginTop: 2,
    },
    savingsCard: {
        backgroundColor: colors.secondary[50],
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    savingsTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.secondary[700],
    },
    savingsSubtitle: {
        fontSize: typography.sizes.sm,
        color: colors.secondary[600],
        marginTop: spacing.xs,
    },
    savingsRow: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginTop: spacing.md,
    },
    savingsItem: {
        flex: 1,
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
    },
    savingsLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
    },
    savingsValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.secondary[600],
        marginTop: spacing.xs,
    },
});
