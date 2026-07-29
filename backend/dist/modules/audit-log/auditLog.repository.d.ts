import { IAuditLog, AuditLogSearchParams } from './auditLog.types';
export declare class AuditLogRepository {
    create(data: Record<string, unknown>): Promise<IAuditLog>;
    findById(id: string): Promise<IAuditLog | null>;
    search(filter: Record<string, unknown>, skip: number, limit: number, sort: Record<string, 1 | -1>): Promise<IAuditLog[]>;
    count(filter: Record<string, unknown>): Promise<number>;
    buildFilter(params: AuditLogSearchParams): Record<string, unknown>;
}
//# sourceMappingURL=auditLog.repository.d.ts.map