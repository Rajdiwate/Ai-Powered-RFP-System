import { app } from 'src/app';
import { loadEnv } from '@config/env.config';

loadEnv();

app.listen({ port: process.env.PORT! } , () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
