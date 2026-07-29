import { Router } from 'express';
import { AuditLogController } from './auditLog.controller';
import { AuditLogService } from './auditLog.service';
import { AuditLogRepository } from './auditLog.repository';
import { validate, ValidationSource } from '../../shared/validation/validate';
import { auditLogQuerySchema } from './auditLog.validation';
import { authenticate, authorize } from '../auth/auth.middleware';

const auditLogRepository = new AuditLogRepository();
const auditLogService = new AuditLogService(auditLogRepository);
const controller = new AuditLogController(auditLogService);

const router = Router();
router.use(authenticate);
router.use(authorize('audit-log.read'));

router.get('/', validate(auditLogQuerySchema, ValidationSource.QUERY), controller.findAll);

router.get('/:id', controller.findById);

export { router as auditLogRouter };
