import mongoose from 'mongoose';
import { IDevice } from './device.types';
export type DeviceDocument = mongoose.Document & IDevice;
export declare const DeviceModel: mongoose.Model<DeviceDocument, {}, {}, {}, mongoose.Document<unknown, {}, DeviceDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IDevice & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, DeviceDocument>;
//# sourceMappingURL=device.model.d.ts.map