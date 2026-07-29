import { IDevice } from './device.types';
import { type MongoQuery } from '../../shared/query';
export declare class DeviceRepository {
    private baseFilter;
    findById(id: string): Promise<IDevice | null>;
    findBySerialNumber(serialNumber: string): Promise<IDevice | null>;
    findByImei(imei: string): Promise<IDevice | null>;
    search(query: MongoQuery): Promise<IDevice[]>;
    countSearch(query: MongoQuery): Promise<number>;
    create(data: Record<string, unknown>): Promise<IDevice>;
    update(id: string, data: Record<string, unknown>): Promise<IDevice | null>;
    softDelete(id: string, updatedBy: string): Promise<IDevice | null>;
}
//# sourceMappingURL=device.repository.d.ts.map