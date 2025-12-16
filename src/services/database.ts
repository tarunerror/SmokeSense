import * as SQLite from 'expo-sqlite';
import { CigaretteLog } from '../types/models';

const DB_NAME = 'smokesense.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = SQLite.openDatabaseSync(DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS cigarette_logs (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        mood TEXT,
        activity TEXT,
        location_latitude REAL,
        location_longitude REAL,
        location_address TEXT,
        notes TEXT,
        trigger_tags TEXT,
        synced INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    this.db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON cigarette_logs(timestamp);
    `);

    this.db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_synced ON cigarette_logs(synced);
    `);
  }

  async insertLog(log: CigaretteLog): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const triggerTagsJson = log.triggerTags ? JSON.stringify(log.triggerTags) : null;

    this.db.runSync(
      `INSERT INTO cigarette_logs (
        id, timestamp, mood, activity, 
        location_latitude, location_longitude, location_address,
        notes, trigger_tags, synced, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.id,
        log.timestamp,
        log.mood || null,
        log.activity || null,
        log.location?.latitude || null,
        log.location?.longitude || null,
        log.location?.address || null,
        log.notes || null,
        triggerTagsJson,
        log.synced ? 1 : 0,
        log.createdAt,
        log.updatedAt,
      ]
    );
  }

  async updateLog(log: CigaretteLog): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const triggerTagsJson = log.triggerTags ? JSON.stringify(log.triggerTags) : null;

    this.db.runSync(
      `UPDATE cigarette_logs SET
        timestamp = ?, mood = ?, activity = ?,
        location_latitude = ?, location_longitude = ?, location_address = ?,
        notes = ?, trigger_tags = ?, synced = ?, updated_at = ?
      WHERE id = ?`,
      [
        log.timestamp,
        log.mood || null,
        log.activity || null,
        log.location?.latitude || null,
        log.location?.longitude || null,
        log.location?.address || null,
        log.notes || null,
        triggerTagsJson,
        log.synced ? 1 : 0,
        log.updatedAt,
        log.id,
      ]
    );
  }

  async getLogById(id: string): Promise<CigaretteLog | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = this.db.getFirstSync<any>(
      'SELECT * FROM cigarette_logs WHERE id = ?',
      [id]
    );

    return result ? this.mapRowToLog(result) : null;
  }

  async getAllLogs(limit?: number, offset?: number): Promise<CigaretteLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM cigarette_logs ORDER BY timestamp DESC';
    const params: any[] = [];

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    if (offset !== undefined) {
      query += ' OFFSET ?';
      params.push(offset);
    }

    const rows = this.db.getAllSync<any>(query, params);
    return rows.map(row => this.mapRowToLog(row));
  }

  async getLogsByDateRange(startTime: number, endTime: number): Promise<CigaretteLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = this.db.getAllSync<any>(
      'SELECT * FROM cigarette_logs WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp DESC',
      [startTime, endTime]
    );

    return rows.map(row => this.mapRowToLog(row));
  }

  async getUnsyncedLogs(): Promise<CigaretteLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    const rows = this.db.getAllSync<any>(
      'SELECT * FROM cigarette_logs WHERE synced = 0 ORDER BY timestamp ASC'
    );

    return rows.map(row => this.mapRowToLog(row));
  }

  async markLogAsSynced(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    this.db.runSync(
      'UPDATE cigarette_logs SET synced = 1, updated_at = ? WHERE id = ?',
      [Date.now(), id]
    );
  }

  async deleteLog(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    this.db.runSync('DELETE FROM cigarette_logs WHERE id = ?', [id]);
  }

  async getLogCount(startTime?: number, endTime?: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT COUNT(*) as count FROM cigarette_logs';
    const params: any[] = [];

    if (startTime !== undefined && endTime !== undefined) {
      query += ' WHERE timestamp >= ? AND timestamp <= ?';
      params.push(startTime, endTime);
    }

    const result = this.db.getFirstSync<{ count: number }>(query, params);
    return result?.count || 0;
  }

  private mapRowToLog(row: any): CigaretteLog {
    const log: CigaretteLog = {
      id: row.id,
      timestamp: row.timestamp,
      mood: row.mood || undefined,
      activity: row.activity || undefined,
      notes: row.notes || undefined,
      synced: Boolean(row.synced),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    if (row.location_latitude && row.location_longitude) {
      log.location = {
        latitude: row.location_latitude,
        longitude: row.location_longitude,
        address: row.location_address || undefined,
      };
    }

    if (row.trigger_tags) {
      try {
        log.triggerTags = JSON.parse(row.trigger_tags);
      } catch (e) {
        console.error('Failed to parse trigger tags:', e);
      }
    }

    return log;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
