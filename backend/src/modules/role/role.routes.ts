import { Router } from 'express';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { validate } from '../../shared/validation/validate';
import { createRoleSchema, updateRoleSchema } from './role.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const repository = new RoleRepository();
const service = new RoleService(repository);
const controller = new RoleController(service);

const router = Router();
router.use(authenticate);

router.get('/', authorize('role.read'), controller.findAll);
router.get('/:id', authorize('role.read'), controller.findById);
router.post('/', authorize('role.create'), validate(createRoleSchema), controller.create);
router.patch('/:id', authorize('role.update'), validate(updateRoleSchema), controller.update);
router.delete('/:id', authorize('role.delete'), controller.delete);

export { router as roleRouter };
