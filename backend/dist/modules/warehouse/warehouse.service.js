"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const warehouseQueryConfig = {
    searchableFields: ['name', 'code', 'city'],
    filterableFields: ['status', 'country', 'city'],
    sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
    defaultSort: { field: 'createdAt', order: 'desc' },
    baseFilter: { isDeleted: { $ne: true } },
};
class WarehouseService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto, userId) {
        const existing = await this.repository.findByCode(dto.code);
        if (existing) {
            throw new conflict_error_1.ConflictError('A warehouse with this code already exists');
        }
        const warehouse = await this.repository.create({
            ...dto,
            code: dto.code.toUpperCase(),
            createdBy: userId,
            updatedBy: userId,
        });
        return this.toWarehouseResponse(warehouse);
    }
    async findAll() {
        const warehouses = await this.repository.findAll();
        return warehouses.map((w) => this.toWarehouseResponse(w));
    }
    async search(queryParams) {
        const parsed = query_1.QueryParser.parse(queryParams, warehouseQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, warehouseQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [warehouses, total] = await Promise.all([
            this.repository.search(mongoQuery),
            this.repository.countSearch(mongoQuery),
        ]);
        return {
            data: warehouses.map((w) => this.toWarehouseResponse(w)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const warehouse = await this.repository.findById(id);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        return this.toWarehouseResponse(warehouse);
    }
    async update(id, dto, userId) {
        const warehouse = await this.repository.findById(id);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        if (dto.code) {
            const existing = await this.repository.findByCodeExcludingId(dto.code, id);
            if (existing) {
                throw new conflict_error_1.ConflictError('A warehouse with this code already exists');
            }
        }
        const updated = await this.repository.update(id, {
            ...dto,
            code: dto.code?.toUpperCase(),
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        return this.toWarehouseResponse(updated);
    }
    async delete(id, userId) {
        const warehouse = await this.repository.findById(id);
        if (!warehouse) {
            throw new not_found_error_1.NotFoundError('Warehouse not found');
        }
        await this.repository.softDelete(id, userId);
    }
    toWarehouseResponse(warehouse) {
        return {
            id: warehouse._id.toString(),
            name: warehouse.name,
            code: warehouse.code,
            description: warehouse.description,
            address: warehouse.address,
            city: warehouse.city,
            state: warehouse.state,
            country: warehouse.country,
            postalCode: warehouse.postalCode,
            status: warehouse.status,
            createdBy: warehouse.createdBy,
            updatedBy: warehouse.updatedBy,
            createdAt: new Date(warehouse.createdAt).toISOString(),
            updatedAt: new Date(warehouse.updatedAt).toISOString(),
        };
    }
}
exports.WarehouseService = WarehouseService;
//# sourceMappingURL=warehouse.service.js.map