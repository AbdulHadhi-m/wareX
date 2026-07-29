import { Router } from 'express';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { validate } from '../../shared/validation/validate';
import { createPermissionSchema, updatePermissionSchema } from './permission.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const repository = new PermissionRepository();
const service = new PermissionService(repository);
const controller = new PermissionController(service);

const router = Router();
router.use(authenticate);

router.get('/', controller.findAll);
router.get('/module/:module', controller.findByModule);
router.get('/:id', controller.findById);
router.post('/', authorize('permission.create'), validate(createPermissionSchema), controller.create);
router.patch('/:id', authorize('permission.update'), validate(updatePermissionSchema), controller.update);
router.delete('/:id', authorize('permission.delete'), controller.delete);

export { router as permissionRouter };
