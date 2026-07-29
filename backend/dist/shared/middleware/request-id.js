"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const crypto_1 = require("crypto");
const requestId = (req, _res, next) => {
    req.id = req.headers['x-request-id'] || (0, crypto_1.randomUUID)();
    next();
};
exports.requestId = requestId;
//# sourceMappingURL=request-id.js.map