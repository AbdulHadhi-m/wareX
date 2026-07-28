import mongoose from 'mongoose';
import { IBin } from './bin.types';
export type BinDocument = mongoose.Document & IBin;
export declare const BinModel: mongoose.Model<BinDocument, {}, {}, {}, mongoose.Document<unknown, {}, BinDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IBin & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, BinDocument>;
//# sourceMappingURL=bin.model.d.ts.map