"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParser = void 0;
const pagination_1 = require("../utils/pagination");
class QueryParser {
    static parse(raw, config) {
        const search = typeof raw.search === 'string' && raw.search.trim().length > 0
            ? raw.search.trim()
            : undefined;
        const filters = {};
        for (const field of config.filterableFields) {
            if (raw[field] !== undefined && raw[field] !== null && raw[field] !== '') {
                filters[field] = raw[field];
            }
        }
        let dateRange;
        if (config.dateRangeFields && config.dateRangeFields.length > 0) {
            const dateFrom = raw.dateFrom;
            const dateTo = raw.dateTo;
            if (dateFrom || dateTo) {
                const rangeFilter = {};
                const dateFilter = {};
                if (dateFrom) {
                    dateFilter.$gte = new Date(dateFrom);
                }
                if (dateTo) {
                    dateFilter.$lte = new Date(dateTo);
                }
                rangeFilter.$or = config.dateRangeFields.map((field) => ({
                    [field]: dateFilter,
                }));
                dateRange = rangeFilter;
            }
        }
        const sortField = raw.sortBy || config.defaultSort.field;
        const sortOrder = raw.sortOrder === 'asc' ? 'asc' : 'desc';
        const sort = { field: sortField, order: sortOrder };
        const pagination = (0, pagination_1.parsePagination)({
            page: raw.page ? Number(raw.page) : undefined,
            limit: raw.limit ? Number(raw.limit) : undefined,
        });
        let fields;
        if (typeof raw.fields === 'string' && raw.fields.trim().length > 0) {
            fields = raw.fields.split(',').map((f) => f.trim()).filter(Boolean);
        }
        return {
            search,
            filters,
            dateRange,
            sort,
            page: pagination.page,
            limit: pagination.limit,
            skip: pagination.skip,
            fields,
        };
    }
}
exports.QueryParser = QueryParser;
//# sourceMappingURL=query-parser.js.map