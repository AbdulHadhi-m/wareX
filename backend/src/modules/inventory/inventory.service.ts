import mongoose from 'mongoose';
import { MovementHistoryRepository } from './inventory.repository';
import {
  MoveDeviceDTO,
  MovementHistoryResponse,
  DeviceLocationResponse,
  InventoryDeviceResponse,
  InventoryQueryResult,
  IMovementHistory,
} from './inventory.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { ValidationError } from '../../shared/errors/validation-error';
import { parsePagination } from '../../shared/utils/pagination';
import { eventEmitter, Events } from '../../shared/events/event-emitter';
import { DeviceModel } from '../device/device.model';
import { BinModel } from '../bin/bin.model';
import { AisleModel } from '../aisle/aisle.model';
import { ZoneModel } from '../zone/zone.model';
import { WarehouseModel } from '../warehouse/warehouse.model';

export class InventoryService {
  constructor(
    private readonly movementHistoryRepository: MovementHistoryRepository,
  ) {}

  async move(dto: MoveDeviceDTO, userId: string): Promise<MovementHistoryResponse> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const device = await DeviceModel.findById(dto.deviceId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!device) {
        throw new NotFoundError('Device not found');
      }

      const fromBinId = device.binId;

      const fromBin = await BinModel.findById(fromBinId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!fromBin) {
        throw new NotFoundError('Source bin not found');
      }

      if (fromBinId === dto.toBinId) {
        throw new ValidationError('Source and destination bins are identical');
      }

      const toBin = await BinModel.findById(dto.toBinId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!toBin) {
        throw new NotFoundError('Destination bin not found');
      }

      const deviceCount = await DeviceModel.countDocuments({
        binId: dto.toBinId,
        _id: { $ne: dto.deviceId },
        isDeleted: { $ne: true },
      } as any).session(session);

      if (deviceCount >= toBin.capacity) {
        throw new ConflictError('Destination bin has reached capacity');
      }

      const toAisle = await AisleModel.findById(toBin.aisleId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!toAisle) {
        throw new NotFoundError('Destination aisle not found');
      }

      const toZone = await ZoneModel.findById(toAisle.zoneId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!toZone) {
        throw new NotFoundError('Destination zone not found');
      }

      const toWarehouse = await WarehouseModel.findById(toZone.warehouseId)
        .where('isDeleted')
        .ne(true)
        .session(session)
        .lean();

      if (!toWarehouse) {
        throw new NotFoundError('Destination warehouse not found');
      }

      const updatedDevice = await DeviceModel.findByIdAndUpdate(
        dto.deviceId,
        {
          $set: {
            binId: dto.toBinId,
            aisleId: toBin.aisleId,
            zoneId: toAisle.zoneId,
            warehouseId: toZone.warehouseId,
            updatedBy: userId,
          },
        },
        { new: true, session, runValidators: true },
      );

      if (!updatedDevice) {
        throw new NotFoundError('Device not found after update');
      }

      const history = await this.movementHistoryRepository.create(
        {
          deviceId: dto.deviceId,
          fromWarehouseId: device.warehouseId,
          fromZoneId: device.zoneId,
          fromAisleId: device.aisleId,
          fromBinId: fromBinId,
          toWarehouseId: toZone.warehouseId,
          toZoneId: toAisle.zoneId,
          toAisleId: toBin.aisleId,
          toBinId: dto.toBinId,
          movementType: dto.movementType,
          reason: dto.reason ?? null,
          performedBy: userId,
        },
        session,
      );

      await session.commitTransaction();

      eventEmitter.emit(Events.DEVICE_MOVED, {
        deviceId: device._id.toString(),
        deviceName: device.deviceName,
        serialNumber: device.serialNumber,
        fromBin: fromBin.name,
        toBin: toBin.name,
      });

