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
const app_1 = require("./shared/config/app");
const middleware_1 = require("./shared/middleware");
const http_status_1 = require("./shared/constants/http-status");
const date_1 = require("./shared/utils/date");
const auth_routes_1 = require("./modules/auth/auth.routes");
const warehouse_routes_1 = require("./modules/warehouse/warehouse.routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middleware_1.requestLogger);
app.get(`${app_1.appConfig.apiPrefix}/health`, (_req, res) => {
    res.status(http_status_1.HttpStatus.OK).json({
        success: true,
        message: 'wareX API is running',
        environment: app_1.appConfig.nodeEnv,
        timestamp: (0, date_1.toISOString)(),
    });
});
app.use(`${app_1.appConfig.apiPrefix}/auth`, auth_routes_1.authRouter);
app.use(`${app_1.appConfig.apiPrefix}/warehouses`, warehouse_routes_1.warehouseRouter);
app.use(middleware_1.notFoundHandler);
app.use(middleware_1.errorHandler);
//# sourceMappingURL=app.js.map