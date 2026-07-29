"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const not_found_error_1 = require("../../shared/errors/not-found-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const validation_error_1 = require("../../shared/errors/validation-error");
const query_1 = require("../../shared/query");
const pagination_1 = require("../../shared/utils/pagination");
const event_emitter_1 = require("../../shared/events/event-emitter");
const device_model_1 = require("../device/device.model");
const pickList_model_1 = require("../pick-list/pickList.model");
const order_model_1 = require("./order.model");
const orderQueryConfig = {
    searchableFields: ['orderNumber', 'customerName'],
    filterableFields: ['status', 'priority'],
    dateRangeFields: ['createdAt'],
    sortableFields: ['createdAt', 'updatedAt', 'orderNumber', 'customerName', 'status', 'priority'],
    defaultSort: { field: 'createdAt', order: 'desc' },
};
class OrderService {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async create(dto, userId) {
        const uniqueDeviceIds = [...new Set(dto.deviceIds)];
        const devices = await device_model_1.DeviceModel.find({
            _id: { $in: uniqueDeviceIds },
            isDeleted: { $ne: true },
        }).lean();
        if (devices.length !== uniqueDeviceIds.length) {
            throw new not_found_error_1.NotFoundError('One or more devices not found');
        }
        for (const device of devices) {
            if (device.status !== 'Available') {
                throw new conflict_error_1.ConflictError(`Device "${device.deviceName}" (${device.serialNumber}) is not available. Current status: ${device.status}`);
            }
        }
        for (const deviceId of uniqueDeviceIds) {
            const active = await this.orderRepository.findActiveByDeviceId(deviceId);
            if (active) {
                throw new conflict_error_1.ConflictError(`Device is already part of active order ${active.orderNumber}`);
            }
        }
        const orderNumber = await this.generateOrderNumber();
        const order = await this.orderRepository.create({
            orderNumber,
            customerName: dto.customerName,
            customerReference: dto.customerReference ?? null,
            deviceIds: uniqueDeviceIds,
            status: 'Draft',
            priority: dto.priority,
            notes: dto.notes ?? null,
            createdBy: userId,
            updatedBy: userId,
        });
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.ORDER_CREATED, {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            createdBy: userId,
        });
        return this.toOrderResponse(order);
    }
    async search(queryParams) {
        const parsed = query_1.QueryParser.parse(queryParams, orderQueryConfig);
        const mongoQuery = query_1.QueryBuilder.build(parsed, orderQueryConfig);
        const pagination = (0, pagination_1.parsePagination)({ page: parsed.page, limit: parsed.limit });
        const [orders, total] = await Promise.all([
            this.orderRepository.search(mongoQuery),
            this.orderRepository.countSearch(mongoQuery),
        ]);
        return {
            data: orders.map((o) => this.toOrderResponse(o)),
            meta: (0, pagination_1.buildPaginationMeta)(total, pagination),
        };
    }
    async findById(id) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new not_found_error_1.NotFoundError('Order not found');
        }
        return this.toOrderResponse(order);
    }
    async update(id, dto, userId) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new not_found_error_1.NotFoundError('Order not found');
        }
        if (order.status === 'Cancelled' || order.status === 'Fulfilled') {
            throw new validation_error_1.ValidationError('Cannot update a cancelled or fulfilled order');
        }
        const updateData = {
            updatedBy: userId,
        };
        if (dto.customerName !== undefined) {
            updateData.customerName = dto.customerName;
        }
        if (dto.customerReference !== undefined) {
            updateData.customerReference = dto.customerReference;
        }
        if (dto.priority !== undefined) {
            updateData.priority = dto.priority;
        }
        if (dto.notes !== undefined) {
            updateData.notes = dto.notes;
        }
        if (dto.deviceIds !== undefined) {
            const uniqueDeviceIds = [...new Set(dto.deviceIds)];
            const devices = await device_model_1.DeviceModel.find({
                _id: { $in: uniqueDeviceIds },
                isDeleted: { $ne: true },
            }).lean();
            if (devices.length !== uniqueDeviceIds.length) {
                throw new not_found_error_1.NotFoundError('One or more devices not found');
            }
            for (const device of devices) {
                if (device.status !== 'Available') {
                    throw new conflict_error_1.ConflictError(`Device "${device.deviceName}" (${device.serialNumber}) is not available`);
                }
            }
            for (const deviceId of uniqueDeviceIds) {
                const active = await this.orderRepository.findActiveByDeviceId(deviceId, id);
                if (active) {
                    throw new conflict_error_1.ConflictError(`Device is already part of active order ${active.orderNumber}`);
                }
            }
            updateData.deviceIds = uniqueDeviceIds;
        }
        if (order.status === 'Draft') {
            updateData.status = 'Pending';
        }
        const updated = await this.orderRepository.update(id, updateData);
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Order not found after update');
        }
        return this.toOrderResponse(updated);
    }
    async cancel(id, userId) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new not_found_error_1.NotFoundError('Order not found');
        }
        if (order.status === 'Fulfilled') {
            throw new validation_error_1.ValidationError('Cannot cancel a fulfilled order');
        }
        if (order.status === 'Cancelled') {
            throw new validation_error_1.ValidationError('Order is already cancelled');
        }
        const updateData = {
            status: 'Cancelled',
            updatedBy: userId,
        };
        if (order.pickListId) {
            const pickList = await pickList_model_1.PickListModel.findById(order.pickListId).lean();
            if (pickList && pickList.status !== 'Completed' && pickList.status !== 'Cancelled') {
                throw new validation_error_1.ValidationError('Cancel the linked pick list first before cancelling this order');
            }
        }
        const updated = await this.orderRepository.update(id, updateData);
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Order not found after update');
        }
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.ORDER_CANCELLED, {
            orderId: id,
            orderNumber: order.orderNumber,
            createdBy: order.createdBy,
        });
        return this.toOrderResponse(updated);
    }
    async generatePickList(orderId, userId) {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const order = await order_model_1.OrderModel.findById(orderId).session(session).lean();
            if (!order) {
                throw new not_found_error_1.NotFoundError('Order not found');
            }
            if (order.status !== 'Draft' && order.status !== 'Pending') {
                throw new validation_error_1.ValidationError(`Cannot generate pick list for order with status "${order.status}". Order must be Draft or Pending.`);
            }
            if (order.pickListId) {
                throw new conflict_error_1.ConflictError('Pick list already generated for this order');
            }
            const devices = await device_model_1.DeviceModel.find({
                _id: { $in: order.deviceIds },
                isDeleted: { $ne: true },
            }).session(session).lean();
            if (devices.length !== order.deviceIds.length) {
                throw new not_found_error_1.NotFoundError('One or more devices not found');
            }
            for (const device of devices) {
                if (device.status !== 'Available') {
                    throw new conflict_error_1.ConflictError(`Device "${device.deviceName}" (${device.serialNumber}) is no longer available`);
                }
            }
            const pickListNumber = await this.generatePickListNumber(session);
            const [pickList] = await pickList_model_1.PickListModel.create([{
                    pickListNumber,
                    workerId: null,
                    deviceIds: order.deviceIds,
                    status: 'Draft',
                    priority: order.priority,
                    notes: `Auto-generated from Order ${order.orderNumber}`,
                    createdBy: userId,
                    updatedBy: userId,
                }], { session });
            await device_model_1.DeviceModel.updateMany({ _id: { $in: order.deviceIds } }, { $set: { status: 'Reserved', updatedBy: userId } }, { session });
            const updated = await order_model_1.OrderModel.findByIdAndUpdate(orderId, {
                $set: {
                    status: 'Picking',
                    pickListId: pickList._id.toString(),
                    updatedBy: userId,
                },
            }, { new: true, session }).lean();
            if (!updated) {
                throw new not_found_error_1.NotFoundError('Order not found after update');
            }
            await session.commitTransaction();
            return this.toOrderResponse(updated);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async fulfill(id, userId) {
        const order = await this.orderRepository.findById(id);
        if (!order) {
            throw new not_found_error_1.NotFoundError('Order not found');
        }
        if (order.status !== 'Ready') {
            throw new validation_error_1.ValidationError(`Cannot fulfill order with status "${order.status}". Order must be Ready.`);
        }
        const updated = await this.orderRepository.update(id, {
            status: 'Fulfilled',
            updatedBy: userId,
        });
        if (!updated) {
            throw new not_found_error_1.NotFoundError('Order not found after update');
        }
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.ORDER_FULFILLED, {
            orderId: id,
            orderNumber: order.orderNumber,
            createdBy: order.createdBy,
        });
        return this.toOrderResponse(updated);
    }
    async onPickListCompleted(pickListId) {
        const order = await this.orderRepository.findByPickListId(pickListId);
        if (!order) {
            return;
        }
        if (order.status !== 'Picking') {
            return;
        }
        await this.orderRepository.update(order._id.toString(), {
            status: 'Ready',
            updatedBy: 'system',
        });
    }
    async onPickListCancelled(pickListId) {
        const order = await this.orderRepository.findByPickListId(pickListId);
        if (!order) {
            return;
        }
        if (order.status !== 'Picking') {
            return;
        }
        await this.orderRepository.update(order._id.toString(), {
            status: 'Pending',
            updatedBy: 'system',
        });
    }
    async generateOrderNumber(session) {
        const last = await this.orderRepository.findLastOrder(session);
        let nextNum = 1;
        if (last && last.orderNumber) {
            const match = last.orderNumber.match(/ORD-(\d+)/);
            if (match) {
                nextNum = parseInt(match[1], 10) + 1;
            }
        }
        return `ORD-${String(nextNum).padStart(5, '0')}`;
    }
    async generatePickListNumber(session) {
        const last = await pickList_model_1.PickListModel.findOne({})
            .sort({ pickListNumber: -1 })
            .session(session || null)
            .lean();
        let nextNum = 1;
        if (last && last.pickListNumber) {
            const match = last.pickListNumber.match(/PL-(\d+)/);
            if (match) {
                nextNum = parseInt(match[1], 10) + 1;
            }
        }
        return `PL-${String(nextNum).padStart(5, '0')}`;
    }
    toOrderResponse(order) {
        return {
            id: order._id.toString(),
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerReference: order.customerReference || undefined,
            deviceIds: order.deviceIds,
            status: order.status,
            priority: order.priority,
            notes: order.notes,
            pickListId: order.pickListId || undefined,
            createdBy: order.createdBy,
            updatedBy: order.updatedBy,
            createdAt: new Date(order.createdAt).toISOString(),
            updatedAt: new Date(order.updatedAt).toISOString(),
        };
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map