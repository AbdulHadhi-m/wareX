"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../errors/app-error");
const validation_error_1 = require("../errors/validation-error");
const conflict_error_1 = require("../errors/conflict-error");
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
    const mongooseErr = err;
    if (mongooseErr.name === 'ValidationError' && mongooseErr.errors) {
        const errorDetails = Object.values(mongooseErr.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
        const validationError = new validation_error_1.ValidationError('Validation failed', errorDetails);
        logger_1.logger.warn({ err: validationError, requestId: req.id }, 'Mongoose validation error');
        res.status(http_status_1.HttpStatus.UNPROCESSABLE_ENTITY).json({
            success: false,
            error: {
                name: validationError.name,
                message: validationError.message,
                details: errorDetails,
                ...(app_1.appConfig.isDevelopment ? { stack: err.stack } : {}),
            },
        });
        return;
    }
    if (mongooseErr.name === 'MongoServerError' && mongooseErr.code === 11000) {
        const conflictError = new conflict_error_1.ConflictError('A resource with this value already exists');
        logger_1.logger.warn({ err, requestId: req.id }, 'Duplicate key error');
        res.status(http_status_1.HttpStatus.CONFLICT).json({
            success: false,
            error: {
                name: conflictError.name,
                message: conflictError.message,
                ...(app_1.appConfig.isDevelopment ? { details: mongooseErr.keyValue, stack: err.stack } : {}),
            },
        });
        return;
    }
    if (mongooseErr.name === 'CastError') {
        logger_1.logger.warn({ err, requestId: req.id }, 'Invalid ID format');
        res.status(http_status_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            error: {
                name: 'InvalidIdError',
                message: 'Invalid resource ID format',
                ...(app_1.appConfig.isDevelopment ? { stack: err.stack } : {}),
            },
        });
        return;
    }
    logger_1.logger.fatal({ err, requestId: req.id, name: err.name, message: err.message }, 'Unhandled error');
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