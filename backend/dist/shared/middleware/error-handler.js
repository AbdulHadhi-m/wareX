"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../errors/app-error");
const logger_1 = require("../logger/logger");
const app_1 = require("../config/app");
const http_status_1 = require("../constants/http-status");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof app_error_1.AppError) {
        logger_1.logger.error({ err, requestId: req.id }, err.message);
        res.status(err.statusCode).json({
            success: false,
            error: {
                name: err.name,
                message: err.message,
                ...(err.details ? { details: err.details } : {}),
                ...(app_1.appConfig.isDevelopment ? { stack: err.stack } : {}),
            },
        });
        return;
    }
    logger_1.logger.fatal({ err, requestId: req.id }, 'Unhandled error');
    const internalError = new app_error_1.InternalError(app_1.appConfig.isDevelopment ? err.message : 'Internal server error');
    res.status(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: {
            name: internalError.name,
            message: internalError.message,
            ...(app_1.appConfig.isDevelopment ? { stack: err.stack } : {}),
        },
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map