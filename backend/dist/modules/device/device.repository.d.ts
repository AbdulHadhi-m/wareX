import { IDevice } from './device.types';
export declare class DeviceRepository {
    private baseFilter;
    findById(id: string): Promise<IDevice | null>;
    findBySerialNumber(serialNumber: string): Promise<IDevice | null>;
    findByImei(imei: string): Promise<IDevice | null>;
    search(filter: Record<string, unknown>, skip: number, limit: number, sort: Record<string, 1 | -1>): Promise<IDevice[]>;
    count(filter: Record<string, unknown>): Promise<number>;
    create(data: Record<string, unknown>): Promise<IDevice>;
    update(id: string, data: Record<string, unknown>): Promise<IDevice | null>;
    softDelete(id: string, updatedBy: string): Promise<IDevice | null>;
}
//# sourceMappingURL=device.repository.d.ts.map