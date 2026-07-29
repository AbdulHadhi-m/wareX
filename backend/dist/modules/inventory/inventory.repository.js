"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementHistoryRepository = void 0;
const inventory_model_1 = require("./inventory.model");
class MovementHistoryRepository {
    async create(data, session) {
        const [doc] = await inventory_model_1.MovementHistoryModel.create([data], { session });
        return doc.toObject();
    }
    async findByDeviceId(deviceId) {
        return inventory_model_1.MovementHistoryModel.find({ deviceId })
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean();
    }
    async countByDeviceId(deviceId) {
        return inventory_model_1.MovementHistoryModel.countDocuments({ deviceId });
    }
}
exports.MovementHistoryRepository = MovementHistoryRepository;
//# sourceMappingURL=inventory.repository.js.map