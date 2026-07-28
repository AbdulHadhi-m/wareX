"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.AppError = void 0;
const http_status_1 = require("../constants/http-status");
class AppError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(message, statusCode, details, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
        };
    }
}
exports.AppError = AppError;
class InternalError extends AppError {
    constructor(message = 'Internal server error') {
        super(message, http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, undefined, false);
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=app-error.js.map