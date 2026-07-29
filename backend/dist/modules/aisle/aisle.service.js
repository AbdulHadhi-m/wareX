"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AisleService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const aisleQueryConfig = {
    searchableFields: ['name', 'code'],
    filterableFields: ['zoneId', 'status'],
    sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    baseFilter: { isDeleted: { $ne: true } },
};
class AisleService {
    aisleRepository;
    zoneRepository;
    constructor(aisleRepository, zoneRepository) {
        this.aisleRepository = aisleRepository;
        this.zoneRepository = zoneRepository;
    }
    async create(dto, userId) {
        const zone = await this.zoneRepository.findById(dto.zoneId);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        const existing = await this.aisleRepository.findByCodeInZone(dto.code, dto.zoneId);
        if (existing) {
            throw new conflict_error_1.ConflictError('An aisle with this code already exists in this zone');
        }
        const aisle = await this.aisleRepository.create({
            ...dto,
            code: dto.code.toUpperCase(),
            createdBy: userId,
            updatedBy: userId,
        });
        return this.toAisleResponse(aisle);
    }
    async findAll() {
        const aisles = await this.aisleRepository.findAll();
        return aisles.map((a) => this.toAisleResponse(a));
    }
    async search(queryParams) {
        const parsed = query_1.QueryParser.parse(queryParams, aisleQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, aisleQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [aisles, total] = await Promise.all([
            this.aisleRepository.search(mongoQuery),
            this.aisleRepository.countSearch(mongoQuery),
        ]);
        return {
            data: aisles.map((a) => this.toAisleResponse(a)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const aisle = await this.aisleRepository.findById(id);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        return this.toAisleResponse(aisle);
    }
    async findByZoneId(zoneId) {
        const zone = await this.zoneRepository.findById(zoneId);
        if (!zone) {
            throw new not_found_error_1.NotFoundError('Zone not found');
        }
        const aisles = await this.aisleRepository.findByZoneId(zoneId);
        return aisles.map((a) => this.toAisleResponse(a));
    }
    async update(id, dto, userId) {
        const aisle = await this.aisleRepository.findById(id);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        if (dto.code) {
            const existing = await this.aisleRepository.findByCodeInZoneExcludingId(dto.code, aisle.zoneId, id);
            if (existing) {
                throw new conflict_error_1.ConflictError('An aisle with this code already exists in this zone');
            }
        }
        const updated = await this.aisleRepository.update(id, {
            ...dto,
            code: dto.code?.toUpperCase(),
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        return this.toAisleResponse(updated);
    }
    async delete(id, userId) {
        const aisle = await this.aisleRepository.findById(id);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        await this.aisleRepository.softDelete(id, userId);
    }
    toAisleResponse(aisle) {
        return {
            id: aisle._id.toString(),
            zoneId: aisle.zoneId,
            name: aisle.name,
            code: aisle.code,
            description: aisle.description,
            status: aisle.status,
            createdBy: aisle.createdBy,
            updatedBy: aisle.updatedBy,
            createdAt: new Date(aisle.createdAt).toISOString(),
            updatedAt: new Date(aisle.updatedAt).toISOString(),
        };
    }
}
exports.AisleService = AisleService;
//# sourceMappingURL=aisle.service.js.map