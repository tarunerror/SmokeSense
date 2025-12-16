// SQLite Database Schema for SmokeSense
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'smokesense.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) return db;
    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return db;
};

export const initializeDatabase = async (): Promise<void> => {
    const database = await getDatabase();

    // Create cigarette_logs table
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS cigarette_logs (
      id TEXT PRIMARY KEY,
      timestamp INTEGER NOT NULL,
      date TEXT NOT NULL,
      mood TEXT,
      activity TEXT,
      location_lat REAL,
      location_lng REAL,
      location_name TEXT,
      notes TEXT,
      was_delayed INTEGER DEFAULT 0,
      delay_duration INTEGER,
      synced INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

    // Create settings table
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

    // Create insights table
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      data TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      dismissed INTEGER DEFAULT 0
    );
  `);

    // Create daily_budgets table for historical tracking
    await database.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_budgets (
      date TEXT PRIMARY KEY,
      budget_limit INTEGER NOT NULL,
      used INTEGER DEFAULT 0,
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);

    // Create indexes for faster queries
    await database.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_logs_date ON cigarette_logs(date);
    CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON cigarette_logs(timestamp);
    CREATE INDEX IF NOT EXISTS idx_logs_mood ON cigarette_logs(mood);
    CREATE INDEX IF NOT EXISTS idx_logs_activity ON cigarette_logs(activity);
  `);
};

export const closeDatabase = async (): Promise<void> => {
    if (db) {
        await db.closeAsync();
        db = null;
    }
};
