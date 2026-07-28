import { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { asyncHandler } from '../../shared/middleware/async-handler';
import { sendCreated, sendSuccess, sendNoContent } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.notificationService.create(req.body);
    sendCreated(res, result);
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = parsePagination(req.query);

    const result = await this.notificationService.findByRecipient(
      req.userId!,
      {
        isRead: req.query.isRead === 'true'
          ? true
          : req.query.isRead === 'false'
            ? false
            : undefined,
        type: req.query.type as string | undefined,
      },
      { page, limit },
    );

    sendSuccess(res, result.data, 200, result.meta);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.notificationService.findById(
      String(req.params.id),
      req.userId!,
    );
    sendSuccess(res, result);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.notificationService.markAsRead(
      String(req.params.id),
      req.userId!,
    );
    sendSuccess(res, result);
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const count = await this.notificationService.markAllAsRead(req.userId!);
    sendSuccess(res, { count });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await this.notificationService.delete(String(req.params.id), req.userId!);
    sendNoContent(res);
  });

  unreadCount = asyncHandler(async (req: Request, res: Response) => {
    const count = await this.notificationService.getUnreadCount(req.userId!);
    sendSuccess(res, { count });
  });
}
