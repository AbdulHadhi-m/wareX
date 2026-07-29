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

router.get('/', authorize('admin.user.read'), validate(userListQuerySchema), controller.list);
router.get('/:id', authorize('admin.user.read'), controller.getById);
router.post('/', authorize('admin.user.create'), validate(createUserSchema), controller.create);
router.patch('/:id', authorize('admin.user.update'), validate(updateUserSchema), controller.update);
router.delete('/:id', authorize('admin.user.delete'), controller.delete);

export { router as adminRouter };
