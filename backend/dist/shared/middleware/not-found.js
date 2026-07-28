"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const http_status_1 = require("../constants/http-status");
const notFoundHandler = (req, res) => {
    res.status(http_status_1.HttpStatus.NOT_FOUND).json({
        success: false,
        error: {
            name: 'NotFoundError',
            message: `Route not found: ${req.method} ${req.originalUrl}`,
        },
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=not-found.js.map