import { cigaretteLogService } from '../cigaretteLog';
import { databaseService } from '../database';
import { CigaretteLog } from '../../types/models';

jest.mock('../database');
jest.mock('../sync');

describe('CigaretteLogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createLog', () => {
    it('should create a log with minimal data', async () => {
      const mockInsert = jest.spyOn(databaseService, 'insertLog').mockResolvedValue();

      const log = await cigaretteLogService.createLog();

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          timestamp: expect.any(Number),
          synced: false,
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        })
      );
    });

    it('should create a log with full data', async () => {
      const mockInsert = jest.spyOn(databaseService, 'insertLog').mockResolvedValue();

      const input = {
        mood: 'stressed',
        activity: 'work',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          address: 'San Francisco, CA',
        },
        notes: 'After a stressful meeting',
        triggerTags: ['stress', 'work'],
      };

      const log = await cigaretteLogService.createLog(input);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          mood: 'stressed',
          activity: 'work',
          location: input.location,
          notes: 'After a stressful meeting',
          triggerTags: ['stress', 'work'],
        })
      );
    });
  });

  describe('updateLog', () => {
    it('should update an existing log', async () => {
      const existingLog: CigaretteLog = {
        id: 'test-id',
        timestamp: Date.now(),
        mood: 'happy',
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(databaseService, 'getLogById').mockResolvedValue(existingLog);
      const mockUpdate = jest.spyOn(databaseService, 'updateLog').mockResolvedValue();

      const updatedLog = await cigaretteLogService.updateLog('test-id', {
        mood: 'sad',
        notes: 'Updated notes',
      });

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-id',
          mood: 'sad',
          notes: 'Updated notes',
          synced: false,
        })
      );
      expect(updatedLog.mood).toBe('sad');
    });

    it('should throw error when log not found', async () => {
      jest.spyOn(databaseService, 'getLogById').mockResolvedValue(null);

      await expect(
        cigaretteLogService.updateLog('non-existent', { mood: 'happy' })
      ).rejects.toThrow('Log with id non-existent not found');
    });
  });

  describe('validateLog', () => {
    it('should validate a correct log', async () => {
      const log: CigaretteLog = {
        id: 'test-id',
        timestamp: Date.now(),
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await cigaretteLogService.validateLog(log);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should invalidate log with missing id', async () => {
      const log: CigaretteLog = {
        id: '',
        timestamp: Date.now(),
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await cigaretteLogService.validateLog(log);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Log ID is required');
    });

    it('should invalidate log with future timestamp', async () => {
      const log: CigaretteLog = {
        id: 'test-id',
        timestamp: Date.now() + 120000,
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await cigaretteLogService.validateLog(log);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Timestamp cannot be in the future');
    });

    it('should invalidate log with invalid location', async () => {
      const log: CigaretteLog = {
        id: 'test-id',
        timestamp: Date.now(),
        location: {
          latitude: 999,
          longitude: -999,
        },
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await cigaretteLogService.validateLog(log);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid latitude');
      expect(result.errors).toContain('Invalid longitude');
    });

    it('should invalidate log with too long notes', async () => {
      const log: CigaretteLog = {
        id: 'test-id',
        timestamp: Date.now(),
        notes: 'a'.repeat(1001),
        synced: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const result = await cigaretteLogService.validateLog(log);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Notes cannot exceed 1000 characters');
    });
  });

  describe('getAllLogs', () => {
    it('should get all logs', async () => {
      const mockLogs: CigaretteLog[] = [
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      jest.spyOn(databaseService, 'getAllLogs').mockResolvedValue(mockLogs);

      const logs = await cigaretteLogService.getAllLogs();

      expect(logs).toEqual(mockLogs);
    });
  });
});
