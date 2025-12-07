import { common } from '@util/common-schema';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const RfpCategoryTable = pgTable('rfp_category', {
  id: common.uuid,
  name: varchar('name', { length: 255 }).notNull(),
});
