import { DeviceRepository } from './device.repository';
import { BinRepository } from '../bin/bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import {
  CreateDeviceDTO,
  UpdateDeviceDTO,
  DeviceResponse,
  IDevice,
  DeviceSearchParams,
} from './device.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';

export class DeviceService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly binRepository: BinRepository,
    private readonly aisleRepository: AisleRepository,
    private readonly zoneRepository: ZoneRepository,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  async create(dto: CreateDeviceDTO, userId: string): Promise<DeviceResponse> {
    const existingSerial = await this.deviceRepository.findBySerialNumber(dto.serialNumber);

    if (existingSerial) {
      throw new ConflictError('A device with this serial number already exists');
    }

    if (dto.imei) {
      const existingImei = await this.deviceRepository.findByImei(dto.imei);

      if (existingImei) {
        throw new ConflictError('A device with this IMEI already exists');
      }
    }

    const bin = await this.binRepository.findById(dto.binId);

    if (!bin) {
      throw new NotFoundError('Bin not found');
    }

    const aisle = await this.aisleRepository.findById(bin.aisleId);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    const zone = await this.zoneRepository.findById(aisle.zoneId);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    const warehouse = await this.warehouseRepository.findById(zone.warehouseId);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    const device = await this.deviceRepository.create({
      ...dto,
      aisleId: bin.aisleId,
      zoneId: aisle.zoneId,
      warehouseId: zone.warehouseId,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toDeviceResponse(device);
  }

  async search(params: DeviceSearchParams): Promise<{ data: DeviceResponse[]; meta: PaginationMeta }> {
    const filter: Record<string, unknown> = { ...this.buildFilter(params) };
    const pagination = parsePagination({ page: params.page, limit: params.limit });

    const sort: Record<string, 1 | -1> = {
      [params.sortBy]: params.sortOrder === 'asc' ? 1 : -1,
    };

    const [devices, total] = await Promise.all([
      this.deviceRepository.search(filter as any, pagination.skip, pagination.limit, sort),
      this.deviceRepository.count(filter as any),
    ]);

    return {
      data: devices.map((d) => this.toDeviceResponse(d)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<DeviceResponse> {
    const device = await this.deviceRepository.findById(id);

    if (!device) {
      throw new NotFoundError('Device not found');
    }

    return this.toDeviceResponse(device);
  }

  async update(id: string, dto: UpdateDeviceDTO, userId: string): Promise<DeviceResponse> {
    const device = await this.deviceRepository.findById(id);

    if (!device) {
      throw new NotFoundError('Device not found');
    }

    if (dto.serialNumber && dto.serialNumber !== device.serialNumber) {
      const existing = await this.deviceRepository.findBySerialNumber(dto.serialNumber);

      if (existing) {
        throw new ConflictError('A device with this serial number already exists');
      }
    }

    if (dto.imei && dto.imei !== device.imei) {
      const existing = await this.deviceRepository.findByImei(dto.imei);

      if (existing) {
        throw new ConflictError('A device with this IMEI already exists');
      }
    }

    const locationUpdates: Record<string, string> = {};

    if (dto.binId && dto.binId !== device.binId) {
      const bin = await this.binRepository.findById(dto.binId);

      if (!bin) {
        throw new NotFoundError('Bin not found');
      }

      const aisle = await this.aisleRepository.findById(bin.aisleId);

      if (!aisle) {
        throw new NotFoundError('Aisle not found');
      }

      const zone = await this.zoneRepository.findById(aisle.zoneId);

      if (!zone) {
        throw new NotFoundError('Zone not found');
      }

      const warehouse = await this.warehouseRepository.findById(zone.warehouseId);

      if (!warehouse) {
        throw new NotFoundError('Warehouse not found');
      }

      locationUpdates.aisleId = bin.aisleId;
      locationUpdates.zoneId = aisle.zoneId;
      locationUpdates.warehouseId = zone.warehouseId;
    }

    const updated = await this.deviceRepository.update(id, {
      ...dto,
      ...locationUpdates,
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Device not found');
    }

    return this.toDeviceResponse(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const device = await this.deviceRepository.findById(id);

    if (!device) {
      throw new NotFoundError('Device not found');
    }

    await this.deviceRepository.softDelete(id, userId);
  }

  private buildFilter(params: DeviceSearchParams): Record<string, unknown> {
    const filter: Record<string, unknown> = { isDeleted: { $ne: true } };

    if (params.deviceName) {
      filter.deviceName = { $regex: params.deviceName, $options: 'i' };
    }

    if (params.brand) {
      filter.brand = { $regex: params.brand, $options: 'i' };
    }

    if (params.model) {
      filter.model = { $regex: params.model, $options: 'i' };
    }

    if (params.category) {
      filter.category = params.category;
    }

    if (params.status) {
      filter.status = params.status;
    }

    if (params.condition) {
      filter.condition = params.condition;
    }

    if (params.binId) {
      filter.binId = params.binId;
    }

    if (params.aisleId) {
      filter.aisleId = params.aisleId;
    }

    if (params.zoneId) {
      filter.zoneId = params.zoneId;
    }

    if (params.warehouseId) {
      filter.warehouseId = params.warehouseId;
    }

    return filter;
  }

  private toDeviceResponse(device: IDevice): DeviceResponse {
    return {
      id: device._id.toString(),
      deviceName: device.deviceName,
      brand: device.brand,
      model: device.model,
      category: device.category,
      imei: device.imei,
      serialNumber: device.serialNumber,
      sku: device.sku,
      binId: device.binId,
      aisleId: device.aisleId,
      zoneId: device.zoneId,
      warehouseId: device.warehouseId,
      status: device.status,
      condition: device.condition,
      purchaseDate: device.purchaseDate ? new Date(device.purchaseDate).toISOString() : undefined,
      warrantyExpiry: device.warrantyExpiry ? new Date(device.warrantyExpiry).toISOString() : undefined,
      notes: device.notes,
      createdBy: device.createdBy,
      updatedBy: device.updatedBy,
      createdAt: new Date(device.createdAt).toISOString(),
      updatedAt: new Date(device.updatedAt).toISOString(),
    };
  }
}
