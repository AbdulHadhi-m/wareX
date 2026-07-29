import { Router } from 'express';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { WarehouseRepository } from './warehouse.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import { createWarehouseSchema, updateWarehouseSchema, warehouseIdSchema } from './warehouse.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const router = Router();

const repository = new WarehouseRepository();
const service = new WarehouseService(repository);
const controller = new WarehouseController(service);

router.use(authenticate);

router.post('/', authorize('warehouse.create'), validate(createWarehouseSchema), controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.patch('/:id', authorize('warehouse.update'), validate(warehouseIdSchema, ValidationSource.PARAMS), validate(updateWarehouseSchema), controller.update);
router.delete('/:id', authorize('warehouse.delete'), controller.delete);

export { router as warehouseRouter };
