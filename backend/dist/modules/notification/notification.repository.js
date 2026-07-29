"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notification_model_1 = require("./notification.model");
class NotificationRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findById(id) {
        return notification_model_1.NotificationModel.findById(id)
            .where('isDeleted')
            .ne(true)
            .lean();
    }
    async findByRecipient(recipientId, filter, skip, limit, sort) {
        return notification_model_1.NotificationModel.find({
            recipientId,
            ...this.baseFilter(),
            ...filter,
        })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    }
    async countByRecipient(recipientId, filter) {
        return notification_model_1.NotificationModel.countDocuments({
            recipientId,
            ...this.baseFilter(),
            ...filter,
        });
    }
    async countUnread(recipientId) {
        return notification_model_1.NotificationModel.countDocuments({
            recipientId,
            isRead: false,
            ...this.baseFilter(),
        });
    }
    async create(data) {
        const doc = await notification_model_1.NotificationModel.create(data);
        return doc.toObject();
    }
    async markAsRead(id) {
        return notification_model_1.NotificationModel.findByIdAndUpdate(id, {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        }, { new: true })
            .where('isDeleted')
            .ne(true)
            .lean();
    }
    async markAllAsRead(recipientId) {
        const result = await notification_model_1.NotificationModel.updateMany({
            recipientId,
            isRead: false,
            ...this.baseFilter(),
        }, {
            $set: {
                isRead: true,
                readAt: new Date(),
            },
        });
        return result.modifiedCount;
    }
    async softDelete(id) {
        return notification_model_1.NotificationModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        }, { new: true })
            .where('isDeleted')
            .ne(true)
            .lean();
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=notification.repository.js.map