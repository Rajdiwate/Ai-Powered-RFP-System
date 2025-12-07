import { BaseRepository } from '@core/base-repository';
import { db } from '@db/index';
import { RfpTable } from '@db/schema';

class RfpRepo extends BaseRepository<typeof RfpTable> {
  constructor() {
    super(db, RfpTable);
  }
}

const rfpRepo = new RfpRepo();

export { RfpRepo, rfpRepo };
