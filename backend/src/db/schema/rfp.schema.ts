import { common } from '@util/common-schema';
import { varchar } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { jsonb } from 'drizzle-orm/pg-core';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { RfpCategoryTable } from './rfp-category';

export const RfpTable = pgTable('rfp', {
  id: common.uuid,
  title: varchar('title', { length: 255 }).notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => RfpCategoryTable.id),
  maxBudget: common.fields.amount('max_budget').notNull(),
  quantity: integer('quantity').notNull(),
  timeToDeliver: integer('time_to_deliver'),
  requirements: jsonb('requirements').notNull(),
  createdAt: common.timestamps.createdAt,
});
