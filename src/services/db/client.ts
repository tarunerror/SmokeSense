import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite/next';

import * as schema from './schema';

export type AppDatabase = ExpoSQLiteDatabase<typeof schema>;

let _sqlite: SQLiteDatabase | undefined;
let _db: AppDatabase | undefined;

export function getSqlite() {
  if (_sqlite) return _sqlite;

  _sqlite = openDatabaseSync('app.db');
  return _sqlite;
}

export function getDb() {
  if (_db) return _db;

  _db = drizzle(getSqlite(), { schema });
  return _db;
}

export async function runMigrations() {
  const sqlite = getSqlite();

  await sqlite.execAsync('PRAGMA foreign_keys = ON;');

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS log_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      created_at INTEGER NOT NULL,
      message TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_log_events_created_at ON log_events(created_at);
  `);
}
