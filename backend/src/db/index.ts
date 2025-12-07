import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

import { loadEnv } from '@config/env.config';

loadEnv();

const BOOT_ID = `${process.pid}-${Date.now()}`;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  application_name: `myapp:${BOOT_ID}`,
});

export const db = drizzle(pool, { schema });

