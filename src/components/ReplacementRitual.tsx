// Replacement Ritual Component
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ritual, Mood } from '../types';
import { getRecommendedRituals, replacementRituals } from '../utils/reductionEngine';
import { colors, spacing, typography, borderRadius } from '../theme';

interface ReplacementRitualProps {
    currentMood?: Mood;
    onSelect?: (ritual: Ritual) => void;
}

export const ReplacementRitual: React.FC<ReplacementRitualProps> = ({
    currentMood,
    onSelect,
}) => {
    const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
    const recommended = getRecommendedRituals(currentMood);

    const handleSelect = (ritual: Ritual) => {
        setSelectedRitual(ritual);
        onSelect?.(ritual);
    };

    const formatDuration = (seconds: number): string => {
        if (seconds < 60) return `${seconds}s`;
        return `${Math.floor(seconds / 60)}min`;
    };

    if (selectedRitual) {
        return (
            <View style={styles.activeContainer}>
                <View style={styles.activeHeader}>
                    <Ionicons
                        name={selectedRitual.icon as any}
                        size={48}
                        color={colors.primary[500]}
                    />
                    <Text style={styles.activeTitle}>{selectedRitual.name}</Text>
                    <Text style={styles.activeDuration}>
                        {formatDuration(selectedRitual.duration)}
                    </Text>
                </View>
                <Text style={styles.activeDescription}>{selectedRitual.description}</Text>
                <TouchableOpacity
                    onPress={() => setSelectedRitual(null)}
                    style={styles.doneButton}
                >
                    <Ionicons name="checkmark-circle" size={24} color={colors.neutral[0]} />
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Try a Replacement Ritual</Text>
            <Text style={styles.subtitle}>
                Something else to do instead of smoking
            </Text>

            <View style={styles.categorySection}>
                <Text style={styles.categoryLabel}>Recommended for you</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.ritualsRow}
                >
                    {recommended.map((ritual) => (
                        <TouchableOpacity
                            key={ritual.id}
                            onPress={() => handleSelect(ritual)}
                            style={styles.ritualCard}
                        >
                            <View style={styles.ritualIcon}>
                                <Ionicons
                                    name={ritual.icon as any}
                                    size={24}
                                    color={colors.primary[500]}
                                />
                            </View>
                            <Text style={styles.ritualName}>{ritual.name}</Text>
                            <Text style={styles.ritualDuration}>
                                {formatDuration(ritual.duration)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.categorySection}>
                <Text style={styles.categoryLabel}>All Rituals</Text>
                <View style={styles.ritualsGrid}>
                    {replacementRituals.map((ritual) => (
                        <TouchableOpacity
                            key={ritual.id}
                            onPress={() => handleSelect(ritual)}
                            style={styles.ritualGridItem}
                        >
                            <Ionicons
                                name={ritual.icon as any}
                                size={20}
                                color={colors.neutral[600]}
                            />
                            <Text style={styles.ritualGridName}>{ritual.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
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
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[800],
    },
    subtitle: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[500],
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    categorySection: {
        marginBottom: spacing.lg,
    },
    categoryLabel: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.neutral[600],
        marginBottom: spacing.sm,
    },
    ritualsRow: {
        gap: spacing.sm,
    },
    ritualCard: {
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        width: 100,
    },
    ritualIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    ritualName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        color: colors.neutral[800],
        textAlign: 'center',
    },
    ritualDuration: {
        fontSize: typography.sizes.xs,
        color: colors.neutral[400],
        marginTop: 2,
    },
    ritualsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    ritualGridItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        gap: spacing.xs,
    },
    ritualGridName: {
        fontSize: typography.sizes.sm,
        color: colors.neutral[700],
    },
    activeContainer: {
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
    },
    activeHeader: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    activeTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.neutral[800],
        marginTop: spacing.md,
    },
    activeDuration: {
        fontSize: typography.sizes.md,
        color: colors.primary[600],
        marginTop: spacing.xs,
    },
    activeDescription: {
        fontSize: typography.sizes.md,
        color: colors.neutral[700],
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    doneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary[500],
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        gap: spacing.sm,
    },
    doneButtonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        color: colors.neutral[0],
    },
});

export default ReplacementRitual;
