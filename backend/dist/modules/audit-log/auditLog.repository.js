"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogRepository = void 0;
const auditLog_model_1 = require("./auditLog.model");
class AuditLogRepository {
    async create(data) {
        const doc = await auditLog_model_1.AuditLogModel.create(data);
        return doc.toObject();
    }
    async findById(id) {
        return auditLog_model_1.AuditLogModel.findById(id).lean();
    }
    async search(filter, skip, limit, sort) {
        return auditLog_model_1.AuditLogModel.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    }
    async count(filter) {
        return auditLog_model_1.AuditLogModel.countDocuments(filter);
    }
    buildFilter(params) {
        const filter = {};
        if (params.userId) {
            filter.userId = params.userId;
        }
        if (params.module) {
            filter.module = params.module;
        }
        if (params.action) {
            filter.action = params.action;
        }
        if (params.resourceType) {
            filter.resourceType = params.resourceType;
        }
        if (params.startDate || params.endDate) {
            const createdAt = {};
            if (params.startDate) {
                createdAt.$gte = new Date(params.startDate);
            }
            if (params.endDate) {
                createdAt.$lte = new Date(params.endDate);
            }
            filter.createdAt = createdAt;
        }
        return filter;
    }
}
exports.AuditLogRepository = AuditLogRepository;
//# sourceMappingURL=auditLog.repository.js.map