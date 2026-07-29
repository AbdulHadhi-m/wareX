import { AuditLogRepository } from './auditLog.repository';
import { AuditLogCreateDTO, AuditLogResponse, AuditLogSearchParams } from './auditLog.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class AuditLogService {
    private readonly auditLogRepository;
    constructor(auditLogRepository: AuditLogRepository);
    log(dto: AuditLogCreateDTO): Promise<void>;
    search(params: AuditLogSearchParams): Promise<{
        data: AuditLogResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<AuditLogResponse>;
    private toAuditLogResponse;
}
export declare const auditService: AuditLogService;
//# sourceMappingURL=auditLog.service.d.ts.map