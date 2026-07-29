import { Router } from 'express';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { validate } from '../../shared/validation/validate';
import { createUserSchema, updateUserSchema, userListQuerySchema } from './admin.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const repository = new AdminRepository();
const service = new AdminService(repository);
const controller = new AdminController(service);

const router = Router();
router.use(authenticate);
router.use(authorize('SuperAdmin'));

router.get('/', validate(userListQuerySchema), controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(createUserSchema), controller.create);
router.patch('/:id', validate(updateUserSchema), controller.update);
router.delete('/:id', controller.delete);

export { router as adminRouter };
