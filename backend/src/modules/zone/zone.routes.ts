import { Router } from 'express';
import { ZoneController } from './zone.controller';
import { ZoneService } from './zone.service';
import { ZoneRepository } from './zone.repository';
import { WarehouseRepository } from '../warehouse/warehouse.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createZoneSchema,
  updateZoneSchema,
  zoneIdSchema,
  warehouseIdParamSchema,
} from './zone.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const zoneRepository = new ZoneRepository();
const warehouseRepository = new WarehouseRepository();
const service = new ZoneService(zoneRepository, warehouseRepository);
const controller = new ZoneController(service);

const zoneRouter = Router();
zoneRouter.use(authenticate);

zoneRouter.post('/', authorize('Manager'), validate(createZoneSchema), controller.create);
zoneRouter.get('/', controller.findAll);
zoneRouter.get('/:id', validate(zoneIdSchema, ValidationSource.PARAMS), controller.findById);
zoneRouter.patch('/:id', authorize('Manager'), validate(zoneIdSchema, ValidationSource.PARAMS), validate(updateZoneSchema), controller.update);
zoneRouter.delete('/:id', authorize('Manager'), controller.delete);

const warehouseZoneRouter = Router();
warehouseZoneRouter.use(authenticate);
warehouseZoneRouter.get('/:warehouseId/zones', validate(warehouseIdParamSchema, ValidationSource.PARAMS), controller.findByWarehouse);

export { zoneRouter, warehouseZoneRouter };
