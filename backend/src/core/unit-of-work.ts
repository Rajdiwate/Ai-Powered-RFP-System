import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { db } from '@db/index';
import { DBSchema } from '@type';

export const unitOfWork = async <T>(
  fn: (trx: NodePgDatabase<DBSchema>) => Promise<T>
): Promise<T> => {
  return await db.transaction(fn);
};
