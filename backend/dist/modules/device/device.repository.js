"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceRepository = void 0;
const device_model_1 = require("./device.model");
class DeviceRepository {
    baseFilter() {
        return { isDeleted: { $ne: true } };
    }
    async findById(id) {
        return device_model_1.DeviceModel.findById(id).where('isDeleted').ne(true).lean();
    }
    async findBySerialNumber(serialNumber) {
        return device_model_1.DeviceModel.findOne({ serialNumber, ...this.baseFilter() }).lean();
    }
    async findByImei(imei) {
        return device_model_1.DeviceModel.findOne({ imei, ...this.baseFilter() }).lean();
    }
    async search(filter, skip, limit, sort) {
        return device_model_1.DeviceModel.find(filter).sort(sort).skip(skip).limit(limit).lean();
    }
    async count(filter) {
        return device_model_1.DeviceModel.countDocuments(filter);
    }
    async create(data) {
        const device = await device_model_1.DeviceModel.create(data);
        const obj = device.toObject();
        return obj;
    }
    async update(id, data) {
        return device_model_1.DeviceModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .where('isDeleted').ne(true).lean();
    }
    async softDelete(id, updatedBy) {
        return device_model_1.DeviceModel.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
                deletedAt: new Date(),
                updatedBy,
            },
        }, { new: true }).where('isDeleted').ne(true).lean();
    }
}
exports.DeviceRepository = DeviceRepository;
//# sourceMappingURL=device.repository.js.map