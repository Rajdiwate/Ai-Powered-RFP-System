import { common } from '@util/common-schema';
import { jsonb, pgTable, uuid } from 'drizzle-orm/pg-core';
import { VendorTable } from './vendor.schema';
import { RfpTable } from './rfp.schema';

export const ProposalTable = pgTable('proposal', {
  id: common.uuid,
  vendorId: uuid('vendor_id')
    .notNull()
    .references(() => VendorTable.id),
  rfpId: uuid('rfp_id')
    .notNull()
    .references(() => RfpTable.id),

  totalCost: common.fields.amount('total_cost').notNull(),
  details: jsonb('details').notNull(),
});
