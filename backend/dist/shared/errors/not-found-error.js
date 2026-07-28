"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const app_error_1 = require("./app-error");
const http_status_1 = require("../constants/http-status");
class NotFoundError extends app_error_1.AppError {
    constructor(message = 'Resource not found') {
        super(message, http_status_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not-found-error.js.map