import { BaseRepository } from '@core/base-repository';
import { db } from '@db/index';
import { RfpCategoryTable } from '@db/schema';
import { eq } from 'drizzle-orm';

class RfpCategoryRepo extends BaseRepository<typeof RfpCategoryTable> {
  constructor() {
    super(db, RfpCategoryTable);
  }

  async getByName(name: string) {
    const [row] = await db
      .select()
      .from(RfpCategoryTable)
      .where(eq(RfpCategoryTable.name, name))
      .limit(1);
    return row;
  }
}

const rfpCategoryRepo = new RfpCategoryRepo();

export { RfpCategoryRepo, rfpCategoryRepo };
