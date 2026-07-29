"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const hpp_1 = __importDefault(require("hpp"));
const app_1 = require("./shared/config/app");
const middleware_1 = require("./shared/middleware");
const http_status_1 = require("./shared/constants/http-status");
const date_1 = require("./shared/utils/date");
const environment_1 = require("./shared/config/environment");
const connection_1 = require("./shared/database/connection");
const auth_routes_1 = require("./modules/auth/auth.routes");
const warehouse_routes_1 = require("./modules/warehouse/warehouse.routes");
const zone_routes_1 = require("./modules/zone/zone.routes");
const aisle_routes_1 = require("./modules/aisle/aisle.routes");
const bin_routes_1 = require("./modules/bin/bin.routes");
const device_routes_1 = require("./modules/device/device.routes");
const inventory_routes_1 = require("./modules/inventory/inventory.routes");
const pickList_routes_1 = require("./modules/pick-list/pickList.routes");
const order_routes_1 = require("./modules/order/order.routes");
const auditLog_routes_1 = require("./modules/audit-log/auditLog.routes");
const notification_routes_1 = require("./modules/notification/notification.routes");
const report_routes_1 = require("./modules/report/report.routes");
const admin_routes_1 = require("./modules/admin/admin.routes");
const app = (0, express_1.default)();
exports.app = app;
const startTime = Date.now();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: app_1.appConfig.isProduction ? undefined : false,
    crossOriginEmbedderPolicy: app_1.appConfig.isProduction,
}));
app.use((0, cors_1.default)({
    origin: environment_1.environment.CORS_ORIGIN === '*' ? '*' : environment_1.environment.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
}));
app.use((0, compression_1.default)({ level: 6 }));
app.use(express_1.default.json({ limit: environment_1.environment.BODY_LIMIT }));
app.use(express_1.default.urlencoded({ extended: true, limit: environment_1.environment.BODY_LIMIT }));
app.use((0, hpp_1.default)({ whitelist: ['page', 'limit', 'sortBy', 'sortOrder', 'fields', 'search', 'status', 'isRead', 'type', 'priority'] }));
app.use(middleware_1.requestId);
app.use(middleware_1.requestLogger);
app.use(middleware_1.standardLimiter);
app.use(`${app_1.appConfig.apiPrefix}/auth`, middleware_1.authLimiter);
app.get(`${app_1.appConfig.apiPrefix}/health`, (_req, res) => {
    res.status(http_status_1.HttpStatus.OK).json({
        success: true,
        message: 'wareX API is running',
        environment: app_1.appConfig.nodeEnv,
        version: app_1.appConfig.version,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        database: (0, connection_1.isConnected)() ? 'connected' : 'disconnected',
        timestamp: (0, date_1.toISOString)(),
    });
});
app.use(`${app_1.appConfig.apiPrefix}/auth`, auth_routes_1.authRouter);
app.use(`${app_1.appConfig.apiPrefix}/warehouses`, warehouse_routes_1.warehouseRouter);
app.use(`${app_1.appConfig.apiPrefix}/warehouses`, zone_routes_1.warehouseZoneRouter);
app.use(`${app_1.appConfig.apiPrefix}/zones`, zone_routes_1.zoneRouter);
app.use(`${app_1.appConfig.apiPrefix}/zones`, aisle_routes_1.zoneAisleRouter);
app.use(`${app_1.appConfig.apiPrefix}/aisles`, aisle_routes_1.aisleRouter);
app.use(`${app_1.appConfig.apiPrefix}/aisles`, bin_routes_1.aisleBinRouter);
app.use(`${app_1.appConfig.apiPrefix}/bins`, bin_routes_1.binRouter);
app.use(`${app_1.appConfig.apiPrefix}/devices`, device_routes_1.deviceRouter);
app.use(`${app_1.appConfig.apiPrefix}/inventory`, inventory_routes_1.inventoryRouter);
app.use(`${app_1.appConfig.apiPrefix}/pick-lists`, pickList_routes_1.pickListRouter);
app.use(`${app_1.appConfig.apiPrefix}/orders`, order_routes_1.orderRouter);
app.use(`${app_1.appConfig.apiPrefix}/audit-logs`, auditLog_routes_1.auditLogRouter);
app.use(`${app_1.appConfig.apiPrefix}/notifications`, notification_routes_1.notificationRouter);
app.use(`${app_1.appConfig.apiPrefix}/`, report_routes_1.reportRouter);
app.use(`${app_1.appConfig.apiPrefix}/admin/users`, admin_routes_1.adminRouter);
app.use(middleware_1.notFoundHandler);
app.use(middleware_1.errorHandler);
//# sourceMappingURL=app.js.map