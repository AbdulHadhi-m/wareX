"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.standardLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("../config/environment");
const http_status_1 = require("../constants/http-status");
const standardLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.environment.RATE_LIMIT_WINDOW_MS,
    max: environment_1.environment.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(http_status_1.HttpStatus.TOO_MANY_REQUESTS).json({
            success: false,
            error: {
                name: 'RateLimitError',
                message: 'Too many requests. Please try again later.',
            },
        });
    },
});
exports.standardLimiter = standardLimiter;
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.environment.RATE_LIMIT_WINDOW_MS,
    max: environment_1.environment.RATE_LIMIT_AUTH_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(http_status_1.HttpStatus.TOO_MANY_REQUESTS).json({
            success: false,
            error: {
                name: 'RateLimitError',
                message: 'Too many authentication attempts. Please try again later.',
            },
        });
    },
});
exports.authLimiter = authLimiter;
//# sourceMappingURL=rate-limiter.js.map