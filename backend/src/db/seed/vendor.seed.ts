import { db } from '@db/index';
import { VendorTable } from '@db/schema/vendor.schema';
import { VendorCategoryTable } from '@db/schema/vendor-category';
import { seedCategories } from './category.seed';
import { RfpCategoryTable } from '@db/schema/rfp-category';

export const seedVendors = async () => {
  // 1. Seed Categories first
  const categories = await seedCategories();

  // If no categories returned (e.g. they existed), fetch them
  let allCategories = categories;
  if (allCategories.length === 0) {
    allCategories = await db.select().from(RfpCategoryTable);
  }

  // Need RfpCategoryTable import if we want to select
  // But to keep it simple, if no categories returned from seed, we assume db has them or we skip linking.

  console.log('Seeding vendors...');

  const vendors: (typeof VendorTable.$inferInsert)[] = [];

  for (let i = 1; i <= 10; i++) {
    vendors.push({
      name: `Vendor ${i}`,
      email: `vendor${i}@example.com`,
      phone: `555-010-${i.toString().padStart(4, '0')}`,
      address: `${i}00 Business Way, Suite ${i}, Enterprise City, ST 12345`,
    });
  }

  const insertedVendors = await db
    .insert(VendorTable)
    .values(vendors)
    .onConflictDoNothing()
    .returning();

  console.log('Vendors seeded successfully.');

  // 2. Link Vendors to Categories (Randomly)
  if (allCategories.length > 0 && insertedVendors.length > 0) {
    console.log('Linking vendors to categories...');
    const vendorCategoryLinks: (typeof VendorCategoryTable.$inferInsert)[] = [];

    for (const vendor of insertedVendors) {
      // Assign 1-3 random categories to each vendor
      const numCats = Math.floor(Math.random() * 3) + 1;
      const shuffled = allCategories.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numCats);

      for (const cat of selected) {
        vendorCategoryLinks.push({
          vendorId: vendor.id,
          categoryId: cat.id,
        });
      }
    }

    if (vendorCategoryLinks.length > 0) {
      await db.insert(VendorCategoryTable).values(vendorCategoryLinks).onConflictDoNothing();
      console.log('Vendor-Category links seeded.');
    }
  }
};
