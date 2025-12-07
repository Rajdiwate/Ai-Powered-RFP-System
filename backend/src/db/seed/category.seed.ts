import { db } from '@db/index';
import { RfpCategoryTable } from '@db/schema/rfp-category';

const categories = [
  'Construction',
  'Electronics',
  'Software Development',
  'Office Supplies',
  'Marketing Services',
  'Legal Services',
  'Logistics',
  'Cleaning Services',
  'Security Services',
  'Catering',
];

export const seedCategories = async () => {
  console.log('Seeding categories...');

  const categoryInserts = categories.map((name) => ({ name }));

  const inserted = await db
    .insert(RfpCategoryTable)
    .values(categoryInserts)
    .onConflictDoNothing()
    .returning();

  console.log('Categories seeded successfully.');
  return inserted;
};
