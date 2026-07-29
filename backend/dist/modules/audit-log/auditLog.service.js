"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = exports.AuditLogService = void 0;
const auditLog_repository_1 = require("./auditLog.repository");
const not_found_error_1 = require("../../shared/errors/not-found-error");
const pagination_1 = require("../../shared/utils/pagination");
const auth_model_1 = require("../auth/auth.model");
class AuditLogService {
    auditLogRepository;
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async log(dto) {
        try {
            const user = await auth_model_1.UserModel.findById(dto.userId).select('name').lean();
            await this.auditLogRepository.create({
                userId: dto.userId,
                userName: user?.name || null,
                userRole: dto.userRole,
                module: dto.module,
                action: dto.action,
                resourceType: dto.resourceType,
                resourceId: dto.resourceId ?? null,
                previousData: dto.previousData ?? null,
                newData: dto.newData ?? null,
                ipAddress: dto.ipAddress ?? null,
                userAgent: dto.userAgent ?? null,
            });
        }
        catch {
            // Audit logging must never fail the original operation
        }
    }
    async search(params) {
        const filter = this.auditLogRepository.buildFilter(params);
        const pagination = (0, pagination_1.parsePagination)({ page: params.page, limit: params.limit });
        const sort = {
            [params.sortBy]: params.sortOrder === 'asc' ? 1 : -1,
        };
        const [logs, total] = await Promise.all([
            this.auditLogRepository.search(filter, pagination.skip, pagination.limit, sort),
            this.auditLogRepository.count(filter),
        ]);
        return {
            data: logs.map((l) => this.toAuditLogResponse(l)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const log = await this.auditLogRepository.findById(id);
        if (!log) {
            throw new not_found_error_1.NotFoundError('Audit log not found');
        }
        return this.toAuditLogResponse(log);
    }
    toAuditLogResponse(log) {
        return {
            id: log._id.toString(),
            userId: log.userId,
            userName: log.userName,
            userRole: log.userRole,
            module: log.module,
            action: log.action,
            resourceType: log.resourceType,
            resourceId: log.resourceId || undefined,
            previousData: log.previousData || undefined,
            newData: log.newData || undefined,
            ipAddress: log.ipAddress || undefined,
            userAgent: log.userAgent || undefined,
            createdAt: new Date(log.createdAt).toISOString(),
        };
    }
}
exports.AuditLogService = AuditLogService;
exports.auditService = new AuditLogService(new auditLog_repository_1.AuditLogRepository());
//# sourceMappingURL=auditLog.service.js.map