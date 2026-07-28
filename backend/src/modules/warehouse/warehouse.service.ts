import { WarehouseRepository } from './warehouse.repository';
import {
  CreateWarehouseDTO,
  UpdateWarehouseDTO,
  WarehouseResponse,
  IWarehouse,
} from './warehouse.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { QueryParser, QueryBuilder } from '../../shared/query';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';

const warehouseQueryConfig = {
  searchableFields: ['name', 'code', 'city'],
  filterableFields: ['status', 'country', 'city'],
  sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
  defaultSort: { field: 'createdAt', order: 'desc' as const },
  baseFilter: { isDeleted: { $ne: true } },
};

export class WarehouseService {
  constructor(private readonly repository: WarehouseRepository) {}

  async create(dto: CreateWarehouseDTO, userId: string): Promise<WarehouseResponse> {
    const existing = await this.repository.findByCode(dto.code);

    if (existing) {
      throw new ConflictError('A warehouse with this code already exists');
    }

    const warehouse = await this.repository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toWarehouseResponse(warehouse);
  }

  async findAll(): Promise<WarehouseResponse[]> {
    const warehouses = await this.repository.findAll();
    return warehouses.map((w) => this.toWarehouseResponse(w));
  }

  async search(
    queryParams: Record<string, unknown>,
  ): Promise<{ data: WarehouseResponse[]; meta: PaginationMeta }> {
    const parsed = QueryParser.parse(queryParams, warehouseQueryConfig);
    const mongoQuery = QueryBuilder.build(parsed, warehouseQueryConfig);
    const pagination = parsePagination({ page: parsed.page, limit: parsed.limit });

    const [warehouses, total] = await Promise.all([
      this.repository.search(mongoQuery),
      this.repository.countSearch(mongoQuery),
    ]);

    return {
      data: warehouses.map((w) => this.toWarehouseResponse(w)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<WarehouseResponse> {
    const warehouse = await this.repository.findById(id);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    return this.toWarehouseResponse(warehouse);
  }

  async update(id: string, dto: UpdateWarehouseDTO, userId: string): Promise<WarehouseResponse> {
    const warehouse = await this.repository.findById(id);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    if (dto.code) {
      const existing = await this.repository.findByCodeExcludingId(dto.code, id);

      if (existing) {
        throw new ConflictError('A warehouse with this code already exists');
      }
    }

    const updated = await this.repository.update(id, {
      ...dto,
      code: dto.code?.toUpperCase(),
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Warehouse not found');
    }

    return this.toWarehouseResponse(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const warehouse = await this.repository.findById(id);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    await this.repository.softDelete(id, userId);
  }

  private toWarehouseResponse(warehouse: IWarehouse): WarehouseResponse {
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
