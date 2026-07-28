"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePagination = parsePagination;
exports.buildPaginationMeta = buildPaginationMeta;
const app_constants_1 = require("../constants/app.constants");
function parsePagination(input) {
    const page = Math.max(1, input.page ?? app_constants_1.PAGINATION.DEFAULT_PAGE);
    const limit = Math.min(app_constants_1.PAGINATION.MAX_LIMIT, Math.max(1, input.limit ?? app_constants_1.PAGINATION.DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
function buildPaginationMeta(total, params) {
    const totalPages = Math.ceil(total / params.limit);
    return {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNext: params.page < totalPages,
        hasPrevious: params.page > 1,
    };
}
//# sourceMappingURL=pagination.js.map