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
import { eventEmitter, Events } from '../../shared/events/event-emitter';

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const controller = new OrderController(orderService);

eventEmitter.on(Events.PICK_LIST_COMPLETED, async ({ pickListId }: { pickListId: string }) => {
  try {
    await orderService.onPickListCompleted(pickListId);
  } catch (error) {
    console.error(`Failed to update order on pick list ${pickListId} completion:`, error);
  }
});

eventEmitter.on(Events.PICK_LIST_CANCELLED, async ({ pickListId }: { pickListId: string }) => {
  try {
    await orderService.onPickListCancelled(pickListId);
  } catch (error) {
    console.error(`Failed to update order on pick list ${pickListId} cancellation:`, error);
  }
});

const router = Router();
router.use(authenticate);

router.post('/', authorize('Manager'), validate(createOrderSchema), controller.create);

router.get('/', authorize('Manager', 'Worker'), validate(orderQuerySchema, ValidationSource.QUERY), controller.findAll);

router.get(
  '/:id',
  authorize('Manager', 'Worker'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.findById,
);

router.patch(
  '/:id',
  authorize('Manager'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  validate(updateOrderSchema),
  controller.update,
);

router.patch(
  '/:id/cancel',
  authorize('Manager'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.cancel,
);

router.post(
  '/:id/generate-pick-list',
  authorize('Manager'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.generatePickList,
);

router.patch(
  '/:id/fulfill',
  authorize('Manager'),
  validate(orderIdParamSchema, ValidationSource.PARAMS),
  controller.fulfill,
);

export { router as orderRouter, orderService };
