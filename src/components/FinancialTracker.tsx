// Financial Tracker Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';

interface FinancialTrackerProps {
    totalCigarettes: number;
    pricePerPack: number;
    cigarettesPerPack: number;
    currency: string;
    days: number;
}

export const FinancialTracker: React.FC<FinancialTrackerProps> = ({
    totalCigarettes,
    pricePerPack,
    cigarettesPerPack,
    currency,
    days,
}) => {
    const pricePerCigarette = pricePerPack / cigarettesPerPack;
    const totalSpent = totalCigarettes * pricePerCigarette;
    const dailyAverage = totalSpent / days;

    // Alternative purchases for perspective
    const alternatives = [
        { name: 'Coffee', icon: 'cafe', price: 5, emoji: '☕' },
        { name: 'Movie ticket', icon: 'film', price: 12, emoji: '🎬' },
        { name: 'Nice dinner', icon: 'restaurant', price: 50, emoji: '🍽️' },
        { name: 'Streaming month', icon: 'tv', price: 15, emoji: '📺' },
        { name: 'Book', icon: 'book', price: 20, emoji: '📚' },
    ];

    const getAffordableAlternatives = () => {
        return alternatives
            .filter((alt) => totalSpent >= alt.price)
            .map((alt) => ({
                ...alt,
                count: Math.floor(totalSpent / alt.price),
            }))
            .slice(0, 3);
    };

    const affordableItems = getAffordableAlternatives();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Money Spent</Text>

            <View style={styles.mainAmount}>
                <Text style={styles.currency}>{currency}</Text>
                <Text style={styles.amount}>{totalSpent.toFixed(2)}</Text>
            </View>
            <Text style={styles.period}>in the last {days} days</Text>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{currency}{dailyAverage.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>per day</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{currency}{(dailyAverage * 30).toFixed(0)}</Text>
                    <Text style={styles.statLabel}>per month</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{currency}{(dailyAverage * 365).toFixed(0)}</Text>
                    <Text style={styles.statLabel}>per year</Text>
                </View>
            </View>

            {affordableItems.length > 0 && (
                <View style={styles.alternativesSection}>
                    <Text style={styles.alternativesTitle}>That could have been...</Text>
                    <View style={styles.alternativesList}>
                        {affordableItems.map((item) => (
                            <View key={item.name} style={styles.alternativeItem}>
                                <Text style={styles.alternativeEmoji}>{item.emoji}</Text>
                                <View style={styles.alternativeText}>
                                    <Text style={styles.alternativeCount}>{item.count}×</Text>
                                    <Text style={styles.alternativeName}>{item.name}</Text>
                                </View>
                            </View>
                        ))}
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
        marginBottom: spacing.md,
    },
    mainAmount: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    currency: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[600],
        marginTop: 8,
        marginRight: 4,
    },
    amount: {
        fontSize: typography.sizes.giant,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
    },
    period: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
        textAlign: 'center',
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.neutral[100],
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: colors.neutral[200],
    },
    statValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[700],
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
        marginTop: 2,
    },
    alternativesSection: {
        marginTop: spacing.lg,
    },
    alternativesTitle: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[600],
        marginBottom: spacing.sm,
    },
    alternativesList: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    alternativeItem: {
        alignItems: 'center',
    },
    alternativeEmoji: {
        fontSize: 28,
        marginBottom: spacing.xs,
    },
    alternativeText: {
        alignItems: 'center',
    },
    alternativeCount: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
    },
    alternativeName: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[500],
    },
});

export default FinancialTracker;
