import { Router } from 'express';
import { BinController } from './bin.controller';
import { BinService } from './bin.service';
import { BinRepository } from './bin.repository';
import { AisleRepository } from '../aisle/aisle.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createBinSchema,
  updateBinSchema,
  binIdSchema,
  aisleIdParamSchema,
} from './bin.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const binRepository = new BinRepository();
const aisleRepository = new AisleRepository();
const service = new BinService(binRepository, aisleRepository);
const controller = new BinController(service);

const binRouter = Router();
binRouter.use(authenticate);

binRouter.post('/', authorize('bin.create'), validate(createBinSchema), controller.create);
binRouter.get('/', controller.findAll);
binRouter.get('/:id', validate(binIdSchema, ValidationSource.PARAMS), controller.findById);
binRouter.patch('/:id', authorize('bin.update'), validate(binIdSchema, ValidationSource.PARAMS), validate(updateBinSchema), controller.update);
binRouter.delete('/:id', authorize('bin.delete'), controller.delete);

const aisleBinRouter = Router();
aisleBinRouter.use(authenticate);
aisleBinRouter.get('/:aisleId/bins', validate(aisleIdParamSchema, ValidationSource.PARAMS), controller.findByAisle);

export { binRouter, aisleBinRouter };
