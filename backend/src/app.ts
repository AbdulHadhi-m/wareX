import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import { appConfig } from './shared/config/app';
import { requestId, requestLogger, errorHandler, notFoundHandler, standardLimiter, authLimiter } from './shared/middleware';
import { HttpStatus } from './shared/constants/http-status';
import { toISOString } from './shared/utils/date';
import { environment } from './shared/config/environment';
import { isConnected } from './shared/database/connection';
import { authRouter } from './modules/auth/auth.routes';
import { warehouseRouter } from './modules/warehouse/warehouse.routes';
import { zoneRouter, warehouseZoneRouter } from './modules/zone/zone.routes';
import { aisleRouter, zoneAisleRouter } from './modules/aisle/aisle.routes';
import { binRouter, aisleBinRouter } from './modules/bin/bin.routes';
import { deviceRouter } from './modules/device/device.routes';
import { inventoryRouter } from './modules/inventory/inventory.routes';
import { pickListRouter } from './modules/pick-list/pickList.routes';
import { orderRouter } from './modules/order/order.routes';
import { auditLogRouter } from './modules/audit-log/auditLog.routes';
import { notificationRouter } from './modules/notification/notification.routes';
import { reportRouter } from './modules/report/report.routes';
import { adminRouter } from './modules/admin/admin.routes';

const app = express();

const startTime = Date.now();

app.use(helmet({
  contentSecurityPolicy: appConfig.isProduction ? undefined : false,
  crossOriginEmbedderPolicy: appConfig.isProduction,
}));
app.use(cors({
  origin: environment.CORS_ORIGIN === '*' ? '*' : environment.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));
app.use(compression({ level: 6 }));
app.use(express.json({ limit: environment.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: environment.BODY_LIMIT }));
app.use(hpp({ whitelist: ['page', 'limit', 'sortBy', 'sortOrder', 'fields', 'search', 'status', 'isRead', 'type', 'priority'] }));
app.use(requestId);
app.use(requestLogger);
app.use(standardLimiter);

app.use(`${appConfig.apiPrefix}/auth`, authLimiter);

app.get(`${appConfig.apiPrefix}/health`, (_req, res) => {
  res.status(HttpStatus.OK).json({
    success: true,
    message: 'wareX API is running',
    environment: appConfig.nodeEnv,
    version: appConfig.version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    database: isConnected() ? 'connected' : 'disconnected',
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
app.use(`${appConfig.apiPrefix}/orders`, orderRouter);
app.use(`${appConfig.apiPrefix}/audit-logs`, auditLogRouter);
app.use(`${appConfig.apiPrefix}/notifications`, notificationRouter);
app.use(`${appConfig.apiPrefix}/`, reportRouter);
app.use(`${appConfig.apiPrefix}/admin/users`, adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };