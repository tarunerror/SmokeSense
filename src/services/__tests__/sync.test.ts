import { syncService } from '../sync';
import { databaseService } from '../database';
import { CigaretteLog } from '../../types/models';

jest.mock('../database');
jest.mock('@react-native-async-storage/async-storage');

global.fetch = jest.fn();

describe('SyncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('sync', () => {
    it('should skip sync when no unsynced logs', async () => {
      jest.spyOn(databaseService, 'getUnsyncedLogs').mockResolvedValue([]);

      await syncService.sync();

      expect(databaseService.markLogAsSynced).not.toHaveBeenCalled();
    });

    it('should sync unsynced logs when API is configured', async () => {
      const mockLogs: CigaretteLog[] = [
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      jest.spyOn(databaseService, 'getUnsyncedLogs').mockResolvedValue(mockLogs);
      jest.spyOn(databaseService, 'markLogAsSynced').mockResolvedValue();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      syncService.configure({
        apiEndpoint: 'https://api.example.com',
        apiKey: 'test-key',
      });

      await syncService.sync();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/logs',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-key',
          }),
        })
      );
      expect(databaseService.markLogAsSynced).toHaveBeenCalledWith('log-1');
    });

    it('should mark logs as synced when no API endpoint', async () => {
      const mockLogs: CigaretteLog[] = [
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      jest.spyOn(databaseService, 'getUnsyncedLogs').mockResolvedValue(mockLogs);
      jest.spyOn(databaseService, 'markLogAsSynced').mockResolvedValue();

      syncService.configure({});

      await syncService.sync();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(databaseService.markLogAsSynced).toHaveBeenCalledWith('log-1');
    });

    it('should not mark log as synced when API call fails', async () => {
      const mockLogs: CigaretteLog[] = [
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      jest.spyOn(databaseService, 'getUnsyncedLogs').mockResolvedValue(mockLogs);
      jest.spyOn(databaseService, 'markLogAsSynced').mockResolvedValue();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        statusText: 'Server Error',
      });

      syncService.configure({
        apiEndpoint: 'https://api.example.com',
      });

      await syncService.sync();

      expect(databaseService.markLogAsSynced).not.toHaveBeenCalled();
    });
  });

  describe('getUnsyncedCount', () => {
    it('should return count of unsynced logs', async () => {
      const mockLogs: CigaretteLog[] = [
        {
          id: 'log-1',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'log-2',
          timestamp: Date.now(),
          synced: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      jest.spyOn(databaseService, 'getUnsyncedLogs').mockResolvedValue(mockLogs);

      const count = await syncService.getUnsyncedCount();

      expect(count).toBe(2);
    });
  });
});
