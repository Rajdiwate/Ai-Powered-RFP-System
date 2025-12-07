import { common } from '@util/common-schema';
import { pgTable, varchar } from 'drizzle-orm/pg-core';


export const VendorTable = pgTable('vendor', {
  id: common.uuid,
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }).notNull().unique(),
  address: varchar('address').notNull(),
  ...common.timestamps,
});
