// Mood Selector Component
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mood } from '../types';
import { colors, spacing, borderRadius } from '../theme';

interface MoodSelectorProps {
    selectedMood?: Mood;
    onSelect: (mood: Mood | undefined) => void;
    compact?: boolean;
}

const moods: { mood: Mood; icon: string; label: string }[] = [
    { mood: 'calm', icon: 'leaf-outline', label: 'Calm' },
    { mood: 'stressed', icon: 'flash-outline', label: 'Stressed' },
    { mood: 'social', icon: 'people-outline', label: 'Social' },
    { mood: 'bored', icon: 'time-outline', label: 'Bored' },
    { mood: 'anxious', icon: 'pulse-outline', label: 'Anxious' },
    { mood: 'happy', icon: 'happy-outline', label: 'Happy' },
    { mood: 'tired', icon: 'moon-outline', label: 'Tired' },
    { mood: 'focused', icon: 'eye-outline', label: 'Focused' },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({
    selectedMood,
    onSelect,
    compact = false,
}) => {
    const handleSelect = (mood: Mood) => {
        if (selectedMood === mood) {
            onSelect(undefined);
        } else {
            onSelect(mood);
        }
    };

    return (
        <View style={styles.container}>
            {!compact && (
                <Text style={styles.label}>How are you feeling? (optional)</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {moods.map(({ mood, icon, label }) => (
                    <TouchableOpacity
                        key={mood}
                        onPress={() => handleSelect(mood)}
                        style={[
                            styles.moodButton,
                            selectedMood === mood && {
                                backgroundColor: colors.moods[mood],
                                borderColor: colors.moods[mood],
                            },
                        ]}
                    >
                        <Ionicons
                            name={icon as any}
                            size={compact ? 20 : 24}
                            color={selectedMood === mood ? colors.neutral[0] : colors.neutral[600]}
                        />
                        {!compact && (
                            <Text
                                style={[
                                    styles.moodLabel,
                                    selectedMood === mood && styles.moodLabelSelected,
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
    moodButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutral[200],
        backgroundColor: colors.neutral[50],
        minWidth: 64,
    },
    moodLabel: {
        fontSize: 12,
        color: colors.neutral[600],
        marginTop: spacing.xs,
    },
    moodLabelSelected: {
        color: colors.neutral[0],
        fontWeight: '600',
    },
});

export default MoodSelector;
