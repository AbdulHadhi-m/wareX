"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const notification_controller_1 = require("./notification.controller");
const notification_service_1 = require("./notification.service");
const notification_repository_1 = require("./notification.repository");
const database_provider_1 = require("./providers/database.provider");
const validate_1 = require("../../shared/validation/validate");
const notification_validation_1 = require("./notification.validation");
const auth_middleware_1 = require("../auth/auth.middleware");
const logger_1 = require("../../shared/logger/logger");
const event_emitter_1 = require("../../shared/events/event-emitter");
const auth_model_1 = require("../auth/auth.model");
const notificationRepository = new notification_repository_1.NotificationRepository();
const notificationService = new notification_service_1.NotificationService(notificationRepository);
notificationService.registerProvider(new database_provider_1.DatabaseNotificationProvider(notificationRepository));
const controller = new notification_controller_1.NotificationController(notificationService);
event_emitter_1.eventEmitter.on(event_emitter_1.Events.ORDER_CREATED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.createdBy,
            title: 'Order Created',
            message: `Order ${data.orderNumber} has been created for ${data.customerName}.`,
            type: 'Order Created',
            priority: 'Medium',
            relatedModule: 'Order',
            relatedResourceId: data.orderId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'ORDER_CREATED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.ORDER_CANCELLED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.createdBy,
            title: 'Order Cancelled',
            message: `Order ${data.orderNumber} has been cancelled.`,
            type: 'Order Cancelled',
            priority: 'High',
            relatedModule: 'Order',
            relatedResourceId: data.orderId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'ORDER_CANCELLED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.ORDER_FULFILLED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.createdBy,
            title: 'Order Fulfilled',
            message: `Order ${data.orderNumber} has been fulfilled.`,
            type: 'Order Fulfilled',
            priority: 'Medium',
            relatedModule: 'Order',
            relatedResourceId: data.orderId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'ORDER_FULFILLED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_ASSIGNED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.workerId,
            title: 'Pick List Assigned',
            message: `Pick list ${data.pickListNumber} has been assigned to you.`,
            type: 'Pick List Assigned',
            priority: 'High',
            relatedModule: 'PickList',
            relatedResourceId: data.pickListId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'PICK_LIST_ASSIGNED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_STARTED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.createdBy,
            title: 'Pick List Started',
            message: `Pick list ${data.pickListNumber} has been started by ${data.workerName}.`,
            type: 'Pick List Started',
            priority: 'Medium',
            relatedModule: 'PickList',
            relatedResourceId: data.pickListId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'PICK_LIST_STARTED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_COMPLETED, async (data) => {
    try {
        const worker = await auth_model_1.UserModel.findById(data.completedBy).select('name').lean();
        const notificationData = {
            recipientId: data.createdBy,
            title: 'Pick List Completed',
            message: `Pick list ${data.pickListNumber} has been completed${worker ? ` by ${worker.name}` : ''}.`,
            type: 'Pick List Completed',
            priority: 'Medium',
            relatedModule: 'PickList',
            relatedResourceId: data.pickListId,
        };
        await notificationService.create(notificationData);
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'PICK_LIST_COMPLETED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_CANCELLED, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.createdBy,
            title: 'Pick List Cancelled',
            message: `Pick list ${data.pickListNumber} has been cancelled.`,
            type: 'Pick List Cancelled',
            priority: 'High',
            relatedModule: 'PickList',
            relatedResourceId: data.pickListId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'PICK_LIST_CANCELLED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.DEVICE_MOVED, async (data) => {
    try {
        const RoleModel = mongoose_1.default.model('Role');
        const managerRole = await RoleModel.findOne({ name: 'Manager' }).select('_id').lean();
        if (!managerRole) {
            logger_1.logger.warn('Manager role not found — skipping device moved notification');
            return;
        }
        const managerIds = await auth_model_1.UserModel.find({ roleId: managerRole._id.toString() }).select('_id').lean();
        const recipientIds = managerIds.map((m) => m._id.toString());
        for (const recipientId of recipientIds) {
            await notificationService.create({
                recipientId,
                title: 'Device Moved',
                message: `Device ${data.deviceName} (${data.serialNumber}) has been moved from ${data.fromBin} to ${data.toBin}.`,
                type: 'Device Moved',
                priority: 'Low',
                relatedModule: 'Inventory',
                relatedResourceId: data.deviceId,
            });
        }
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'DEVICE_MOVED' }, 'Failed to create notification');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.AUTH_LOGIN, async (data) => {
    try {
        await notificationService.create({
            recipientId: data.userId,
            title: 'New Login',
            message: `New login detected on your account.`,
            type: 'System',
            priority: 'Low',
            relatedModule: 'Authentication',
            relatedResourceId: data.userId,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error, type: 'AUTH_LOGIN' }, 'Failed to create notification');
    }
});
const router = (0, express_1.Router)();
exports.notificationRouter = router;
router.use(auth_middleware_1.authenticate);
router.post('/', (0, auth_middleware_1.authorize)('notification.create'), (0, validate_1.validate)(notification_validation_1.createNotificationSchema), controller.create);
router.get('/unread-count', controller.unreadCount);
router.patch('/read-all', controller.markAllAsRead);
router.get('/', (0, validate_1.validate)(notification_validation_1.notificationQuerySchema, validate_1.ValidationSource.QUERY), controller.findAll);
router.get('/:id', (0, validate_1.validate)(notification_validation_1.notificationIdParamSchema, validate_1.ValidationSource.PARAMS), controller.findById);
router.patch('/:id/read', (0, validate_1.validate)(notification_validation_1.notificationIdParamSchema, validate_1.ValidationSource.PARAMS), controller.markAsRead);
router.delete('/:id', (0, validate_1.validate)(notification_validation_1.notificationIdParamSchema, validate_1.ValidationSource.PARAMS), controller.delete);
//# sourceMappingURL=notification.routes.js.map