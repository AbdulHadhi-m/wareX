"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const zoneQueryConfig = {
    searchableFields: ['name', 'code'],
    filterableFields: ['warehouseId', 'status'],
    sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    baseFilter: { isDeleted: { $ne: true } },
};
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
    async search(queryParams) {
        const parsed = query_1.QueryParser.parse(queryParams, zoneQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, zoneQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [zones, total] = await Promise.all([
            this.zoneRepository.search(mongoQuery),
            this.zoneRepository.countSearch(mongoQuery),
        ]);
        return {
            data: zones.map((z) => this.toZoneResponse(z)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
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