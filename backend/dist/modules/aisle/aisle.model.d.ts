import mongoose from 'mongoose';
import { IAisle } from './aisle.types';
export type AisleDocument = mongoose.Document & IAisle;
export declare const AisleModel: mongoose.Model<AisleDocument, {}, {}, {}, mongoose.Document<unknown, {}, AisleDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IAisle & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, AisleDocument>;
//# sourceMappingURL=aisle.model.d.ts.map