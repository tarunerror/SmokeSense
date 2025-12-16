// SmokeSense Type Definitions

// Mood options for logging
export type Mood =
    | 'calm'
    | 'stressed'
    | 'social'
    | 'bored'
    | 'anxious'
    | 'happy'
    | 'tired'
    | 'focused';

// Activity context
export type Activity =
    | 'work'
    | 'break'
    | 'social'
    | 'driving'
    | 'afterMeal'
    | 'morning'
    | 'commute'
    | 'relaxing'
    | 'other';

// Cigarette log entry
export interface CigaretteLog {
    id: string;
    timestamp: number; // Unix timestamp
    date: string; // YYYY-MM-DD for grouping
    mood?: Mood;
    activity?: Activity;
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
    };
    notes?: string;
    wasDelayed: boolean; // Used delay timer before logging
    delayDuration?: number; // Seconds waited if delayed
    synced: boolean; // For offline sync tracking
}

// Daily budget configuration
export interface DailyBudget {
    limit: number;
    date: string; // YYYY-MM-DD
    used: number;
}

// Financial settings
export interface FinancialSettings {
    pricePerPack: number;
    cigarettesPerPack: number;
    currency: string;
}

// Reduction mode settings
export interface ReductionSettings {
    enabled: boolean;
    strategy: 'gradual' | 'triggerBased' | 'timeBased';
    targetReduction: number; // Percentage
    startDate?: string;
}

// Privacy settings
export interface PrivacySettings {
    pinEnabled: boolean;
    pinHash?: string;
    biometricEnabled: boolean;
    disguiseMode: boolean;
    disguiseName: string;
    neutralNotifications: boolean;
}

// Delay settings
export interface DelaySettings {
    enabled: boolean;
    defaultDelaySeconds: number;
    showBreathingExercise: boolean;
    allowSkip: boolean;
}

// User settings
export interface UserSettings {
    dailyBudget: number;
    financial: FinancialSettings;
    reduction: ReductionSettings;
    privacy: PrivacySettings;
    delay: DelaySettings;
    theme: 'light' | 'dark' | 'system';
    firstLaunch: boolean;
    onboardingComplete: boolean;
}

// Analytics insight
export interface Insight {
    id: string;
    type: 'trigger' | 'pattern' | 'achievement' | 'suggestion';
    title: string;
    description: string;
    data?: Record<string, unknown>;
    createdAt: number;
    dismissed: boolean;
}

// Trigger analysis result
export interface TriggerAnalysis {
    trigger: Mood | Activity | string;
    frequency: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

// Time-based pattern
export interface TimePattern {
    hour: number;
    averageCount: number;
    peakDay?: string;
}

// Daily summary
export interface DailySummary {
    date: string;
    totalCount: number;
    budgetLimit: number;
    moods: Record<Mood, number>;
    activities: Record<Activity, number>;
    averageDelayTime: number;
    delayedCount: number;
}

// Weekly summary
export interface WeeklySummary {
    weekStart: string;
    weekEnd: string;
    totalCount: number;
    dailyAverage: number;
    topTriggers: TriggerAnalysis[];
    peakDay: string;
    peakHour: number;
    comparedToLastWeek: number; // Percentage change
}

// Future projection
export interface Projection {
    timeframe: 'month' | 'quarter' | 'year' | '5years';
    currentRate: {
        cigarettes: number;
        cost: number;
        timeSpent: number; // Minutes
    };
    reducedRate?: {
        cigarettes: number;
        cost: number;
        timeSpent: number;
        savings: number;
    };
}

// Replacement ritual
export interface Ritual {
    id: string;
    name: string;
    description: string;
    duration: number; // Seconds
    category: 'physical' | 'mental' | 'sensory';
    icon: string;
}

// Default settings
export const defaultUserSettings: UserSettings = {
    dailyBudget: 20,
    financial: {
        pricePerPack: 100,
        cigarettesPerPack: 10,
        currency: '₹',
    },
    reduction: {
        enabled: false,
        strategy: 'gradual',
        targetReduction: 10,
    },
    privacy: {
        pinEnabled: false,
        biometricEnabled: false,
        disguiseMode: false,
        disguiseName: 'Wellness Tracker',
        neutralNotifications: true,
    },
    delay: {
        enabled: false,
        defaultDelaySeconds: 120,
        showBreathingExercise: true,
        allowSkip: true,
    },
    theme: 'system',
    firstLaunch: true,
    onboardingComplete: false,
};
