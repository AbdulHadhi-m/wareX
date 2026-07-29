import { Router } from 'express';
import { AisleController } from './aisle.controller';
import { AisleService } from './aisle.service';
import { AisleRepository } from './aisle.repository';
import { ZoneRepository } from '../zone/zone.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import {
  createAisleSchema,
  updateAisleSchema,
  aisleIdSchema,
  zoneIdParamSchema,
} from './aisle.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const aisleRepository = new AisleRepository();
const zoneRepository = new ZoneRepository();
const service = new AisleService(aisleRepository, zoneRepository);
const controller = new AisleController(service);

const aisleRouter = Router();
aisleRouter.use(authenticate);

aisleRouter.post('/', authorize('aisle.create'), validate(createAisleSchema), controller.create);
aisleRouter.get('/', controller.findAll);
aisleRouter.get('/:id', validate(aisleIdSchema, ValidationSource.PARAMS), controller.findById);
aisleRouter.patch('/:id', authorize('aisle.update'), validate(aisleIdSchema, ValidationSource.PARAMS), validate(updateAisleSchema), controller.update);
aisleRouter.delete('/:id', authorize('aisle.delete'), controller.delete);

const zoneAisleRouter = Router();
zoneAisleRouter.use(authenticate);
zoneAisleRouter.get('/:zoneId/aisles', validate(zoneIdParamSchema, ValidationSource.PARAMS), controller.findByZone);

export { aisleRouter, zoneAisleRouter };
