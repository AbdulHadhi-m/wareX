import mongoose from 'mongoose';
import { IPickList } from './pickList.types';
export type PickListDocument = mongoose.Document & IPickList;
export declare const PickListModel: mongoose.Model<PickListDocument, {}, {}, {}, mongoose.Document<unknown, {}, PickListDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IPickList & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, PickListDocument>;
//# sourceMappingURL=pickList.model.d.ts.map