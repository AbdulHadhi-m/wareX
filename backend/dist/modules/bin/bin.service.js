"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinService = void 0;
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
class BinService {
    binRepository;
    aisleRepository;
    constructor(binRepository, aisleRepository) {
        this.binRepository = binRepository;
        this.aisleRepository = aisleRepository;
    }
    async create(dto, userId) {
        const aisle = await this.aisleRepository.findById(dto.aisleId);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        const existing = await this.binRepository.findByCodeInAisle(dto.code, dto.aisleId);
        if (existing) {
            throw new conflict_error_1.ConflictError('A bin with this code already exists in this aisle');
        }
        const bin = await this.binRepository.create({
            ...dto,
            code: dto.code.toUpperCase(),
            createdBy: userId,
            updatedBy: userId,
        });
        return this.toBinResponse(bin);
    }
    async findAll() {
        const bins = await this.binRepository.findAll();
        return bins.map((b) => this.toBinResponse(b));
    }
    async findById(id) {
        const bin = await this.binRepository.findById(id);
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        return this.toBinResponse(bin);
    }
    async findByAisleId(aisleId) {
        const aisle = await this.aisleRepository.findById(aisleId);
        if (!aisle) {
            throw new not_found_error_1.NotFoundError('Aisle not found');
        }
        const bins = await this.binRepository.findByAisleId(aisleId);
        return bins.map((b) => this.toBinResponse(b));
    }
    async update(id, dto, userId) {
        const bin = await this.binRepository.findById(id);
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        if (dto.code) {
            const existing = await this.binRepository.findByCodeInAisleExcludingId(dto.code, bin.aisleId, id);
            if (existing) {
                throw new conflict_error_1.ConflictError('A bin with this code already exists in this aisle');
            }
        }
        const updated = await this.binRepository.update(id, {
            ...dto,
            code: dto.code?.toUpperCase(),
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        return this.toBinResponse(updated);
    }
    async delete(id, userId) {
        const bin = await this.binRepository.findById(id);
        if (!bin) {
            throw new not_found_error_1.NotFoundError('Bin not found');
        }
        await this.binRepository.softDelete(id, userId);
    }
    toBinResponse(bin) {
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
exports.BinService = BinService;
//# sourceMappingURL=bin.service.js.map