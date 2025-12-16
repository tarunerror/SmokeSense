// Analytics utilities for SmokeSense
import {
    CigaretteLog,
    TriggerAnalysis,
    TimePattern,
    DailySummary,
    WeeklySummary,
    Projection,
    Mood,
    Activity,
} from '../types';
import * as db from '../database/db';

// Analyze mood triggers
export const analyzeMoodTriggers = async (days: number = 30): Promise<TriggerAnalysis[]> => {
    const distribution = await db.getMoodDistribution(days);
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    return distribution.map((item) => ({
        trigger: item.mood as Mood,
        frequency: item.count,
        percentage: total > 0 ? (item.count / total) * 100 : 0,
        trend: 'stable' as const, // Would need historical comparison
    }));
};

// Analyze activity triggers
export const analyzeActivityTriggers = async (days: number = 30): Promise<TriggerAnalysis[]> => {
    const distribution = await db.getActivityDistribution(days);
    const total = distribution.reduce((sum, item) => sum + item.count, 0);

    return distribution.map((item) => ({
        trigger: item.activity as Activity,
        frequency: item.count,
        percentage: total > 0 ? (item.count / total) * 100 : 0,
        trend: 'stable' as const,
    }));
};

// Get hourly patterns
export const getHourlyPatterns = async (days: number = 30): Promise<TimePattern[]> => {
    const distribution = await db.getHourlyDistribution(days);
    const dayCount = Math.max(days, 1);

    return distribution.map((item) => ({
        hour: item.hour,
        averageCount: item.count / dayCount,
    }));
};

// Get daily trend data
export const getDailyTrends = async (days: number = 7): Promise<{ date: string; count: number }[]> => {
    const data = await db.getLogsGroupedByDate(days);

    // Fill in missing dates with 0
    const result: { date: string; count: number }[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const found = data.find((item) => item.date === dateStr);
        result.push({
            date: dateStr,
            count: found?.count || 0,
        });
    }

    return result;
};

// Calculate daily summary
export const getDailySummary = async (date: string): Promise<DailySummary> => {
    const logs = await db.getLogsByDate(date);
    const budget = await db.getDailyBudget(date);

    const moods: Record<Mood, number> = {
        calm: 0, stressed: 0, social: 0, bored: 0,
        anxious: 0, happy: 0, tired: 0, focused: 0,
    };

    const activities: Record<Activity, number> = {
        work: 0, break: 0, social: 0, driving: 0,
        afterMeal: 0, morning: 0, commute: 0, relaxing: 0, other: 0,
    };

    let totalDelayTime = 0;
    let delayedCount = 0;

    logs.forEach((log) => {
        if (log.mood) moods[log.mood]++;
        if (log.activity) activities[log.activity]++;
        if (log.wasDelayed) {
            delayedCount++;
            totalDelayTime += log.delayDuration || 0;
        }
    });

    return {
        date,
        totalCount: logs.length,
        budgetLimit: budget?.limit || 20,
        moods,
        activities,
        averageDelayTime: delayedCount > 0 ? totalDelayTime / delayedCount : 0,
        delayedCount,
    };
};

// Calculate weekly summary
export const getWeeklySummary = async (): Promise<WeeklySummary> => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    const logs = await db.getLogsByDateRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
    );

    // Previous week for comparison
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 6);

    const prevLogs = await db.getLogsByDateRange(
        prevStartDate.toISOString().split('T')[0],
        prevEndDate.toISOString().split('T')[0]
    );

    // Find peak day
    const dayCount: Record<string, number> = {};
    logs.forEach((log) => {
        dayCount[log.date] = (dayCount[log.date] || 0) + 1;
    });
    const peakDay = Object.entries(dayCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

    // Find peak hour
    const hourCount: Record<number, number> = {};
    logs.forEach((log) => {
        const hour = new Date(log.timestamp).getHours();
        hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const peakHour = Number(
        Object.entries(hourCount)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 0
    );

    // Top triggers
    const moodTriggers = await analyzeMoodTriggers(7);
    const activityTriggers = await analyzeActivityTriggers(7);
    const topTriggers = [...moodTriggers, ...activityTriggers]
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 3);

    const change = prevLogs.length > 0
        ? ((logs.length - prevLogs.length) / prevLogs.length) * 100
        : 0;

    return {
        weekStart: startDate.toISOString().split('T')[0],
        weekEnd: endDate.toISOString().split('T')[0],
        totalCount: logs.length,
        dailyAverage: logs.length / 7,
        topTriggers,
        peakDay,
        peakHour,
        comparedToLastWeek: change,
    };
};

// Generate future projections
export const calculateProjections = (
    currentDailyAverage: number,
    pricePerCigarette: number,
    reducedDailyAverage?: number
): Projection[] => {
    const timeframes: Array<{ key: Projection['timeframe']; days: number }> = [
        { key: 'month', days: 30 },
        { key: 'quarter', days: 90 },
        { key: 'year', days: 365 },
        { key: '5years', days: 365 * 5 },
    ];

    const avgTimePerCigarette = 7; // minutes

    return timeframes.map(({ key, days }) => {
        const currentCigarettes = Math.round(currentDailyAverage * days);
        const currentCost = currentCigarettes * pricePerCigarette;
        const currentTime = currentCigarettes * avgTimePerCigarette;

        let reducedRate;
        if (reducedDailyAverage !== undefined) {
            const reducedCigarettes = Math.round(reducedDailyAverage * days);
            reducedRate = {
                cigarettes: reducedCigarettes,
                cost: reducedCigarettes * pricePerCigarette,
                timeSpent: reducedCigarettes * avgTimePerCigarette,
                savings: currentCost - reducedCigarettes * pricePerCigarette,
            };
        }

        return {
            timeframe: key,
            currentRate: {
                cigarettes: currentCigarettes,
                cost: currentCost,
                timeSpent: currentTime,
            },
            reducedRate,
        };
    });
};

// Generate insight messages
export const generateInsightMessage = (
    topMood: TriggerAnalysis | undefined,
    topActivity: TriggerAnalysis | undefined,
    peakHour: number
): string[] => {
    const insights: string[] = [];

    if (topMood && topMood.percentage > 30) {
        const moodMessages: Record<string, string> = {
            stressed: "You tend to smoke more when feeling stressed. Consider trying a breathing exercise next time.",
            bored: "Boredom seems to be a trigger for you. Perhaps a short walk or game could help.",
            social: "Social situations often lead to smoking for you. That's okay—just being aware helps.",
            anxious: "Anxiety appears to trigger smoking. Gentle awareness can help you find alternatives over time.",
        };
        if (moodMessages[topMood.trigger as string]) {
            insights.push(moodMessages[topMood.trigger as string]);
        }
    }

    if (topActivity && topActivity.percentage > 25) {
        const activityMessages: Record<string, string> = {
            break: "Work breaks are a common trigger. Maybe try a different relaxation ritual.",
            afterMeal: "Post-meal smoking is a habit for many. A short walk could be a nice alternative.",
            morning: "Morning routines often include cigarettes. Consider replacing with a warm drink.",
        };
        if (activityMessages[topActivity.trigger as string]) {
            insights.push(activityMessages[topActivity.trigger as string]);
        }
    }

    const hourName = peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? '12 PM' : `${peakHour - 12} PM`;
    insights.push(`Your peak smoking time is around ${hourName}.`);

    return insights;
};
