"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const app_error_1 = require("./app-error");
const http_status_1 = require("../constants/http-status");
class ValidationError extends app_error_1.AppError {
    constructor(message = 'Validation failed', details) {
        super(message, http_status_1.HttpStatus.UNPROCESSABLE_ENTITY, details);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=validation-error.js.map