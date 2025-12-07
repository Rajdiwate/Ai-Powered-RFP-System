import express from 'express';
import cors from 'cors';
import httpContext from 'express-http-context';
import { notFoundMiddleware } from '@middleware/not-found.middleware';
import { globalErrorHandler } from '@middleware/global-error-handler.middleware';
import { appRoutes } from './app-routes';
import { cors_options } from '@config/app-config';
import { apiResponseMiddleware } from '@middleware/api-response.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(cors_options));
app.use(apiResponseMiddleware);
app.use(httpContext.middleware);
app.use('/api', appRoutes);
app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export { app };
