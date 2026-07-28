import { ZoneRepository } from './zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import {
  CreateZoneDTO,
  UpdateZoneDTO,
  ZoneResponse,
  IZone,
} from './zone.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';

export class ZoneService {
  constructor(
    private readonly zoneRepository: ZoneRepository,
    private readonly warehouseRepository: WarehouseRepository,
  ) {}

  async create(dto: CreateZoneDTO, userId: string): Promise<ZoneResponse> {
    const warehouse = await this.warehouseRepository.findById(dto.warehouseId);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    const existing = await this.zoneRepository.findByCodeInWarehouse(dto.code, dto.warehouseId);

    if (existing) {
      throw new ConflictError('A zone with this code already exists in this warehouse');
    }

    const zone = await this.zoneRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toZoneResponse(zone);
  }

  async findAll(): Promise<ZoneResponse[]> {
    const zones = await this.zoneRepository.findAll();
    return zones.map((z) => this.toZoneResponse(z));
  }

  async findById(id: string): Promise<ZoneResponse> {
    const zone = await this.zoneRepository.findById(id);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    return this.toZoneResponse(zone);
  }

  async findByWarehouseId(warehouseId: string): Promise<ZoneResponse[]> {
    const warehouse = await this.warehouseRepository.findById(warehouseId);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    const zones = await this.zoneRepository.findByWarehouseId(warehouseId);
    return zones.map((z) => this.toZoneResponse(z));
  }

  async update(id: string, dto: UpdateZoneDTO, userId: string): Promise<ZoneResponse> {
    const zone = await this.zoneRepository.findById(id);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    if (dto.code) {
      const existing = await this.zoneRepository.findByCodeInWarehouseExcludingId(
        dto.code,
        zone.warehouseId,
        id,
      );

      if (existing) {
        throw new ConflictError('A zone with this code already exists in this warehouse');
      }
    }

    const updated = await this.zoneRepository.update(id, {
      ...dto,
      code: dto.code?.toUpperCase(),
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Zone not found');
    }

    return this.toZoneResponse(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const zone = await this.zoneRepository.findById(id);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    await this.zoneRepository.softDelete(id, userId);
  }

  private toZoneResponse(zone: IZone): ZoneResponse {
    return {
      id: zone._id.toString(),
      warehouseId: zone.warehouseId,
      name: zone.name,
      code: zone.code,
      description: zone.description,
      status: zone.status,
      createdBy: zone.createdBy,
      updatedBy: zone.updatedBy,
      createdAt: new Date(zone.createdAt).toISOString(),
      updatedAt: new Date(zone.updatedAt).toISOString(),
    };
  }
}
