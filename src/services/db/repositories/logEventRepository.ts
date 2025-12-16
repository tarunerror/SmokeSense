import { desc } from 'drizzle-orm';
import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';

import type { AppDatabase } from '../client';
import { logEvents } from '../schema';

export type LogEvent = InferSelectModel<typeof logEvents>;
export type NewLogEvent = InferInsertModel<typeof logEvents>;

export class LogEventRepository {
  constructor(private readonly db: AppDatabase) {}

  async list(limit = 100) {
    return this.db
      .select()
      .from(logEvents)
      .orderBy(desc(logEvents.createdAt))
      .limit(limit);
  }

  async create(message: string) {
    await this.db.insert(logEvents).values({
      createdAt: Date.now(),
      message,
    });
  }
}
