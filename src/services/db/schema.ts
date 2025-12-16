import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const logEvents = sqliteTable('log_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: integer('created_at').notNull(),
  message: text('message').notNull(),
});
