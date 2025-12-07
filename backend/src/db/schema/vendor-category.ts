import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { VendorTable } from './vendor.schema';
import { RfpCategoryTable } from './rfp-category';
import { uniqueIndex } from 'drizzle-orm/pg-core';

export const VendorCategoryTable = pgTable(
  'vendor_category',
  {
    vendorId: uuid('vendor_id')
      .notNull()
      .references(() => VendorTable.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => RfpCategoryTable.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('vendor_category_vendor_id_category_id_idx').on(t.vendorId, t.categoryId)]
);
