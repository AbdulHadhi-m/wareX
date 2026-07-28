"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
class ZoneService {
    zoneRepository;
    warehouseRepository;
    constructor(zoneRepository, warehouseRepository) {
        this.zoneRepository = zoneRepository;
        this.warehouseRepository = warehouseRepository;
    }
    async create(dto, userId) {
        const warehouse = await this.warehouseRepository.findById(dto.warehouseId);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        const existing = await this.zoneRepository.findByCodeInWarehouse(dto.code, dto.warehouseId);
        if (existing) {
            throw new conflict_error_1.ConflictError('A zone with this code already exists in this warehouse');
        }
        const zone = await this.zoneRepository.create({
            ...dto,
            code: dto.code.toUpperCase(),
            createdBy: userId,
            updatedBy: userId,
        });
        return this.toZoneResponse(zone);
    }
    async findAll() {
        const zones = await this.zoneRepository.findAll();
        return zones.map((z) => this.toZoneResponse(z));
    }
    async findById(id) {
        const zone = await this.zoneRepository.findById(id);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        return this.toZoneResponse(zone);
    }
    async findByWarehouseId(warehouseId) {
        const warehouse = await this.warehouseRepository.findById(warehouseId);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        const zones = await this.zoneRepository.findByWarehouseId(warehouseId);
        return zones.map((z) => this.toZoneResponse(z));
    }
    async update(id, dto, userId) {
        const zone = await this.zoneRepository.findById(id);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        if (dto.code) {
            const existing = await this.zoneRepository.findByCodeInWarehouseExcludingId(dto.code, zone.warehouseId, id);
            if (existing) {
                throw new conflict_error_1.ConflictError('A zone with this code already exists in this warehouse');
            }
        }
        const updated = await this.zoneRepository.update(id, {
            ...dto,
            code: dto.code?.toUpperCase(),
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        return this.toZoneResponse(updated);
    }
    async delete(id, userId) {
        const zone = await this.zoneRepository.findById(id);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        await this.zoneRepository.softDelete(id, userId);
    }
    toZoneResponse(zone) {
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
exports.ZoneService = ZoneService;
//# sourceMappingURL=zone.service.js.map