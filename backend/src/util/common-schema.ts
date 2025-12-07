import { numeric, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';

export const common = {
  timestamps: {
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp('deleted_at', { mode: 'date', withTimezone: true }),
  },
  uuid: uuid('id')
    .primaryKey()
    .$default(() => uuidv7()),
  expiredAt: timestamp('expired_at', {
    mode: 'date',
    withTimezone: true,
  }).notNull(),
  fields: {
    amount: (name: string) => numeric(name, { precision: 12, scale: 2 }),
    percentage: (name: string) => numeric(name, { precision: 4, scale: 2 }),
  },
};
