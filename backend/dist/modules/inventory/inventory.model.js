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
exports.MovementHistoryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const movementHistorySchema = new mongoose_1.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true,
    },
    fromWarehouseId: {
        type: String,
        default: null,
    },
    fromZoneId: {
        type: String,
        default: null,
    },
    fromAisleId: {
        type: String,
        default: null,
    },
    fromBinId: {
        type: String,
        default: null,
    },
    toWarehouseId: {
        type: String,
        required: true,
    },
    toZoneId: {
        type: String,
        required: true,
    },
    toAisleId: {
        type: String,
        required: true,
    },
    toBinId: {
        type: String,
        required: true,
    },
    movementType: {
        type: String,
        enum: ['Initial Placement', 'Transfer', 'Return', 'Adjustment'],
        required: true,
    },
    reason: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    performedBy: {
        type: String,
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'movement_history',
});
movementHistorySchema.set('toJSON', {
    transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
movementHistorySchema.index({ deviceId: 1, createdAt: -1 });
movementHistorySchema.index({ toBinId: 1, createdAt: -1 });
movementHistorySchema.index({ toWarehouseId: 1, createdAt: -1 });
movementHistorySchema.index({ movementType: 1, createdAt: -1 });
movementHistorySchema.index({ performedBy: 1, createdAt: -1 });
movementHistorySchema.index({ toZoneId: 1, createdAt: -1 });
movementHistorySchema.index({ toAisleId: 1, createdAt: -1 });
movementHistorySchema.index({ movementType: 1 });
exports.MovementHistoryModel = mongoose_1.default.model('MovementHistory', movementHistorySchema);
//# sourceMappingURL=inventory.model.js.map