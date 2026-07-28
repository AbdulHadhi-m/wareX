"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const deviceSchema = new mongoose_1.Schema({
    deviceName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    ...({ model: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        } }),
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    imei: {
        type: String,
        trim: true,
        sparse: true,
        unique: true,
        default: undefined,
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    sku: {
        type: String,
        required: true,
        trim: true,
    },
    binId: {
        type: String,
        required: true,
    },
    aisleId: {
        type: String,
        required: true,
    },
    zoneId: {
        type: String,
        required: true,
    },
    warehouseId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Reserved', 'Picked', 'Shipped', 'Damaged', 'Returned'],
        required: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Damaged'],
        required: true,
    },
    purchaseDate: {
        type: Date,
    },
    warrantyExpiry: {
        type: Date,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 2000,
    },
    createdBy: {
        type: String,
        required: true,
    },
    updatedBy: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    collection: 'devices',
});
deviceSchema.set('toJSON', {
    transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.isDeleted;
        delete ret.deletedAt;
        return ret;
    },
});
deviceSchema.index({ serialNumber: 1 }, { unique: true });
deviceSchema.index({ imei: 1 }, { sparse: true, unique: true });
deviceSchema.index({ binId: 1, isDeleted: 1 });
deviceSchema.index({ aisleId: 1, isDeleted: 1 });
deviceSchema.index({ zoneId: 1, isDeleted: 1 });
deviceSchema.index({ warehouseId: 1, isDeleted: 1 });
deviceSchema.index({ status: 1, isDeleted: 1 });
deviceSchema.index({ brand: 1, isDeleted: 1 });
deviceSchema.index({ category: 1, isDeleted: 1 });
deviceSchema.index({ deviceName: 'text', brand: 'text', model: 'text', serialNumber: 'text' });
exports.DeviceModel = mongoose_1.default.model('Device', deviceSchema);
//# sourceMappingURL=device.model.js.map