import mongoose from 'mongoose';
import { IZone } from './zone.types';
export type ZoneDocument = mongoose.Document & IZone;
export declare const ZoneModel: mongoose.Model<ZoneDocument, {}, {}, {}, mongoose.Document<unknown, {}, ZoneDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IZone & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, ZoneDocument>;
//# sourceMappingURL=zone.model.d.ts.map