      return this.toMovementHistoryResponse(history);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getDeviceLocation(deviceId: string): Promise<DeviceLocationResponse> {
    const device = await DeviceModel.findById(deviceId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!device) {
      throw new NotFoundError('Device not found');
    }

    const bin = await BinModel.findById(device.binId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!bin) {
      throw new NotFoundError('Bin not found for device location');
    }

    const aisle = await AisleModel.findById(device.aisleId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!aisle) {
      throw new NotFoundError('Aisle not found for device location');
    }

    const zone = await ZoneModel.findById(device.zoneId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!zone) {
      throw new NotFoundError('Zone not found for device location');
    }

    const warehouse = await WarehouseModel.findById(device.warehouseId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found for device location');
    }

    return {
      id: device._id.toString(),
      deviceName: device.deviceName,
      brand: device.brand,
      model: device.model,
      serialNumber: device.serialNumber,
      sku: device.sku,
      status: device.status,
      condition: device.condition,
      location: {
        bin: { id: bin._id.toString(), code: bin.code, name: bin.name },
        aisle: { id: aisle._id.toString(), code: aisle.code, name: aisle.name },
        zone: { id: zone._id.toString(), code: zone.code, name: zone.name },
        warehouse: { id: warehouse._id.toString(), code: warehouse.code, name: warehouse.name },
      },
    };
  }

  async getDeviceHistory(deviceId: string): Promise<MovementHistoryResponse[]> {
    const device = await DeviceModel.findById(deviceId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!device) {
      throw new NotFoundError('Device not found');
    }

    const movements = await this.movementHistoryRepository.findByDeviceId(deviceId);

    return movements.map((m) => this.toMovementHistoryResponse(m));
  }

  async getByBin(
    binId: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const bin = await BinModel.findById(binId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!bin) {
      throw new NotFoundError('Bin not found');
    }

    const pagination = parsePagination(pageInput);

    const filter: Record<string, unknown> = { binId, isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter as any)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter as any),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async getByWarehouse(
    warehouseId: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const warehouse = await WarehouseModel.findById(warehouseId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    const pagination = parsePagination(pageInput);

    const filter = { warehouseId, isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async getByZone(
    zoneId: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const zone = await ZoneModel.findById(zoneId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    const pagination = parsePagination(pageInput);

    const filter = { zoneId, isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async getByAisle(
    aisleId: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const aisle = await AisleModel.findById(aisleId)
      .where('isDeleted')
      .ne(true)
      .lean();

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    const pagination = parsePagination(pageInput);

    const filter = { aisleId, isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async getByStatus(
    status: string,
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const pagination = parsePagination(pageInput);

    const filter: Record<string, unknown> = { status, isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter as any)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter as any),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async getAll(
    pageInput: { page?: number; limit?: number },
  ): Promise<InventoryQueryResult> {
    const pagination = parsePagination(pageInput);

    const filter = { isDeleted: { $ne: true } };

    const [devices, total] = await Promise.all([
      DeviceModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),
      DeviceModel.countDocuments(filter),
    ]);

    return {
      data: devices.map((d) => this.toInventoryDeviceResponse(d)),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  private toMovementHistoryResponse(history: IMovementHistory): MovementHistoryResponse {
    return {
      id: history._id.toString(),
      deviceId: history.deviceId,
      fromWarehouseId: history.fromWarehouseId ?? null,
      fromZoneId: history.fromZoneId ?? null,
      fromAisleId: history.fromAisleId ?? null,
      fromBinId: history.fromBinId ?? null,
      toWarehouseId: history.toWarehouseId,
      toZoneId: history.toZoneId,
      toAisleId: history.toAisleId,
      toBinId: history.toBinId,
      movementType: history.movementType,
      reason: history.reason,
      performedBy: history.performedBy,
      createdAt: new Date(history.createdAt).toISOString(),
    };
  }

  private toInventoryDeviceResponse(device: Record<string, any>): InventoryDeviceResponse {
    return {
      id: device._id.toString(),
      deviceName: device.deviceName,
      brand: device.brand,
      model: device.model,
      category: device.category,
      serialNumber: device.serialNumber,
      sku: device.sku,
      binId: device.binId,
      aisleId: device.aisleId,
      zoneId: device.zoneId,
      warehouseId: device.warehouseId,
      status: device.status,
      condition: device.condition,
    };
  }
}
