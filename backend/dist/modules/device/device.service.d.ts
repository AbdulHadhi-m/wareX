import { DeviceRepository } from './device.repository';
import { BinRepository } from '../bin/bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import { CreateDeviceDTO, UpdateDeviceDTO, DeviceResponse } from './device.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class DeviceService {
    private readonly deviceRepository;
    private readonly binRepository;
    private readonly aisleRepository;
    private readonly zoneRepository;
    private readonly warehouseRepository;
    constructor(deviceRepository: DeviceRepository, binRepository: BinRepository, aisleRepository: AisleRepository, zoneRepository: ZoneRepository, warehouseRepository: WarehouseRepository);
    create(dto: CreateDeviceDTO, userId: string): Promise<DeviceResponse>;
    search(queryParams: Record<string, unknown>): Promise<{
        data: DeviceResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<DeviceResponse>;
    update(id: string, dto: UpdateDeviceDTO, userId: string): Promise<DeviceResponse>;
    delete(id: string, userId: string): Promise<void>;
    private toDeviceResponse;
}
//# sourceMappingURL=device.service.d.ts.map