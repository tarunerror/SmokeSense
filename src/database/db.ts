// Database operations for SmokeSense
import { getDatabase } from './schema';
import { CigaretteLog, Insight, DailyBudget } from '../types';

// Generate unique ID
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

// ==================== CIGARETTE LOGS ====================

export const insertLog = async (log: CigaretteLog): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO cigarette_logs (
      id, timestamp, date, mood, activity, 
      location_lat, location_lng, location_name, 
      notes, was_delayed, delay_duration, synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            log.id,
            log.timestamp,
            log.date,
            log.mood || null,
            log.activity || null,
            log.location?.latitude || null,
            log.location?.longitude || null,
            log.location?.name || null,
            log.notes || null,
            log.wasDelayed ? 1 : 0,
            log.delayDuration || null,
            log.synced ? 1 : 0,
        ]
    );
};

export const getLogsByDate = async (date: string): Promise<CigaretteLog[]> => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
        'SELECT * FROM cigarette_logs WHERE date = ? ORDER BY timestamp DESC',
        [date]
    );
    return rows.map(mapRowToLog);
};

export const getLogsByDateRange = async (
    startDate: string,
    endDate: string
): Promise<CigaretteLog[]> => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
        'SELECT * FROM cigarette_logs WHERE date >= ? AND date <= ? ORDER BY timestamp DESC',
        [startDate, endDate]
    );
    return rows.map(mapRowToLog);
};

export const getTodayLogCount = async (): Promise<number> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM cigarette_logs WHERE date = ?',
        [getTodayDate()]
    );
    return result?.count || 0;
};

export const getAllLogs = async (limit?: number): Promise<CigaretteLog[]> => {
    const db = await getDatabase();
    const query = limit
        ? 'SELECT * FROM cigarette_logs ORDER BY timestamp DESC LIMIT ?'
        : 'SELECT * FROM cigarette_logs ORDER BY timestamp DESC';
    const rows = await db.getAllAsync<any>(query, limit ? [limit] : []);
    return rows.map(mapRowToLog);
};

export const deleteLog = async (id: string): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cigarette_logs WHERE id = ?', [id]);
};

export const deleteLogsByDate = async (date: string): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM cigarette_logs WHERE date = ?', [date]);
};

const mapRowToLog = (row: any): CigaretteLog => ({
    id: row.id,
    timestamp: row.timestamp,
    date: row.date,
    mood: row.mood,
    activity: row.activity,
    location: row.location_lat
        ? {
            latitude: row.location_lat,
            longitude: row.location_lng,
            name: row.location_name,
        }
        : undefined,
    notes: row.notes,
    wasDelayed: !!row.was_delayed,
    delayDuration: row.delay_duration,
    synced: !!row.synced,
});

// ==================== SETTINGS ====================

export const getSetting = async (key: string): Promise<string | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        [key]
    );
    return result?.value || null;
};

export const setSetting = async (key: string, value: string): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)`,
        [key, value, Date.now()]
    );
};

export const getAllSettings = async (): Promise<Record<string, string>> => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>(
        'SELECT key, value FROM settings'
    );
    return rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
};

// ==================== DAILY BUDGETS ====================

export const getDailyBudget = async (date: string): Promise<DailyBudget | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<any>(
        'SELECT * FROM daily_budgets WHERE date = ?',
        [date]
    );
    if (!result) return null;
    return {
        date: result.date,
        limit: result.budget_limit,
        used: result.used,
    };
};

export const setDailyBudget = async (budget: DailyBudget): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT OR REPLACE INTO daily_budgets (date, budget_limit, used, updated_at) 
     VALUES (?, ?, ?, ?)`,
        [budget.date, budget.limit, budget.used, Date.now()]
    );
};

export const incrementDailyUsage = async (date: string): Promise<number> => {
    const db = await getDatabase();
    await db.runAsync(
        `UPDATE daily_budgets SET used = used + 1, updated_at = ? WHERE date = ?`,
        [Date.now(), date]
    );
    const result = await db.getFirstAsync<{ used: number }>(
        'SELECT used FROM daily_budgets WHERE date = ?',
        [date]
    );
    return result?.used || 0;
};

// ==================== INSIGHTS ====================

export const insertInsight = async (insight: Insight): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO insights (id, type, title, description, data, dismissed) 
     VALUES (?, ?, ?, ?, ?, ?)`,
        [
            insight.id,
            insight.type,
            insight.title,
            insight.description,
            insight.data ? JSON.stringify(insight.data) : null,
            insight.dismissed ? 1 : 0,
        ]
    );
};

export const getActiveInsights = async (): Promise<Insight[]> => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<any>(
        'SELECT * FROM insights WHERE dismissed = 0 ORDER BY created_at DESC LIMIT 10'
    );
    return rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        data: row.data ? JSON.parse(row.data) : undefined,
        createdAt: row.created_at,
        dismissed: !!row.dismissed,
    }));
};

export const dismissInsight = async (id: string): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync('UPDATE insights SET dismissed = 1 WHERE id = ?', [id]);
};

// ==================== ANALYTICS QUERIES ====================

export const getLogsGroupedByDate = async (
    days: number
): Promise<{ date: string; count: number }[]> => {
    const db = await getDatabase();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const rows = await db.getAllAsync<{ date: string; count: number }>(
        `SELECT date, COUNT(*) as count 
     FROM cigarette_logs 
     WHERE date >= ? 
     GROUP BY date 
     ORDER BY date ASC`,
        [startDateStr]
    );
    return rows;
};

export const getMoodDistribution = async (
    days: number
): Promise<{ mood: string; count: number }[]> => {
    const db = await getDatabase();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const rows = await db.getAllAsync<{ mood: string; count: number }>(
        `SELECT mood, COUNT(*) as count 
     FROM cigarette_logs 
     WHERE date >= ? AND mood IS NOT NULL 
     GROUP BY mood 
     ORDER BY count DESC`,
        [startDateStr]
    );
    return rows;
};

export const getActivityDistribution = async (
    days: number
): Promise<{ activity: string; count: number }[]> => {
    const db = await getDatabase();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const rows = await db.getAllAsync<{ activity: string; count: number }>(
        `SELECT activity, COUNT(*) as count 
     FROM cigarette_logs 
     WHERE date >= ? AND activity IS NOT NULL 
     GROUP BY activity 
     ORDER BY count DESC`,
        [startDateStr]
    );
    return rows;
};

export const getHourlyDistribution = async (
    days: number
): Promise<{ hour: number; count: number }[]> => {
    const db = await getDatabase();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startTimestamp = startDate.getTime();

    const rows = await db.getAllAsync<{ hour: number; count: number }>(
        `SELECT CAST(strftime('%H', timestamp / 1000, 'unixepoch', 'localtime') AS INTEGER) as hour,
            COUNT(*) as count 
     FROM cigarette_logs 
     WHERE timestamp >= ? 
     GROUP BY hour 
     ORDER BY hour ASC`,
        [startTimestamp]
    );
    return rows;
};
