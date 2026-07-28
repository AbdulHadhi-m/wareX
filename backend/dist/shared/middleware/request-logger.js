"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../logger/logger");
const requestLogger = (req, res, next) => {
    const start = performance.now();
    res.on('finish', () => {
        const duration = performance.now() - start;
        logger_1.logger.info({
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration.toFixed(2)}ms`,
            contentLength: res.getHeader('content-length') || 0,
            requestId: req.id,
            ip: req.ip,
            userAgent: req.get('user-agent') || 'unknown',
        });
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.js.map