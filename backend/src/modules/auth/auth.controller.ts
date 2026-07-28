import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess } from '../../shared/utils/api-response';
import { auditService } from '../audit-log/auditLog.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    sendCreated(res, result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    auditService.log({
      userId: result.user.id,
      userRole: result.user.role,
      module: 'Authentication',
      action: 'User Login',
      resourceType: 'User',
      resourceId: result.user.id,
      newData: { email: req.body.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string | undefined,
    });

    sendSuccess(res, result);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.authService.getProfile(req.userId!);
    sendSuccess(res, { user });
  });
}
