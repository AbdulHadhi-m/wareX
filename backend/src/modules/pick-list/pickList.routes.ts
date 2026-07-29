import { Router } from 'express';
import { PickListController } from './pickList.controller';
import { PickListService } from './pickList.service';
import { PickListRepository } from './pickList.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createPickListSchema,
  assignPickListSchema,
  pickListIdParamSchema,
  workerIdParamSchema,
  pickListQuerySchema,
} from './pickList.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const pickListRepository = new PickListRepository();
const service = new PickListService(pickListRepository);
const controller = new PickListController(service);

const router = Router();
router.use(authenticate);

router.post('/', authorize('pick-list.create'), validate(createPickListSchema), controller.create);

router.get('/', validate(pickListQuerySchema, ValidationSource.QUERY), controller.findAll);

router.get(
  '/worker/:workerId',
  validate(workerIdParamSchema, ValidationSource.PARAMS),
  controller.getByWorker,
);

router.get(
  '/:id',
  validate(pickListIdParamSchema, ValidationSource.PARAMS),
  controller.findById,
);

router.patch(
  '/:id/assign',
  authorize('pick-list.assign'),
  validate(pickListIdParamSchema, ValidationSource.PARAMS),
  validate(assignPickListSchema),
  controller.assign,
);

router.patch(
  '/:id/start',
  authorize('pick-list.start'),
  validate(pickListIdParamSchema, ValidationSource.PARAMS),
  controller.start,
);

router.patch(
  '/:id/complete',
  authorize('pick-list.complete'),
  validate(pickListIdParamSchema, ValidationSource.PARAMS),
  controller.complete,
);

router.patch(
  '/:id/cancel',
  authorize('pick-list.cancel'),
  validate(pickListIdParamSchema, ValidationSource.PARAMS),
  controller.cancel,
);

export { router as pickListRouter };
