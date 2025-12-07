import { BaseRepository } from '@core/base-repository';
import { db } from '@db/index';
import { VendorTable } from '@db/schema';
import { eq } from 'drizzle-orm';

class VendorRepo extends BaseRepository<typeof VendorTable> {
  constructor() {
    super(db, VendorTable);
  }

  async getByEmail(email: string) {
    const [vendor] = await db
      .select()
      .from(VendorTable)
      .where(eq(VendorTable.email, email))
      .limit(1);
    return vendor;
  }
}

const vendorRepo = new VendorRepo();

export { VendorRepo, vendorRepo };
