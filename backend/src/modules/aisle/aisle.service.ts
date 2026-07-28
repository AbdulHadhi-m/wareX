import { AisleRepository } from './aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import {
  CreateAisleDTO,
  UpdateAisleDTO,
  AisleResponse,
  IAisle,
} from './aisle.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { QueryParser, QueryBuilder } from '../../shared/query';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';

const aisleQueryConfig = {
  searchableFields: ['name', 'code'],
  filterableFields: ['zoneId', 'status'],
  sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
  defaultSort: { field: 'createdAt', order: 'desc' as const },
  baseFilter: { isDeleted: { $ne: true } },
};

export class AisleService {
  constructor(
    private readonly aisleRepository: AisleRepository,
    private readonly zoneRepository: ZoneRepository,
  ) {}

  async create(dto: CreateAisleDTO, userId: string): Promise<AisleResponse> {
    const zone = await this.zoneRepository.findById(dto.zoneId);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    const existing = await this.aisleRepository.findByCodeInZone(dto.code, dto.zoneId);

    if (existing) {
      throw new ConflictError('An aisle with this code already exists in this zone');
    }

    const aisle = await this.aisleRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toAisleResponse(aisle);
  }

  async findAll(): Promise<AisleResponse[]> {
    const aisles = await this.aisleRepository.findAll();
    return aisles.map((a) => this.toAisleResponse(a));
  }

  async search(
    queryParams: Record<string, unknown>,
  ): Promise<{ data: AisleResponse[]; meta: PaginationMeta }> {
    const parsed = QueryParser.parse(queryParams, aisleQueryConfig);
    const mongoQuery = QueryBuilder.build(parsed, aisleQueryConfig);
    const pagination = parsePagination({ page: parsed.page, limit: parsed.limit });

    const [aisles, total] = await Promise.all([
      this.aisleRepository.search(mongoQuery),
      this.aisleRepository.countSearch(mongoQuery),
    ]);

    return {
      data: aisles.map((a) => this.toAisleResponse(a)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<AisleResponse> {
    const aisle = await this.aisleRepository.findById(id);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    return this.toAisleResponse(aisle);
  }

  async findByZoneId(zoneId: string): Promise<AisleResponse[]> {
    const zone = await this.zoneRepository.findById(zoneId);

    if (!zone) {
      throw new NotFoundError('Zone not found');
    }

    const aisles = await this.aisleRepository.findByZoneId(zoneId);
    return aisles.map((a) => this.toAisleResponse(a));
  }

  async update(id: string, dto: UpdateAisleDTO, userId: string): Promise<AisleResponse> {
    const aisle = await this.aisleRepository.findById(id);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    if (dto.code) {
      const existing = await this.aisleRepository.findByCodeInZoneExcludingId(
        dto.code,
        aisle.zoneId,
        id,
      );

      if (existing) {
        throw new ConflictError('An aisle with this code already exists in this zone');
      }
    }

    const updated = await this.aisleRepository.update(id, {
      ...dto,
      code: dto.code?.toUpperCase(),
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Aisle not found');
    }

    return this.toAisleResponse(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const aisle = await this.aisleRepository.findById(id);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    await this.aisleRepository.softDelete(id, userId);
  }

  private toAisleResponse(aisle: IAisle): AisleResponse {
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
