import dotenv from 'dotenv';
dotenv.config();

const envType = process.env.NODE_ENV as string;

// Load corresponding .env file
export const loadEnv = () => {
  dotenv.config({
    path: `.env.${envType}`,
  });
};
