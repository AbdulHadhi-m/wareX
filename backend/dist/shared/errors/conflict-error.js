"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const app_error_1 = require("./app-error");
const http_status_1 = require("../constants/http-status");
class ConflictError extends app_error_1.AppError {
    constructor(message = 'Resource already exists') {
        super(message, http_status_1.HttpStatus.CONFLICT);
    }
}
exports.ConflictError = ConflictError;
//# sourceMappingURL=conflict-error.js.map