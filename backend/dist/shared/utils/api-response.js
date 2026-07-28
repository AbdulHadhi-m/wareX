"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendCreated = sendCreated;
exports.sendNoContent = sendNoContent;
function sendSuccess(res, data, statusCode = 200, meta) {
    const body = { success: true, data };
    if (meta) {
        body.meta = meta;
    }
    res.status(statusCode).json(body);
}
function sendCreated(res, data) {
    sendSuccess(res, data, 201);
}
function sendNoContent(res) {
    res.status(204).send();
}
//# sourceMappingURL=api-response.js.map