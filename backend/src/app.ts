import express from 'express';
import cors from 'cors';
import httpContext from 'express-http-context';
import { notFoundMiddleware } from '@middleware/not-found.middleware';
import { globalErrorHandler } from '@middleware/global-error-handler.middleware';
import { appRoutes } from './app-routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(httpContext.middleware);
app.use(appRoutes);
app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export { app };
