"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.orderRouter = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const order_service_1 = require("./order.service");
const order_repository_1 = require("./order.repository");
const validate_1 = require("../../shared/validation/validate");
const order_validation_1 = require("./order.validation");
const auth_middleware_1 = require("../auth/auth.middleware");
const logger_1 = require("../../shared/logger/logger");
const event_emitter_1 = require("../../shared/events/event-emitter");
const orderRepository = new order_repository_1.OrderRepository();
const orderService = new order_service_1.OrderService(orderRepository);
exports.orderService = orderService;
const controller = new order_controller_1.OrderController(orderService);
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_COMPLETED, async ({ pickListId }) => {
    try {
        await orderService.onPickListCompleted(pickListId);
    }
    catch (error) {
        logger_1.logger.error({ err: error, pickListId }, 'Failed to update order on pick list completion');
    }
});
event_emitter_1.eventEmitter.on(event_emitter_1.Events.PICK_LIST_CANCELLED, async ({ pickListId }) => {
    try {
        await orderService.onPickListCancelled(pickListId);
    }
    catch (error) {
        logger_1.logger.error({ err: error, pickListId }, 'Failed to update order on pick list cancellation');
    }
});
const router = (0, express_1.Router)();
exports.orderRouter = router;
router.use(auth_middleware_1.authenticate);
router.post('/', (0, auth_middleware_1.authorize)('order.create'), (0, validate_1.validate)(order_validation_1.createOrderSchema), controller.create);
router.get('/', (0, auth_middleware_1.authorize)('order.read', 'pick-list.read'), (0, validate_1.validate)(order_validation_1.orderQuerySchema, validate_1.ValidationSource.QUERY), controller.findAll);
router.get('/:id', (0, auth_middleware_1.authorize)('order.read', 'pick-list.read'), (0, validate_1.validate)(order_validation_1.orderIdParamSchema, validate_1.ValidationSource.PARAMS), controller.findById);
router.patch('/:id', (0, auth_middleware_1.authorize)('order.update'), (0, validate_1.validate)(order_validation_1.orderIdParamSchema, validate_1.ValidationSource.PARAMS), (0, validate_1.validate)(order_validation_1.updateOrderSchema), controller.update);
router.patch('/:id/cancel', (0, auth_middleware_1.authorize)('order.cancel'), (0, validate_1.validate)(order_validation_1.orderIdParamSchema, validate_1.ValidationSource.PARAMS), controller.cancel);
router.post('/:id/generate-pick-list', (0, auth_middleware_1.authorize)('order.generate-pick-list'), (0, validate_1.validate)(order_validation_1.orderIdParamSchema, validate_1.ValidationSource.PARAMS), controller.generatePickList);
router.patch('/:id/fulfill', (0, auth_middleware_1.authorize)('order.fulfill'), (0, validate_1.validate)(order_validation_1.orderIdParamSchema, validate_1.ValidationSource.PARAMS), controller.fulfill);
//# sourceMappingURL=order.routes.js.map