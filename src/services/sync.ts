import AsyncStorage from '@react-native-async-storage/async-storage';
import { databaseService } from './database';
import { CigaretteLog } from '../types/models';

const SYNC_QUEUE_KEY = 'sync_queue';
const LAST_SYNC_KEY = 'last_sync_timestamp';
const SYNC_INTERVAL = 5 * 60 * 1000;

export interface SyncConfig {
  apiEndpoint?: string;
  apiKey?: string;
}

class SyncService {
  private syncInProgress = false;
  private syncTimer: NodeJS.Timeout | null = null;
  private config: SyncConfig = {};

  configure(config: SyncConfig): void {
    this.config = config;
  }

  async schedulSync(immediate = false): Promise<void> {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }

    if (immediate) {
      await this.sync();
    } else {
      this.syncTimer = setTimeout(() => {
        this.sync().catch(error => {
          console.error('Scheduled sync failed:', error);
        });
      }, SYNC_INTERVAL);
    }
  }

  async sync(): Promise<void> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    this.syncInProgress = true;

    try {
      const unsyncedLogs = await databaseService.getUnsyncedLogs();

      if (unsyncedLogs.length === 0) {
        console.log('No logs to sync');
        return;
      }

      console.log(`Syncing ${unsyncedLogs.length} logs`);

      for (const log of unsyncedLogs) {
        const success = await this.syncLog(log);
        if (success) {
          await databaseService.markLogAsSynced(log.id);
        }
      }

      await this.setLastSyncTimestamp(Date.now());
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncLog(log: CigaretteLog): Promise<boolean> {
    try {
      if (!this.config.apiEndpoint) {
        console.log('No API endpoint configured, marking as synced locally');
        return true;
      }

      const response = await fetch(`${this.config.apiEndpoint}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) {
        console.error(`Failed to sync log ${log.id}: ${response.statusText}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error syncing log ${log.id}:`, error);
      return false;
    }
  }

  async getLastSyncTimestamp(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error('Failed to get last sync timestamp:', error);
      return null;
    }
  }

  private async setLastSyncTimestamp(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp.toString());
    } catch (error) {
      console.error('Failed to set last sync timestamp:', error);
    }
  }

  async getUnsyncedCount(): Promise<number> {
    try {
      const unsyncedLogs = await databaseService.getUnsyncedLogs();
      return unsyncedLogs.length;
    } catch (error) {
      console.error('Failed to get unsynced count:', error);
      return 0;
    }
  }

  stopSync(): void {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

export const syncService = new SyncService();
