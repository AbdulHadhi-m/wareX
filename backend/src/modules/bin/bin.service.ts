import { BinRepository } from './bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import {
  CreateBinDTO,
  UpdateBinDTO,
  BinResponse,
  IBin,
} from './bin.types';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { QueryParser, QueryBuilder } from '../../shared/query';
import { parsePagination, buildPaginationMeta } from '../../shared/utils/pagination';
import { type PaginationMeta } from '../../shared/types/api-response';

const binQueryConfig = {
  searchableFields: ['name', 'code'],
  filterableFields: ['aisleId', 'status'],
  sortableFields: ['createdAt', 'updatedAt', 'name', 'status', 'code'],
  defaultSort: { field: 'createdAt', order: 'desc' as const },
  baseFilter: { isDeleted: { $ne: true } },
};

export class BinService {
  constructor(
    private readonly binRepository: BinRepository,
    private readonly aisleRepository: AisleRepository,
  ) {}

  async create(dto: CreateBinDTO, userId: string): Promise<BinResponse> {
    const aisle = await this.aisleRepository.findById(dto.aisleId);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    const existing = await this.binRepository.findByCodeInAisle(dto.code, dto.aisleId);

    if (existing) {
      throw new ConflictError('A bin with this code already exists in this aisle');
    }

    const bin = await this.binRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
      createdBy: userId,
      updatedBy: userId,
    });

    return this.toBinResponse(bin);
  }

  async findAll(): Promise<BinResponse[]> {
    const bins = await this.binRepository.findAll();
    return bins.map((b) => this.toBinResponse(b));
  }

  async search(
    queryParams: Record<string, unknown>,
  ): Promise<{ data: BinResponse[]; meta: PaginationMeta }> {
    const parsed = QueryParser.parse(queryParams, binQueryConfig);
    const mongoQuery = QueryBuilder.build(parsed, binQueryConfig);
    const pagination = parsePagination({ page: parsed.page, limit: parsed.limit });

    const [bins, total] = await Promise.all([
      this.binRepository.search(mongoQuery),
      this.binRepository.countSearch(mongoQuery),
    ]);

    return {
      data: bins.map((b) => this.toBinResponse(b)),
      meta: buildPaginationMeta(total, pagination),
    };
  }

  async findById(id: string): Promise<BinResponse> {
    const bin = await this.binRepository.findById(id);

    if (!bin) {
      throw new NotFoundError('Bin not found');
    }

    return this.toBinResponse(bin);
  }

  async findByAisleId(aisleId: string): Promise<BinResponse[]> {
    const aisle = await this.aisleRepository.findById(aisleId);

    if (!aisle) {
      throw new NotFoundError('Aisle not found');
    }

    const bins = await this.binRepository.findByAisleId(aisleId);
    return bins.map((b) => this.toBinResponse(b));
  }

  async update(id: string, dto: UpdateBinDTO, userId: string): Promise<BinResponse> {
    const bin = await this.binRepository.findById(id);

    if (!bin) {
      throw new NotFoundError('Bin not found');
    }

    if (dto.code) {
      const existing = await this.binRepository.findByCodeInAisleExcludingId(
        dto.code,
        bin.aisleId,
        id,
      );

      if (existing) {
        throw new ConflictError('A bin with this code already exists in this aisle');
      }
    }

    const updated = await this.binRepository.update(id, {
      ...dto,
      code: dto.code?.toUpperCase(),
      updatedBy: userId,
    });

    if (!updated) {
      throw new NotFoundError('Bin not found');
    }

    return this.toBinResponse(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const bin = await this.binRepository.findById(id);

    if (!bin) {
      throw new NotFoundError('Bin not found');
    }

    await this.binRepository.softDelete(id, userId);
  }

  private toBinResponse(bin: IBin): BinResponse {
    return {
      id: bin._id.toString(),
      aisleId: bin.aisleId,
      name: bin.name,
      code: bin.code,
      description: bin.description,
      capacity: bin.capacity,
      status: bin.status,
      createdBy: bin.createdBy,
      updatedBy: bin.updatedBy,
      createdAt: new Date(bin.createdAt).toISOString(),
      updatedAt: new Date(bin.updatedAt).toISOString(),
    };
  }
}
