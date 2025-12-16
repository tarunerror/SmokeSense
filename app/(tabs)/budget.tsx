// Budget Screen
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
import { FinancialTracker } from '../../src/components/FinancialTracker';
import { FutureProjection } from '../../src/components/FutureProjection';
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
    const [projections, setProjections] = useState<Projection[]>([]);

    // Calculate statistics
    const last30Days = recentLogs.filter((log) => {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return log.timestamp >= thirtyDaysAgo;
    });

    const totalCigarettes = last30Days.length;
    const dailyAverage = totalCigarettes / 30;
    const pricePerCigarette = settings.financial.pricePerPack / settings.financial.cigarettesPerPack;

    useEffect(() => {
        // Calculate projections
        const reducedAverage = dailyAverage * 0.75; // 25% reduction
        const projs = calculateProjections(dailyAverage, pricePerCigarette, reducedAverage);
        setProjections(projs);
    }, [dailyAverage, pricePerCigarette]);

    const handleSaveBudget = () => {
        const newLimit = parseInt(budgetInput, 10);
        if (!isNaN(newLimit) && newLimit > 0) {
            setDailyBudgetLimit(newLimit);
        }
        setEditingBudget(false);
    };

    const startEditing = () => {
        setBudgetInput(String(todayBudget?.limit || settings.dailyBudget));
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
                    <Text style={styles.title}>Budget</Text>
                    <Text style={styles.subtitle}>
                        Track your daily limit and spending
                    </Text>
                </View>

                {/* Daily Budget Section */}
                <View style={styles.budgetSection}>
                    <View style={styles.budgetHeader}>
                        <Text style={styles.sectionTitle}>Today's Budget</Text>
                        <TouchableOpacity onPress={startEditing}>
                            <Ionicons name="pencil-outline" size={20} color={colors.primary[500]} />
                        </TouchableOpacity>
                    </View>

                    {editingBudget ? (
                        <View style={styles.editContainer}>
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
                        <View style={styles.meterContainer}>
                            <BudgetMeter
                                used={todayCount}
                                limit={todayBudget?.limit || settings.dailyBudget}
                                size={200}
                            />
                        </View>
                    )}
                </View>

                {/* Financial Tracker */}
                <View style={styles.section}>
                    <FinancialTracker
                        totalCigarettes={totalCigarettes}
                        pricePerPack={settings.financial.pricePerPack}
                        cigarettesPerPack={settings.financial.cigarettesPerPack}
                        currency={settings.financial.currency}
                        days={30}
                    />
                </View>

                {/* Future Projections */}
                <View style={styles.section}>
                    <FutureProjection
                        projections={projections}
                        currency={settings.financial.currency}
                    />
                </View>

                {/* Quick Stats */}
                <View style={styles.statsCard}>
                    <Text style={styles.sectionTitle}>Your Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{dailyAverage.toFixed(1)}</Text>
                            <Text style={styles.statLabel}>Daily average</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalCigarettes}</Text>
                            <Text style={styles.statLabel}>Last 30 days</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {settings.financial.currency}
                                {(totalCigarettes * pricePerCigarette).toFixed(0)}
                            </Text>
                            <Text style={styles.statLabel}>Total spent</Text>
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
    budgetSection: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    meterContainer: {
        alignItems: 'center',
    },
    editContainer: {
        alignItems: 'center',
        gap: spacing.md,
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
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
    },
    saveButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
    section: {
        marginBottom: spacing.lg,
    },
    statsCard: {
        backgroundColor: colors.background.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
});
