import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { appConfig } from './shared/config/app';
import { requestLogger, errorHandler, notFoundHandler } from './shared/middleware';
import { HttpStatus } from './shared/constants/http-status';
import { toISOString } from './shared/utils/date';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get(`${appConfig.apiPrefix}/health`, (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'wareX API is running',
    environment: appConfig.nodeEnv,
    timestamp: toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };