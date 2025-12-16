// Smart Reduction Engine
import { CigaretteLog, TriggerAnalysis, Mood, Activity, Ritual } from '../types';
import { analyzeMoodTriggers, analyzeActivityTriggers } from './analytics';

// Pre-defined replacement rituals
export const replacementRituals: Ritual[] = [
    {
        id: 'deep-breath',
        name: 'Deep Breathing',
        description: 'Take 5 slow, deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.',
        duration: 60,
        category: 'physical',
        icon: 'fitness-outline',
    },
    {
        id: 'water',
        name: 'Drink Water',
        description: 'Slowly drink a full glass of water. Focus on the sensation.',
        duration: 30,
        category: 'sensory',
        icon: 'water-outline',
    },
    {
        id: 'stretch',
        name: 'Quick Stretch',
        description: 'Stand up and stretch your arms, neck, and back for a minute.',
        duration: 60,
        category: 'physical',
        icon: 'body-outline',
    },
    {
        id: 'walk',
        name: 'Short Walk',
        description: 'Take a 2-minute walk, even if just around the room.',
        duration: 120,
        category: 'physical',
        icon: 'walk-outline',
    },
    {
        id: 'fidget',
        name: 'Hand Activity',
        description: 'Use a stress ball, pen, or anything to keep your hands busy.',
        duration: 60,
        category: 'physical',
        icon: 'hand-left-outline',
    },
    {
        id: 'mint',
        name: 'Fresh Taste',
        description: 'Have a mint, gum, or a piece of fruit to change the oral sensation.',
        duration: 30,
        category: 'sensory',
        icon: 'leaf-outline',
    },
    {
        id: 'meditation',
        name: 'Quick Meditation',
        description: 'Close your eyes and focus on your breath for 2 minutes.',
        duration: 120,
        category: 'mental',
        icon: 'eye-off-outline',
    },
    {
        id: 'music',
        name: 'Listen to Music',
        description: 'Put on your favorite song and really listen to it.',
        duration: 180,
        category: 'mental',
        icon: 'musical-notes-outline',
    },
];

// Get recommended rituals based on current mood
export const getRecommendedRituals = (mood?: Mood): Ritual[] => {
    const moodRitualMap: Partial<Record<Mood, string[]>> = {
        stressed: ['deep-breath', 'meditation', 'walk'],
        anxious: ['deep-breath', 'stretch', 'water'],
        bored: ['walk', 'music', 'fidget'],
        tired: ['water', 'stretch', 'walk'],
        focused: ['water', 'fidget', 'mint'],
    };

    if (mood && moodRitualMap[mood]) {
        const recommendedIds = moodRitualMap[mood];
        return replacementRituals.filter((r) => recommendedIds?.includes(r.id));
    }

    // Default recommendations
    return replacementRituals.slice(0, 3);
};

// Generate reduction suggestions based on triggers
export const generateReductionStrategy = async (
    currentDailyAverage: number,
    targetReduction: number // percentage
): Promise<{
    dailyTarget: number;
    weeklyTarget: number;
    suggestions: string[];
}> => {
    const [moodTriggers, activityTriggers] = await Promise.all([
        analyzeMoodTriggers(14),
        analyzeActivityTriggers(14),
    ]);

    const dailyTarget = Math.max(1, Math.round(currentDailyAverage * (1 - targetReduction / 100)));
    const weeklyTarget = dailyTarget * 7;

    const suggestions: string[] = [];

    // Analyze top triggers and generate suggestions
    const topMood = moodTriggers[0];
    const topActivity = activityTriggers[0];

    if (topMood?.percentage > 25) {
        const moodSuggestions: Partial<Record<Mood, string>> = {
            stressed: "Try a breathing exercise when feeling stressed instead of reaching for a cigarette.",
            bored: "Keep your hands busy with a stress ball or fidget toy during idle moments.",
            social: "In social situations, try holding a drink or snack instead.",
            anxious: "Practice the 4-7-8 breathing technique when anxiety triggers the urge.",
        };
        if (moodSuggestions[topMood.trigger as Mood]) {
            suggestions.push(moodSuggestions[topMood.trigger as Mood]!);
        }
    }

    if (topActivity?.percentage > 25) {
        const activitySuggestions: Partial<Record<Activity, string>> = {
            break: "Replace one break cigarette with a short walk instead.",
            afterMeal: "After meals, try chewing gum or having a mint.",
            morning: "Delay your first cigarette by 30 minutes each week.",
            commute: "Keep gum or mints in your car for the commute.",
        };
        if (activitySuggestions[topActivity.trigger as Activity]) {
            suggestions.push(activitySuggestions[topActivity.trigger as Activity]!);
        }
    }

    // Add general suggestions
    suggestions.push(
        `Start by reducing to ${dailyTarget} cigarettes per day this week.`,
        "Use the delay timer to create space between urge and action.",
        "Track your progress—awareness is the first step to change."
    );

    return {
        dailyTarget,
        weeklyTarget,
        suggestions: suggestions.slice(0, 4), // Max 4 suggestions
    };
};

// Calculate streak (days without exceeding budget)
export const calculateStreak = (
    dailyLogs: { date: string; count: number }[],
    budget: number
): number => {
    let streak = 0;
    const sortedLogs = [...dailyLogs].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const log of sortedLogs) {
        if (log.count <= budget) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};
