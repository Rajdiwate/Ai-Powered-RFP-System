import { seedVendors } from './vendor.seed';

async function main() {
  try {
    console.info('Starting seed process...');

    await seedVendors();

    console.info('Seeding process completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
