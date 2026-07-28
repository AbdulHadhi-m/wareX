import { NotificationModel } from './notification.model';
import { INotification } from './notification.types';

export class NotificationRepository {
  private baseFilter() {
    return { isDeleted: { $ne: true } };
  }

  async findById(id: string): Promise<INotification | null> {
    return NotificationModel.findById(id)
      .where('isDeleted')
      .ne(true)
      .lean();
  }

  async findByRecipient(
    recipientId: string,
    filter: Record<string, unknown>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1>,
  ): Promise<INotification[]> {
    return NotificationModel.find({
      recipientId,
      ...this.baseFilter(),
      ...filter,
    } as any)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countByRecipient(recipientId: string, filter: Record<string, unknown>): Promise<number> {
    return NotificationModel.countDocuments({
      recipientId,
      ...this.baseFilter(),
      ...filter,
    } as any);
  }

  async countUnread(recipientId: string): Promise<number> {
    return NotificationModel.countDocuments({
      recipientId,
      isRead: false,
      ...this.baseFilter(),
    } as any);
  }

  async create(
    data: Record<string, unknown>,
  ): Promise<INotification> {
    const doc = await NotificationModel.create(data);
    return doc.toObject();
  }

  async markAsRead(
    id: string,
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      { new: true },
    )
      .where('isDeleted')
      .ne(true)
      .lean();
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        recipientId,
        isRead: false,
        ...this.baseFilter(),
      } as any,
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    return result.modifiedCount;
  }

  async softDelete(
    id: string,
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    )
      .where('isDeleted')
      .ne(true)
      .lean();
  }
}
