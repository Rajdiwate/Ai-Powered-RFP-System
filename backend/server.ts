import { app } from 'src/app';
import { loadEnv } from '@config/env.config';

loadEnv();

app.listen();
