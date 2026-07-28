import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { appConfig } from './shared/config/app';
import { requestLogger, errorHandler, notFoundHandler } from './shared/middleware';
import { HttpStatus } from './shared/constants/http-status';
import { toISOString } from './shared/utils/date';
import { authRouter } from './modules/auth/auth.routes';
import { warehouseRouter } from './modules/warehouse/warehouse.routes';
import { zoneRouter, warehouseZoneRouter } from './modules/zone/zone.routes';
import { aisleRouter, zoneAisleRouter } from './modules/aisle/aisle.routes';
import { binRouter, aisleBinRouter } from './modules/bin/bin.routes';
import { deviceRouter } from './modules/device/device.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { pickListRouter } from './modules/pick-list/pickList.routes';

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

app.use(`${appConfig.apiPrefix}/auth`, authRouter);
app.use(`${appConfig.apiPrefix}/warehouses`, warehouseRouter);
app.use(`${appConfig.apiPrefix}/warehouses`, warehouseZoneRouter);
app.use(`${appConfig.apiPrefix}/zones`, zoneRouter);
app.use(`${appConfig.apiPrefix}/zones`, zoneAisleRouter);
app.use(`${appConfig.apiPrefix}/aisles`, aisleRouter);
app.use(`${appConfig.apiPrefix}/aisles`, aisleBinRouter);
app.use(`${appConfig.apiPrefix}/bins`, binRouter);
app.use(`${appConfig.apiPrefix}/devices`, deviceRouter);
app.use(`${appConfig.apiPrefix}/inventory`, inventoryRouter);
app.use(`${appConfig.apiPrefix}/pick-lists`, pickListRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };