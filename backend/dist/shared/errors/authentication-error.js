"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const app_error_1 = require("./app-error");
const http_status_1 = require("../constants/http-status");
class AuthenticationError extends app_error_1.AppError {
    constructor(message = 'Authentication failed') {
        super(message, http_status_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=authentication-error.js.map