"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickListRepository = void 0;
const pickList_model_1 = require("./pickList.model");
class PickListRepository {
    async findById(id) {
        return pickList_model_1.PickListModel.findById(id).lean();
    }
    async findByPickListNumber(number) {
        return pickList_model_1.PickListModel.findOne({ pickListNumber: number }).lean();
    }
    async search(query) {
        const projection = Object.keys(query.projection).length > 0 ? query.projection : undefined;
        let q = pickList_model_1.PickListModel.find(query.filter).sort(query.sort).skip(query.skip).limit(query.limit);
        if (projection) {
            q = q.select(projection);
        }
        return q.lean();
    }
    async countSearch(query) {
        return pickList_model_1.PickListModel.countDocuments(query.filter);
    }
    async create(data, session) {
        const [doc] = await pickList_model_1.PickListModel.create([data], { session });
        return doc.toObject();
    }
    async update(id, data, session) {
        return pickList_model_1.PickListModel.findByIdAndUpdate(id, { $set: data }, { new: true, session }).lean();
    }
    async findActiveByDeviceId(deviceId, session) {
        return pickList_model_1.PickListModel.findOne({
            deviceIds: deviceId,
            status: { $in: ['Draft', 'Assigned', 'In Progress'] },
        })
            .select('pickListNumber status')
            .session(session || null)
            .lean();
    }
    async findLastPickList(session) {
        return pickList_model_1.PickListModel.findOne({})
            .sort({ pickListNumber: -1 })
            .select('pickListNumber')
            .session(session || null)
            .lean();
    }
}
exports.PickListRepository = PickListRepository;
//# sourceMappingURL=pickList.repository.js.map