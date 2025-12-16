import { databaseService } from '../database';
import { CigaretteLog } from '../../types/models';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite');

describe('DatabaseService', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      execSync: jest.fn(),
      runSync: jest.fn(),
      getAllSync: jest.fn(() => []),
      getFirstSync: jest.fn(),
      closeAsync: jest.fn(),
    };

    (SQLite.openDatabaseSync as jest.Mock).mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create tables on initialization', async () => {
      await databaseService.initialize();

      expect(mockDb.execSync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS cigarette_logs')
      );
      expect(mockDb.execSync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_timestamp')
      );
      expect(mockDb.execSync).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_synced')
      );
    });
  });

  describe('insertLog', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should insert a log', async () => {
      const log: CigaretteLog = {
        id: 'test-1',
        timestamp: Date.now(),
        mood: 'happy',
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await databaseService.insertLog(log);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO cigarette_logs'),
        expect.arrayContaining([log.id, log.timestamp, log.mood])
      );
    });

    it('should handle logs with location', async () => {
      const log: CigaretteLog = {
        id: 'test-2',
        timestamp: Date.now(),
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'San Francisco',
        },
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await databaseService.insertLog(log);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([37.7749, -122.4194, 'San Francisco'])
      );
    });

    it('should handle logs with trigger tags', async () => {
      const log: CigaretteLog = {
        id: 'test-3',
        timestamp: Date.now(),
        triggerTags: ['stress', 'work'],
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await databaseService.insertLog(log);

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([JSON.stringify(['stress', 'work'])])
      );
    });
  });

  describe('getLogsByDateRange', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should query logs within date range', async () => {
      const startTime = Date.now() - 86400000;
      const endTime = Date.now();

      mockDb.getAllSync.mockReturnValue([
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ]);

      const logs = await databaseService.getLogsByDateRange(startTime, endTime);

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE timestamp >= ? AND timestamp <= ?'),
        [startTime, endTime]
      );
      expect(logs).toHaveLength(1);
    });
  });

  describe('getUnsyncedLogs', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should return only unsynced logs', async () => {
      mockDb.getAllSync.mockReturnValue([
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: 0,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ]);

      const logs = await databaseService.getUnsyncedLogs();

      expect(mockDb.getAllSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE synced = 0')
      );
      expect(logs).toHaveLength(1);
      expect(logs[0].synced).toBe(false);
    });
  });

  describe('markLogAsSynced', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should update synced flag', async () => {
      await databaseService.markLogAsSynced('test-id');

      expect(mockDb.runSync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE cigarette_logs SET synced = 1'),
        expect.arrayContaining([expect.any(Number), 'test-id'])
      );
    });
  });

  describe('getLogCount', () => {
    beforeEach(async () => {
      await databaseService.initialize();
    });

    it('should return total count when no date range', async () => {
      mockDb.getFirstSync.mockReturnValue({ count: 42 });

      const count = await databaseService.getLogCount();

      expect(mockDb.getFirstSync).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as count'),
        []
      );
      expect(count).toBe(42);
    });

    it('should return count within date range', async () => {
      const startTime = Date.now() - 86400000;
      const endTime = Date.now();

      mockDb.getFirstSync.mockReturnValue({ count: 10 });

      const count = await databaseService.getLogCount(startTime, endTime);

      expect(mockDb.getFirstSync).toHaveBeenCalledWith(
        expect.stringContaining('WHERE timestamp >= ? AND timestamp <= ?'),
        [startTime, endTime]
      );
      expect(count).toBe(10);
    });
  });
});
