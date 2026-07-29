"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const deviceQueryConfig = {
    searchableFields: ['deviceName', 'brand', 'model', 'category', 'sku', 'serialNumber', 'imei'],
    filterableFields: ['status', 'condition', 'brand', 'category', 'binId', 'aisleId', 'zoneId', 'warehouseId'],
    sortableFields: ['createdAt', 'updatedAt', 'deviceName', 'brand', 'model', 'status', 'serialNumber'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    baseFilter: { isDeleted: { $ne: true } },
};
class DeviceService {
    deviceRepository;
    binRepository;
    aisleRepository;
    zoneRepository;
    warehouseRepository;
    constructor(deviceRepository, binRepository, aisleRepository, zoneRepository, warehouseRepository) {
        this.deviceRepository = deviceRepository;
        this.binRepository = binRepository;
        this.aisleRepository = aisleRepository;
        this.zoneRepository = zoneRepository;
        this.warehouseRepository = warehouseRepository;
    }
    async create(dto, userId) {
        const existingSerial = await this.deviceRepository.findBySerialNumber(dto.serialNumber);
        if (existingSerial) {
            throw new conflict_error_1.ConflictError('A device with this serial number already exists');
        }
        if (dto.imei) {
            const existingImei = await this.deviceRepository.findByImei(dto.imei);
            if (existingImei) {
                throw new conflict_error_1.ConflictError('A device with this IMEI already exists');
            }
        }
        const bin = await this.binRepository.findById(dto.binId);
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        const aisle = await this.aisleRepository.findById(bin.aisleId);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        const zone = await this.zoneRepository.findById(aisle.zoneId);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        const warehouse = await this.warehouseRepository.findById(zone.warehouseId);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
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
    async search(queryParams) {
        const parsed = query_1.QueryParser.parse(queryParams, deviceQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, deviceQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [devices, total] = await Promise.all([
            this.deviceRepository.search(mongoQuery),
            this.deviceRepository.countSearch(mongoQuery),
        ]);
        return {
            data: devices.map((d) => this.toDeviceResponse(d)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const device = await this.deviceRepository.findById(id);
        if (!device) {
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        return this.toDeviceResponse(device);
    }
    async update(id, dto, userId) {
        const device = await this.deviceRepository.findById(id);
        if (!device) {
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        if (dto.serialNumber && dto.serialNumber !== device.serialNumber) {
            const existing = await this.deviceRepository.findBySerialNumber(dto.serialNumber);
            if (existing) {
                throw new conflict_error_1.ConflictError('A device with this serial number already exists');
            }
        }
        if (dto.imei && dto.imei !== device.imei) {
            const existing = await this.deviceRepository.findByImei(dto.imei);
            if (existing) {
                throw new conflict_error_1.ConflictError('A device with this IMEI already exists');
            }
        }
        const locationUpdates = {};
        if (dto.binId && dto.binId !== device.binId) {
            const bin = await this.binRepository.findById(dto.binId);
            if (!bin) {
                throw new not_found_error_1.NotFoundError('Bin not found');
            }
            const aisle = await this.aisleRepository.findById(bin.aisleId);
            if (!aisle) {
                throw new not_found_error_1.NotFoundError('Aisle not found');
            }
            const zone = await this.zoneRepository.findById(aisle.zoneId);
            if (!zone) {
                throw new not_found_error_1.NotFoundError('Zone not found');
            }
            const warehouse = await this.warehouseRepository.findById(zone.warehouseId);
            if (!warehouse) {
                throw new not_found_error_1.NotFoundError('Warehouse not found');
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
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        return this.toDeviceResponse(updated);
    }
    async delete(id, userId) {
        const device = await this.deviceRepository.findById(id);
        if (!device) {
            throw new not_found_error_1.NotFoundError('Device not found');
        }
        await this.deviceRepository.softDelete(id, userId);
    }
    toDeviceResponse(device) {
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
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map