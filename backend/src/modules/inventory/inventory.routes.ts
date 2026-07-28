import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { MovementHistoryRepository } from './inventory.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  moveDeviceSchema,
  deviceIdParamSchema,
  binIdParamSchema,
  warehouseIdParamSchema,
  zoneIdParamSchema,
  aisleIdParamSchema,
} from './inventory.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const movementHistoryRepository = new MovementHistoryRepository();
const service = new InventoryService(movementHistoryRepository);
const controller = new InventoryController(service);

const router = Router();
router.use(authenticate);

router.post('/move', authorize('Manager'), validate(moveDeviceSchema), controller.move);

router.get(
  '/device/:deviceId',
  validate(deviceIdParamSchema, ValidationSource.PARAMS),
  controller.getDeviceLocation,
);

router.get(
  '/device/:deviceId/history',
  validate(deviceIdParamSchema, ValidationSource.PARAMS),
  controller.getDeviceHistory,
);

router.get(
  '/bin/:binId',
  validate(binIdParamSchema, ValidationSource.PARAMS),
  controller.getByBin,
);

router.get(
  '/warehouse/:warehouseId',
  validate(warehouseIdParamSchema, ValidationSource.PARAMS),
  controller.getByWarehouse,
);

router.get(
  '/zone/:zoneId',
  validate(zoneIdParamSchema, ValidationSource.PARAMS),
  controller.getByZone,
);

router.get(
  '/aisle/:aisleId',
  validate(aisleIdParamSchema, ValidationSource.PARAMS),
  controller.getByAisle,
);

router.get('/', controller.getAll);

export { router as inventoryRouter };
