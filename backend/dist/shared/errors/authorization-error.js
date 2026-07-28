"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationError = void 0;
const app_error_1 = require("./app-error");
const http_status_1 = require("../constants/http-status");
class AuthorizationError extends app_error_1.AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, http_status_1.HttpStatus.FORBIDDEN);
    }
}
exports.AuthorizationError = AuthorizationError;
//# sourceMappingURL=authorization-error.js.map