import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createOrderSchema,
  updateOrderSchema,
  orderIdParamSchema,
  orderQuerySchema,
} from './order.validation';
import { authenticate, authorize } from '../auth/auth.middleware';
import { logger } from '../../shared/logger/logger';
import { eventEmitter, Events } from '../../shared/events/event-emitter';

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const controller = new OrderController(orderService);

eventEmitter.on(Events.PICK_LIST_COMPLETED, async ({ pickListId }: { pickListId: string }) => {
  try {
    await orderService.onPickListCompleted(pickListId);
  } catch (error) {
    logger.error({ err: error, pickListId }, 'Failed to update order on pick list completion');
  }
});

eventEmitter.on(Events.PICK_LIST_CANCELLED, async ({ pickListId }: { pickListId: string }) => {
  try {
    await orderService.onPickListCancelled(pickListId);
  } catch (error) {
    logger.error({ err: error, pickListId }, 'Failed to update order on pick list cancellation');
  }
});

const router = Router();
router.use(authenticate);

router.post('/', authorize('order.create'), validate(createOrderSchema), controller.create);

router.get('/', authorize('order.read', 'pick-list.read'), validate(orderQuerySchema, ValidationSource.QUERY), controller.findAll);

router.get(
  '/:id',
  authorize('order.read', 'pick-list.read'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.findById,
);

router.patch(
  '/:id',
  authorize('order.update'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  validate(updateOrderSchema),
  controller.update,
);

router.patch(
  '/:id/cancel',
  authorize('order.cancel'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.cancel,
);

router.post(
  '/:id/generate-pick-list',
  authorize('order.generate-pick-list'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.generatePickList,
);

router.patch(
  '/:id/fulfill',
  authorize('order.fulfill'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.fulfill,
);

export { router as orderRouter, orderService };
