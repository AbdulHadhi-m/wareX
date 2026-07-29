"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickListService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const validation_error_1 = require("../../shared/errors/validation-error");
const authorization_error_1 = require("../../shared/errors/authorization-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const auth_model_1 = require("../auth/auth.model");
const device_model_1 = require("../device/device.model");
const event_emitter_1 = require("../../shared/events/event-emitter");
const pickListQueryConfig = {
    searchableFields: ['pickListNumber'],
    filterableFields: ['status', 'workerId', 'priority'],
    dateRangeFields: ['createdAt'],
    sortableFields: ['createdAt', 'updatedAt', 'pickListNumber', 'status', 'priority'],
    defaultSort: { field: 'createdAt', order: 'desc' },
};
class PickListService {
    pickListRepository;
    constructor(pickListRepository) {
        this.pickListRepository = pickListRepository;
    }
    async create(dto, userId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            if (dto.workerId) {
                const worker = await auth_model_1.UserModel.findById(dto.workerId)
                    .populate('roleId')
                    .session(session)
                    .lean();
                if (!worker || !worker.roleId) {
                    throw new not_found_error_1.NotFoundError('Worker not found');
                }
                const workerRole = worker.roleId;
                if (workerRole.name !== 'Worker') {
                    throw new not_found_error_1.NotFoundError('Worker not found');
                }
            }
            const uniqueDeviceIds = [...new Set(dto.deviceIds)];
            const devices = await device_model_1.DeviceModel.find({
                _id: { $in: uniqueDeviceIds },
                isDeleted: { $ne: true },
            })
                .session(session)
                .lean();
            if (devices.length !== uniqueDeviceIds.length) {
                throw new not_found_error_1.NotFoundError('One or more devices not found');
            }
            for (const device of devices) {
                if (device.status !== 'Available') {
                    throw new conflict_error_1.ConflictError(`Device "${device.deviceName}" (${device.serialNumber}) is not available. Current status: ${device.status}`);
                }
            }
            for (const deviceId of uniqueDeviceIds) {
                const active = await this.pickListRepository.findActiveByDeviceId(deviceId, session);
                if (active) {
                    throw new conflict_error_1.ConflictError(`Device is already part of active pick list ${active.pickListNumber}`);
                }
            }
            const pickListNumber = await this.generatePickListNumber(session);
            const status = dto.workerId ? 'Assigned' : 'Draft';
            const pickList = await this.pickListRepository.create({
                pickListNumber,
                workerId: dto.workerId ?? null,
                deviceIds: uniqueDeviceIds,
                status,
                priority: dto.priority,
                notes: dto.notes ?? null,
                createdBy: userId,
                updatedBy: userId,
            }, session);
            await device_model_1.DeviceModel.updateMany({ _id: { $in: uniqueDeviceIds } }, { $set: { status: 'Reserved', updatedBy: userId } }, { session });
            await session.commitTransaction();
            return this.toPickListResponse(pickList);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async search(queryParams, userRole, userId) {
        if (userRole === 'Worker' && userId) {
            queryParams.workerId = userId;
        }
        const parsed = query_1.QueryParser.parse(queryParams, pickListQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, pickListQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [pickLists, total] = await Promise.all([
            this.pickListRepository.search(mongoQuery),
            this.pickListRepository.countSearch(mongoQuery),
        ]);
        return {
            data: pickLists.map((p) => this.toPickListResponse(p)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const pickList = await this.pickListRepository.findById(id);
        if (!pickList) {
            throw new not_found_error_1.NotFoundError('Pick list not found');
        }
        return this.toPickListResponse(pickList);
    }
    async getByWorker(workerId, pageInput) {
        const worker = await auth_model_1.UserModel.findById(workerId).populate('roleId').lean();
        if (!worker || !worker.roleId) {
            throw new not_found_error_1.NotFoundError('Worker not found');
        }
        const workerRole = worker.roleId;
        if (workerRole.name !== 'Worker') {
            throw new not_found_error_1.NotFoundError('Worker not found');
        }
        const pagination = (0, pagination_1.parsePagination)(pageInput);
        const mongoQuery = query_1.QueryBuilder.build({ search: undefined, filters: { workerId }, dateRange: undefined, sort: { field: 'createdAt', order: 'desc' }, page: pagination.page, limit: pagination.limit, skip: pagination.skip, fields: undefined }, pickListQueryConfig);
        const [pickLists, total] = await Promise.all([
            this.pickListRepository.search(mongoQuery),
            this.pickListRepository.countSearch(mongoQuery),
        ]);
        return {
            data: pickLists.map((p) => this.toPickListResponse(p)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async assign(id, dto, userId) {
        const pickList = await this.pickListRepository.findById(id);
        if (!pickList) {
            throw new not_found_error_1.NotFoundError('Pick list not found');
        }
        if (pickList.status === 'Completed' || pickList.status === 'Cancelled') {
            throw new validation_error_1.ValidationError('Cannot assign a completed or cancelled pick list');
        }
        const worker = await auth_model_1.UserModel.findById(dto.workerId).populate('roleId').lean();
        if (!worker || !worker.roleId) {
            throw new not_found_error_1.NotFoundError('Worker not found');
        }
        const workerRole = worker.roleId;
        if (workerRole.name !== 'Worker') {
            throw new not_found_error_1.NotFoundError('Worker not found');
        }
        const nextStatus = pickList.status === 'Draft' ? 'Assigned' : pickList.status;
        const updated = await this.pickListRepository.update(id, {
            workerId: dto.workerId,
            status: nextStatus,
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Pick list not found after update');
        }
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.PICK_LIST_ASSIGNED, {
            pickListId: id,
            pickListNumber: pickList.pickListNumber,
            workerId: dto.workerId,
            createdBy: pickList.createdBy,
        });
        return this.toPickListResponse(updated);
    }
    async start(id, userId) {
        const pickList = await this.pickListRepository.findById(id);
        if (!pickList) {
            throw new not_found_error_1.NotFoundError('Pick list not found');
        }
        if (pickList.status !== 'Assigned') {
            throw new validation_error_1.ValidationError('Only assigned pick lists can be started');
        }
        if (pickList.workerId !== userId) {
            throw new authorization_error_1.AuthorizationError('You are not the assigned worker for this pick list');
        }
        const updated = await this.pickListRepository.update(id, {
            status: 'In Progress',
            startedAt: new Date(),
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Pick list not found after update');
        }
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.PICK_LIST_STARTED, {
            pickListId: id,
            pickListNumber: pickList.pickListNumber,
            workerId: userId,
            workerName: '',
            createdBy: pickList.createdBy,
        });
        return this.toPickListResponse(updated);
    }
    async complete(id, userId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const pickList = await this.pickListRepository.findById(id);
            if (!pickList) {
                throw new not_found_error_1.NotFoundError('Pick list not found');
            }
            if (pickList.status !== 'In Progress') {
                throw new validation_error_1.ValidationError('Only in-progress pick lists can be completed');
            }
            if (pickList.workerId !== userId) {
                throw new authorization_error_1.AuthorizationError('You are not the assigned worker for this pick list');
            }
            const updated = await this.pickListRepository.update(id, {
                status: 'Completed',
                completedAt: new Date(),
                updatedBy: userId,
            }, session);
            if (!updated) {
                throw new not_found_error_1.NotFoundError('Pick list not found after update');
            }
            await device_model_1.DeviceModel.updateMany({ _id: { $in: pickList.deviceIds } }, { $set: { status: 'Picked', updatedBy: userId } }, { session });
            await session.commitTransaction();
            event_emitter_1.eventEmitter.emit(event_emitter_1.Events.PICK_LIST_COMPLETED, {
                pickListId: id,
                pickListNumber: pickList.pickListNumber,
                deviceIds: pickList.deviceIds,
                createdBy: pickList.createdBy,
                completedBy: userId,
            });
            return this.toPickListResponse(updated);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async cancel(id, userId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const pickList = await this.pickListRepository.findById(id);
            if (!pickList) {
                throw new not_found_error_1.NotFoundError('Pick list not found');
            }
            if (pickList.status === 'Completed' || pickList.status === 'Cancelled') {
                throw new validation_error_1.ValidationError('Cannot cancel a completed or already cancelled pick list');
            }
            const updated = await this.pickListRepository.update(id, {
                status: 'Cancelled',
                updatedBy: userId,
            }, session);
            if (!updated) {
                throw new not_found_error_1.NotFoundError('Pick list not found after update');
            }
            await device_model_1.DeviceModel.updateMany({ _id: { $in: pickList.deviceIds } }, { $set: { status: 'Available', updatedBy: userId } }, { session });
            await session.commitTransaction();
            event_emitter_1.eventEmitter.emit(event_emitter_1.Events.PICK_LIST_CANCELLED, {
                pickListId: id,
                pickListNumber: pickList.pickListNumber,
                deviceIds: pickList.deviceIds,
                createdBy: pickList.createdBy,
            });
            return this.toPickListResponse(updated);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async generatePickListNumber(session) {
        const last = await this.pickListRepository.findLastPickList(session);
        let nextNum = 1;
        if (last && last.pickListNumber) {
            const match = last.pickListNumber.match(/PL-(\d+)/);
            if (match) {
                nextNum = parseInt(match[1], 10) + 1;
            }
        }
        return `PL-${String(nextNum).padStart(5, '0')}`;
    }
    toPickListResponse(pickList) {
        return {
            id: pickList._id.toString(),
            pickListNumber: pickList.pickListNumber,
            workerId: pickList.workerId || undefined,
            deviceIds: pickList.deviceIds,
            status: pickList.status,
            priority: pickList.priority,
            notes: pickList.notes,
            createdBy: pickList.createdBy,
            updatedBy: pickList.updatedBy,
            startedAt: pickList.startedAt
                ? new Date(pickList.startedAt).toISOString()
                : undefined,
            completedAt: pickList.completedAt
                ? new Date(pickList.completedAt).toISOString()
                : undefined,
            createdAt: new Date(pickList.createdAt).toISOString(),
            updatedAt: new Date(pickList.updatedAt).toISOString(),
        };
    }
}
exports.PickListService = PickListService;
//# sourceMappingURL=pickList.service.js.map