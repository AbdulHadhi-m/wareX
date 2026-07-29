"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_model_1 = require("./order.model");
class OrderRepository {
    async findById(id) {
        return order_model_1.OrderModel.findById(id).lean();
    }
    async findByOrderNumber(number) {
        return order_model_1.OrderModel.findOne({ orderNumber: number }).lean();
    }
    async findByPickListId(pickListId) {
        return order_model_1.OrderModel.findOne({ pickListId }).lean();
    }
    async search(query) {
        const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
        let q = order_model_1.OrderModel.find(query.filter).sort(query.sort).skip(query.skip).limit(query.limit);
        if (projection) {
            q = q.select(projection);
        }
        return q.lean();
    }
    async countSearch(query) {
        return order_model_1.OrderModel.countDocuments(query.filter);
    }
    async create(data, session) {
        const [doc] = await order_model_1.OrderModel.create([data], { session });
        return doc.toObject();
    }
    async update(id, data, session) {
        return order_model_1.OrderModel.findByIdAndUpdate(id, { $set: data }, { new: true, session }).lean();
    }
    async findLastOrder(session) {
        return order_model_1.OrderModel.findOne({})
            .sort({ orderNumber: -1 })
            .select('orderNumber')
            .session(session || null)
            .lean();
    }
    async findActiveByDeviceId(deviceId, excludeOrderId, session) {
        const filter = {
            deviceIds: deviceId,
            status: { $in: ['Draft', 'Pending', 'Picking', 'Ready'] },
        };
        if (excludeOrderId) {
            filter._id = { $ne: excludeOrderId };
        }
        return order_model_1.OrderModel.findOne(filter)
            .select('orderNumber status')
            .session(session || null)
            .lean();
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map