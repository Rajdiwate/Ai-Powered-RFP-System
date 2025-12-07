import { defineConfig } from 'drizzle-kit';

import { loadEnv } from './src/config/env.config';

loadEnv();

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts', // Path to your schema files
  out: './src/db/migration', // generated migration files
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: false,
  },
  verbose: process.env.NODE_ENV === 'development',
  strict: true,
});
