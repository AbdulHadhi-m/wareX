import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { DatabaseNotificationProvider } from './providers/database.provider';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createNotificationSchema,
  notificationIdParamSchema,
  notificationQuerySchema,
} from './notification.validation';
import { authenticate, authorize } from '../auth/auth.middleware';
import { eventEmitter, Events } from '../../shared/events/event-emitter';
import { UserModel } from '../auth/auth.model';
import { NotificationType, NotificationPriority } from './notification.types';

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

notificationService.registerProvider(new DatabaseNotificationProvider(notificationRepository));

const controller = new NotificationController(notificationService);

eventEmitter.on(Events.ORDER_CREATED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.createdBy as string,
      title: 'Order Created',
      message: `Order ${data.orderNumber} has been created for ${data.customerName}.`,
      type: 'Order Created' as NotificationType,
      priority: 'Medium' as NotificationPriority,
      relatedModule: 'Order',
      relatedResourceId: data.orderId as string,
    });
  } catch (error) {
    console.error('Failed to create order notification:', error);
  }
});

eventEmitter.on(Events.ORDER_CANCELLED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.createdBy as string,
      title: 'Order Cancelled',
      message: `Order ${data.orderNumber} has been cancelled.`,
      type: 'Order Cancelled' as NotificationType,
      priority: 'High' as NotificationPriority,
      relatedModule: 'Order',
      relatedResourceId: data.orderId as string,
    });
  } catch (error) {
    console.error('Failed to create order cancelled notification:', error);
  }
});

eventEmitter.on(Events.ORDER_FULFILLED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.createdBy as string,
      title: 'Order Fulfilled',
      message: `Order ${data.orderNumber} has been fulfilled.`,
      type: 'Order Fulfilled' as NotificationType,
      priority: 'Medium' as NotificationPriority,
      relatedModule: 'Order',
      relatedResourceId: data.orderId as string,
    });
  } catch (error) {
    console.error('Failed to create order fulfilled notification:', error);
  }
});

eventEmitter.on(Events.PICK_LIST_ASSIGNED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.workerId as string,
      title: 'Pick List Assigned',
      message: `Pick list ${data.pickListNumber} has been assigned to you.`,
      type: 'Pick List Assigned' as NotificationType,
      priority: 'High' as NotificationPriority,
      relatedModule: 'PickList',
      relatedResourceId: data.pickListId as string,
    });
  } catch (error) {
    console.error('Failed to create pick list assigned notification:', error);
  }
});

eventEmitter.on(Events.PICK_LIST_STARTED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.createdBy as string,
      title: 'Pick List Started',
      message: `Pick list ${data.pickListNumber} has been started by ${data.workerName}.`,
      type: 'Pick List Started' as NotificationType,
      priority: 'Medium' as NotificationPriority,
      relatedModule: 'PickList',
      relatedResourceId: data.pickListId as string,
    });
  } catch (error) {
    console.error('Failed to create pick list started notification:', error);
  }
});

eventEmitter.on(Events.PICK_LIST_COMPLETED, async (data: Record<string, unknown>) => {
  try {
    const worker = await UserModel.findById(data.completedBy as string).select('name').lean();

    const notificationData = {
      recipientId: data.createdBy as string,
      title: 'Pick List Completed',
      message: `Pick list ${data.pickListNumber} has been completed${worker ? ` by ${worker.name}` : ''}.`,
      type: 'Pick List Completed' as NotificationType,
      priority: 'Medium' as NotificationPriority,
      relatedModule: 'PickList',
      relatedResourceId: data.pickListId as string,
    };

    await notificationService.create(notificationData);
  } catch (error) {
    console.error('Failed to create pick list completed notification:', error);
  }
});

eventEmitter.on(Events.PICK_LIST_CANCELLED, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.createdBy as string,
      title: 'Pick List Cancelled',
      message: `Pick list ${data.pickListNumber} has been cancelled.`,
      type: 'Pick List Cancelled' as NotificationType,
      priority: 'High' as NotificationPriority,
      relatedModule: 'PickList',
      relatedResourceId: data.pickListId as string,
    });
  } catch (error) {
    console.error('Failed to create pick list cancelled notification:', error);
  }
});

eventEmitter.on(Events.DEVICE_MOVED, async (data: Record<string, unknown>) => {
  try {
    const managerIds = await UserModel.find({ role: 'Manager' }).select('_id').lean();
    const recipientIds = managerIds.map((m) => m._id.toString());

    for (const recipientId of recipientIds) {
      await notificationService.create({
        recipientId,
        title: 'Device Moved',
        message: `Device ${data.deviceName} (${data.serialNumber}) has been moved from ${data.fromBin} to ${data.toBin}.`,
        type: 'Device Moved' as NotificationType,
        priority: 'Low' as NotificationPriority,
        relatedModule: 'Inventory',
        relatedResourceId: data.deviceId as string,
      });
    }
  } catch (error) {
    console.error('Failed to create device moved notification:', error);
  }
});

eventEmitter.on(Events.AUTH_LOGIN, async (data: Record<string, unknown>) => {
  try {
    await notificationService.create({
      recipientId: data.userId as string,
      title: 'New Login',
      message: `New login detected on your account.`,
        type: 'System' as NotificationType,
      priority: 'Low',
      relatedModule: 'Authentication',
      relatedResourceId: data.userId as string,
    });
  } catch (error) {
    console.error('Failed to create login notification:', error);
  }
});

const router = Router();
router.use(authenticate);

router.post('/', authorize('Manager'), validate(createNotificationSchema), controller.create);

router.get(
  '/unread-count',
  controller.unreadCount,
);

router.patch(
  '/read-all',
  controller.markAllAsRead,
);

router.get(
  '/',
  validate(notificationQuerySchema, ValidationSource.QUERY),
  controller.findAll,
);

router.get(
  '/:id',
  validate(notificationIdParamSchema, ValidationSource.PARAMS),
  controller.findById,
);

router.patch(
  '/:id/read',
  validate(notificationIdParamSchema, ValidationSource.PARAMS),
  controller.markAsRead,
);

router.delete(
  '/:id',
  validate(notificationIdParamSchema, ValidationSource.PARAMS),
  controller.delete,
);

export { router as notificationRouter };
