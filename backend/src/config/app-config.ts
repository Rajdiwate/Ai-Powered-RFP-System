const is_dev = (process.env.NODE_ENV as string) === 'development';
const allowed_origins = JSON.parse(process.env.ALLOWED_CORS_ORIGINS as string);
const cors_options = {
  origin: allowed_origins,
  allowedHeaders: [
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'x-csrf-token',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  allowedMethods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: [],
};

export { cors_options, is_dev };
