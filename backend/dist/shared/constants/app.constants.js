"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX = exports.DATETIME_FORMAT = exports.PAGINATION = exports.API_VERSION = void 0;
exports.API_VERSION = 'v1';
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
exports.DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
exports.REGEX = {
    IMEI: /^\d{15}$/,
    SERIAL_NUMBER: /^[A-Za-z0-9\-]{1,50}$/,
    OBJECT_ID: /^[a-f\d]{24}$/i,
};
//# sourceMappingURL=app.constants.js.map