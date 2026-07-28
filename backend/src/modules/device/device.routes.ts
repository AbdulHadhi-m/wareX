import { Router } from 'express';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { DeviceRepository } from './device.repository';
import { BinRepository } from '../bin/bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import { createDeviceSchema, updateDeviceSchema, deviceIdSchema } from './device.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const deviceRepository = new DeviceRepository();
const binRepository = new BinRepository();
const aisleRepository = new AisleRepository();
const zoneRepository = new ZoneRepository();
const warehouseRepository = new WarehouseRepository();
const service = new DeviceService(
  deviceRepository,
  binRepository,
  aisleRepository,
  zoneRepository,
  warehouseRepository,
);
const controller = new DeviceController(service);

const router = Router();
router.use(authenticate);

router.post('/', authorize('Manager'), validate(createDeviceSchema), controller.create);
router.get('/', controller.findAll);
router.get('/:id', validate(deviceIdSchema, ValidationSource.PARAMS), controller.findById);
router.patch('/:id', authorize('Manager'), validate(deviceIdSchema, ValidationSource.PARAMS), validate(updateDeviceSchema), controller.update);
router.delete('/:id', authorize('Manager'), controller.delete);

export { router as deviceRouter };
