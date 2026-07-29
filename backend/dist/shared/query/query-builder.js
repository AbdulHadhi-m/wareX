"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const app_constants_1 = require("../constants/app.constants");
class QueryBuilder {
    static build(parsed, config) {
        const conditions = [];
        if (config.baseFilter) {
            conditions.push(config.baseFilter);
        }
        if (parsed.search && config.searchableFields.length > 0) {
            const regex = { $regex: parsed.search, $options: 'i' };
            const orConditions = config.searchableFields.map((field) => ({
                [field]: regex,
            }));
            conditions.push({ $or: orConditions });
        }
        for (const [field, value] of Object.entries(parsed.filters)) {
            if (value !== undefined && value !== null && value !== '') {
                conditions.push({ [field]: value });
            }
        }
        if (parsed.dateRange && Object.keys(parsed.dateRange).length > 0) {
            conditions.push(parsed.dateRange);
        }
        const filter = conditions.length > 0 ? { $and: conditions } : {};
        const sortField = config.sortableFields.includes(parsed.sort.field)
            ? parsed.sort.field
            : config.defaultSort.field;
        const sort = {
            [sortField]: parsed.sort.order === 'asc' ? 1 : -1,
        };
        const page = Math.max(1, parsed.page);
        const limit = Math.min(app_constants_1.PAGINATION.MAX_LIMIT, Math.max(1, parsed.limit));
        const skip = (page - 1) * limit;
        let projection = {};
        if (parsed.fields && parsed.fields.length > 0) {
            for (const field of parsed.fields) {
                if (field !== '__v' && field !== 'isDeleted' && field !== 'deletedAt') {
                    projection[field] = 1;
                }
            }
        }
        if (Object.keys(projection).length === 0) {
            projection = {};
        }
        return { filter, sort, skip, limit, projection };
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=query-builder.js.map