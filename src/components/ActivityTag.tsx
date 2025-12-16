// Activity Tag Selector Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { colors, spacing, borderRadius } from '../theme';

interface ActivityTagProps {
    selectedActivity?: Activity;
    onSelect: (activity: Activity | undefined) => void;
    compact?: boolean;
}

const activities: { activity: Activity; icon: string; label: string }[] = [
    { activity: 'work', icon: 'briefcase-outline', label: 'Work' },
    { activity: 'break', icon: 'cafe-outline', label: 'Break' },
    { activity: 'social', icon: 'chatbubbles-outline', label: 'Social' },
    { activity: 'driving', icon: 'car-outline', label: 'Driving' },
    { activity: 'afterMeal', icon: 'restaurant-outline', label: 'After Meal' },
    { activity: 'morning', icon: 'sunny-outline', label: 'Morning' },
    { activity: 'commute', icon: 'train-outline', label: 'Commute' },
    { activity: 'relaxing', icon: 'bed-outline', label: 'Relaxing' },
    { activity: 'other', icon: 'ellipsis-horizontal-outline', label: 'Other' },
];

export const ActivityTag: React.FC<ActivityTagProps> = ({
    selectedActivity,
    onSelect,
    compact = false,
}) => {
    const handleSelect = (activity: Activity) => {
        if (selectedActivity === activity) {
            onSelect(undefined);
        } else {
            onSelect(activity);
        }
    };

    return (
        <View style={styles.container}>
            {!compact && (
                <Text style={styles.label}>What were you doing? (optional)</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {activities.map(({ activity, icon, label }) => (
                    <TouchableOpacity
                        key={activity}
                        onPress={() => handleSelect(activity)}
                        style={[
                            styles.tagButton,
                            selectedActivity === activity && styles.tagButtonSelected,
                        ]}
                    >
                        <Ionicons
                            name={icon as any}
                            size={compact ? 18 : 20}
                            color={
                                selectedActivity === activity
                                    ? colors.neutral[0]
                                    : colors.neutral[600]
                            }
                        />
                        {!compact && (
                            <Text
                                style={[
                                    styles.tagLabel,
                                    selectedActivity === activity && styles.tagLabelSelected,
                                ]}
                            >
                                {label}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.neutral[600],
        marginBottom: spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: spacing.xs,
        gap: spacing.sm,
    },
    tagButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        backgroundColor: colors.neutral[50],
        gap: spacing.xs,
    },
    tagButtonSelected: {
        backgroundColor: colors.secondary[500],
        borderColor: colors.secondary[500],
    },
    tagLabel: {
        fontSize: 13,
        color: colors.neutral[600],
    },
    tagLabelSelected: {
        color: colors.neutral[0],
        fontWeight: '600',
    },
});

export default ActivityTag;
