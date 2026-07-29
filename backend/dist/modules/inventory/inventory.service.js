"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const validation_error_1 = require("../../shared/errors/validation-error");
const pagination_1 = require("../../shared/utils/pagination");
const event_emitter_1 = require("../../shared/events/event-emitter");
const device_model_1 = require("../device/device.model");
const bin_model_1 = require("../bin/bin.model");
const aisle_model_1 = require("../aisle/aisle.model");
const zone_model_1 = require("../zone/zone.model");
const warehouse_model_1 = require("../warehouse/warehouse.model");
class InventoryService {
    movementHistoryRepository;
    constructor(movementHistoryRepository) {
        this.movementHistoryRepository = movementHistoryRepository;
    }
    async move(dto, userId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const device = await device_model_1.DeviceModel.findById(dto.deviceId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!device) {
                throw new not_found_error_1.NotFoundError('Device not found');
            }
            const fromBinId = device.binId;
            const fromBin = await bin_model_1.BinModel.findById(fromBinId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!fromBin) {
                throw new not_found_error_1.NotFoundError('Source bin not found');
            }
            if (fromBinId === dto.toBinId) {
                throw new validation_error_1.ValidationError('Source and destination bins are identical');
            }
            const toBin = await bin_model_1.BinModel.findById(dto.toBinId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!toBin) {
                throw new not_found_error_1.NotFoundError('Destination bin not found');
            }
            const deviceCount = await device_model_1.DeviceModel.countDocuments({
                binId: dto.toBinId,
                _id: { $ne: dto.deviceId },
                isDeleted: { $ne: true },
            }).session(session);
            if (deviceCount >= toBin.capacity) {
                throw new conflict_error_1.ConflictError('Destination bin has reached capacity');
            }
            const toAisle = await aisle_model_1.AisleModel.findById(toBin.aisleId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!toAisle) {
                throw new not_found_error_1.NotFoundError('Destination aisle not found');
            }
            const toZone = await zone_model_1.ZoneModel.findById(toAisle.zoneId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!toZone) {
                throw new not_found_error_1.NotFoundError('Destination zone not found');
            }
            const toWarehouse = await warehouse_model_1.WarehouseModel.findById(toZone.warehouseId)
                .where('isDeleted')
                .ne(true)
                .session(session)
                .lean();
            if (!toWarehouse) {
                throw new not_found_error_1.NotFoundError('Destination warehouse not found');
            }
            const updatedDevice = await device_model_1.DeviceModel.findByIdAndUpdate(dto.deviceId, {
                $set: {
                    binId: dto.toBinId,
                    aisleId: toBin.aisleId,
                    zoneId: toAisle.zoneId,
                    warehouseId: toZone.warehouseId,
                    updatedBy: userId,
                },
            }, { new: true, session, runValidators: true });
            if (!updatedDevice) {
                throw new not_found_error_1.NotFoundError('Device not found after update');
            }
            const history = await this.movementHistoryRepository.create({
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
            }, session);
            await session.commitTransaction();
            event_emitter_1.eventEmitter.emit(event_emitter_1.Events.DEVICE_MOVED, {
                deviceId: device._id.toString(),
                deviceName: device.deviceName,
                serialNumber: device.serialNumber,
                fromBin: fromBin.name,
                toBin: toBin.name,
            });
            return this.toMovementHistoryResponse(history);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async getDeviceLocation(deviceId) {
        const device = await device_model_1.DeviceModel.findById(deviceId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!device) {
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        const bin = await bin_model_1.BinModel.findById(device.binId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found for device location');
        }
        const aisle = await aisle_model_1.AisleModel.findById(device.aisleId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found for device location');
        }
        const zone = await zone_model_1.ZoneModel.findById(device.zoneId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found for device location');
        }
        const warehouse = await warehouse_model_1.WarehouseModel.findById(device.warehouseId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found for device location');
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
    async getDeviceHistory(deviceId) {
        const device = await device_model_1.DeviceModel.findById(deviceId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!device) {
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        const movements = await this.movementHistoryRepository.findByDeviceId(deviceId);
        return movements.map((m) => this.toMovementHistoryResponse(m));
    }
    async getByBin(binId, pageInput) {
        const bin = await bin_model_1.BinModel.findById(binId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { binId, isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async getByWarehouse(warehouseId, pageInput) {
        const warehouse = await warehouse_model_1.WarehouseModel.findById(warehouseId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { warehouseId, isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async getByZone(zoneId, pageInput) {
        const zone = await zone_model_1.ZoneModel.findById(zoneId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { zoneId, isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async getByAisle(aisleId, pageInput) {
        const aisle = await aisle_model_1.AisleModel.findById(aisleId)
            .where('isDeleted')
            .ne(true)
            .lean();
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { aisleId, isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async getByStatus(status, pageInput) {
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { status, isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    async getAll(pageInput) {
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const filter = { isDeleted: { $ne: true } };
        const [devices, total] = await Promise.all([
            device_model_1.DeviceModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(pagination.skip)
                .limit(pagination.limit)
                .lean(),
            device_model_1.DeviceModel.countDocuments(filter),
        ]);
        return {
            data: devices.map((d) => this.toInventoryDeviceResponse(d)),
            total,
            page: pagination.page,
            limit: pagination.limit,
        };
    }
    toMovementHistoryResponse(history) {
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
    toInventoryDeviceResponse(device) {
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
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map