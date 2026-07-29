import { PickListRepository } from './pickList.repository';
import { CreatePickListDTO, AssignPickListDTO, PickListResponse } from './pickList.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class PickListService {
    private readonly pickListRepository;
    constructor(pickListRepository: PickListRepository);
    create(dto: CreatePickListDTO, userId: string): Promise<PickListResponse>;
    search(queryParams: Record<string, unknown>, userRole?: string, userId?: string): Promise<{
        data: PickListResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<PickListResponse>;
    getByWorker(workerId: string, pageInput: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: PickListResponse[];
        meta: PaginationMeta;
    }>;
    assign(id: string, dto: AssignPickListDTO, userId: string): Promise<PickListResponse>;
    start(id: string, userId: string): Promise<PickListResponse>;
    complete(id: string, userId: string): Promise<PickListResponse>;
    cancel(id: string, userId: string): Promise<PickListResponse>;
    private generatePickListNumber;
    private toPickListResponse;
}
//# sourceMappingURL=pickList.service.d.ts.map