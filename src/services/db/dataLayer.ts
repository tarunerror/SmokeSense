import { getOrCreateDbKey } from '@/services/secure/keyStore';

import { getDb, runMigrations } from './client';
import { LogEventRepository } from './repositories';

export type Repositories = {
  logEvents: LogEventRepository;
};

export type DataLayer = {
  repositories: Repositories;
  keys: {
    dbKey: string;
  };
};

export async function createDataLayer(): Promise<DataLayer> {
  const dbKey = await getOrCreateDbKey();

  await runMigrations();

  const db = getDb();

  return {
    keys: {
      dbKey,
    },
    repositories: {
      logEvents: new LogEventRepository(db),
    },
  };
}
