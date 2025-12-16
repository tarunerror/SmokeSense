import { CigaretteLog, Location } from '../types/models';
import { databaseService } from './database';
import { syncService } from './sync';

export interface CreateLogInput {
  mood?: string;
  activity?: string;
  location?: Location;
  notes?: string;
  triggerTags?: string[];
}

class CigaretteLogService {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async createLog(input: CreateLogInput = {}): Promise<CigaretteLog> {
    try {
      const now = Date.now();
      const log: CigaretteLog = {
        id: this.generateId(),
        timestamp: now,
        mood: input.mood,
        activity: input.activity,
        location: input.location,
        notes: input.notes,
        triggerTags: input.triggerTags,
        synced: false,
        createdAt: now,
        updatedAt: now,
      };

      await databaseService.insertLog(log);

      syncService.schedulSync().catch(error => {
        console.error('Failed to schedule sync:', error);
      });

      return log;
    } catch (error) {
      console.error('Failed to create log:', error);
      throw error;
    }
  }

  async updateLog(id: string, input: Partial<CreateLogInput>): Promise<CigaretteLog> {
    try {
      const existingLog = await databaseService.getLogById(id);
      if (!existingLog) {
        throw new Error(`Log with id ${id} not found`);
      }

      const updatedLog: CigaretteLog = {
        ...existingLog,
        ...input,
        updatedAt: Date.now(),
        synced: false,
      };

      await databaseService.updateLog(updatedLog);

      syncService.schedulSync().catch(error => {
        console.error('Failed to schedule sync:', error);
      });

      return updatedLog;
    } catch (error) {
      console.error('Failed to update log:', error);
      throw error;
    }
  }

  async getLogById(id: string): Promise<CigaretteLog | null> {
    try {
      return await databaseService.getLogById(id);
    } catch (error) {
      console.error('Failed to get log by id:', error);
      return null;
    }
  }

  async getAllLogs(limit?: number, offset?: number): Promise<CigaretteLog[]> {
    try {
      return await databaseService.getAllLogs(limit, offset);
    } catch (error) {
      console.error('Failed to get all logs:', error);
      return [];
    }
  }

  async getLogsByDateRange(startTime: number, endTime: number): Promise<CigaretteLog[]> {
    try {
      return await databaseService.getLogsByDateRange(startTime, endTime);
    } catch (error) {
      console.error('Failed to get logs by date range:', error);
      return [];
    }
  }

  async getTodayLogs(): Promise<CigaretteLog[]> {
    const startOfDay = this.getStartOfDay();
    const endOfDay = this.getEndOfDay();
    return this.getLogsByDateRange(startOfDay, endOfDay);
  }

  async deleteLog(id: string): Promise<void> {
    try {
      await databaseService.deleteLog(id);
    } catch (error) {
      console.error('Failed to delete log:', error);
      throw error;
    }
  }

  async getLogCount(startTime?: number, endTime?: number): Promise<number> {
    try {
      return await databaseService.getLogCount(startTime, endTime);
    } catch (error) {
      console.error('Failed to get log count:', error);
      return 0;
    }
  }

  private getStartOfDay(): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  }

  private getEndOfDay(): number {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now.getTime();
  }

  async validateLog(log: CigaretteLog): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!log.id || log.id.trim() === '') {
      errors.push('Log ID is required');
    }

    if (!log.timestamp || log.timestamp <= 0) {
      errors.push('Valid timestamp is required');
    }

    if (log.timestamp > Date.now() + 60000) {
      errors.push('Timestamp cannot be in the future');
    }

    if (log.location) {
      if (
        typeof log.location.latitude !== 'number' ||
        log.location.latitude < -90 ||
        log.location.latitude > 90
      ) {
        errors.push('Invalid latitude');
      }

      if (
        typeof log.location.longitude !== 'number' ||
        log.location.longitude < -180 ||
        log.location.longitude > 180
      ) {
        errors.push('Invalid longitude');
      }
    }

    if (log.notes && log.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const cigaretteLogService = new CigaretteLogService();
