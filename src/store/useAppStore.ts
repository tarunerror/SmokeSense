// Zustand Store for SmokeSense
import { create } from 'zustand';
import {
    CigaretteLog,
    UserSettings,
    Insight,
    DailyBudget,
    defaultUserSettings
} from '../types';
import * as db from '../database/db';
import { initializeDatabase } from '../database/schema';

interface AppState {
    // State
    initialized: boolean;
    isLocked: boolean;
    settings: UserSettings;
    todayLogs: CigaretteLog[];
    todayCount: number;
    todayBudget: DailyBudget | null;
    recentLogs: CigaretteLog[];
    insights: Insight[];
    isLogging: boolean;
    showDelayTimer: boolean;
    delayStartTime: number | null;

    // Actions
    initialize: () => Promise<void>;
    unlock: () => void;
    lock: () => void;

    // Logging actions
    logCigarette: (log: Omit<CigaretteLog, 'id' | 'timestamp' | 'date' | 'synced'>) => Promise<void>;
    startDelayTimer: () => void;
    cancelDelay: () => void;
    completeDelay: () => void;

    // Settings actions
    updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

    // Data loading
    loadTodayData: () => Promise<void>;
    loadRecentLogs: (limit?: number) => Promise<void>;
    loadInsights: () => Promise<void>;

    // Budget actions
    setDailyBudgetLimit: (limit: number) => Promise<void>;
    resetTodayCount: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    initialized: false,
    isLocked: false,
    settings: defaultUserSettings,
    todayLogs: [],
    todayCount: 0,
    todayBudget: null,
    recentLogs: [],
    insights: [],
    isLogging: false,
    showDelayTimer: false,
    delayStartTime: null,

    // Initialize the app
    initialize: async () => {
        try {
            await initializeDatabase();

            // Load settings
            const settingsJson = await db.getSetting('userSettings');
            const settings = settingsJson
                ? { ...defaultUserSettings, ...JSON.parse(settingsJson) }
                : defaultUserSettings;

            // Check if PIN is enabled
            const isLocked = settings.privacy.pinEnabled;

            set({
                initialized: true,
                settings,
                isLocked,
            });

            // Load initial data if not locked
            if (!isLocked) {
                await get().loadTodayData();
                await get().loadRecentLogs(50);
                await get().loadInsights();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            set({ initialized: true, settings: defaultUserSettings });
        }
    },

    unlock: () => {
        set({ isLocked: false });
        get().loadTodayData();
        get().loadRecentLogs(50);
        get().loadInsights();
    },

    lock: () => {
        const { settings } = get();
        if (settings.privacy.pinEnabled) {
            set({ isLocked: true });
        }
    },

    // Log a cigarette
    logCigarette: async (logData) => {
        const { settings, todayCount, todayBudget } = get();
        set({ isLogging: true });

        try {
            const now = Date.now();
            const today = db.getTodayDate();

            const log: CigaretteLog = {
                id: db.generateId(),
                timestamp: now,
                date: today,
                synced: true,
                ...logData,
                wasDelayed: logData.wasDelayed ?? false,
            };

            await db.insertLog(log);

            // Update today's count
            const newCount = todayCount + 1;

            // Update budget usage
            if (todayBudget) {
                const updatedBudget = { ...todayBudget, used: newCount };
                await db.setDailyBudget(updatedBudget);
                set({ todayBudget: updatedBudget });
            } else {
                // Create new budget entry for today
                const newBudget: DailyBudget = {
                    date: today,
                    limit: settings.dailyBudget,
                    used: newCount,
                };
                await db.setDailyBudget(newBudget);
                set({ todayBudget: newBudget });
            }

            set((state) => ({
                todayLogs: [log, ...state.todayLogs],
                todayCount: newCount,
                recentLogs: [log, ...state.recentLogs.slice(0, 49)],
                isLogging: false,
                showDelayTimer: false,
                delayStartTime: null,
            }));
        } catch (error) {
            console.error('Failed to log cigarette:', error);
            set({ isLogging: false });
        }
    },

    startDelayTimer: () => {
        set({ showDelayTimer: true, delayStartTime: Date.now() });
    },

    cancelDelay: () => {
        set({ showDelayTimer: false, delayStartTime: null });
    },

    completeDelay: () => {
        set({ showDelayTimer: false });
    },

    // Update settings
    updateSettings: async (newSettings) => {
        const { settings } = get();
        const updatedSettings = { ...settings, ...newSettings };

        await db.setSetting('userSettings', JSON.stringify(updatedSettings));
        set({ settings: updatedSettings });
    },

    // Load today's data
    loadTodayData: async () => {
        const today = db.getTodayDate();
        const { settings } = get();

        try {
            const [logs, budget] = await Promise.all([
                db.getLogsByDate(today),
                db.getDailyBudget(today),
            ]);

            // Initialize budget for today if not exists
            let todayBudget = budget;
            if (!todayBudget) {
                todayBudget = {
                    date: today,
                    limit: settings.dailyBudget,
                    used: logs.length,
                };
                await db.setDailyBudget(todayBudget);
            }

            set({
                todayLogs: logs,
                todayCount: logs.length,
                todayBudget,
            });
        } catch (error) {
            console.error('Failed to load today data:', error);
        }
    },

    // Load recent logs
    loadRecentLogs: async (limit = 50) => {
        try {
            const logs = await db.getAllLogs(limit);
            set({ recentLogs: logs });
        } catch (error) {
            console.error('Failed to load recent logs:', error);
        }
    },

    // Load insights
    loadInsights: async () => {
        try {
            const insights = await db.getActiveInsights();
            set({ insights });
        } catch (error) {
            console.error('Failed to load insights:', error);
        }
    },

    // Set daily budget limit
    setDailyBudgetLimit: async (limit) => {
        const { settings, todayBudget } = get();

        // Update settings
        await get().updateSettings({ dailyBudget: limit });

        // Update today's budget
        if (todayBudget) {
            const updatedBudget = { ...todayBudget, limit };
            await db.setDailyBudget(updatedBudget);
            set({ todayBudget: updatedBudget });
        }
    },

    // Reset today's cigarette count
    resetTodayCount: async () => {
        const today = db.getTodayDate();
        const { settings } = get();

        try {
            // Delete all logs for today
            await db.deleteLogsByDate(today);

            // Reset today's budget
            const newBudget = {
                date: today,
                limit: settings.dailyBudget,
                used: 0,
            };
            await db.setDailyBudget(newBudget);

            set({
                todayLogs: [],
                todayCount: 0,
                todayBudget: newBudget,
                recentLogs: get().recentLogs.filter((log) => log.date !== today),
            });
        } catch (error) {
            console.error('Failed to reset today count:', error);
        }
    },
}));
