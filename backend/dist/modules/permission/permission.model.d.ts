import mongoose from 'mongoose';
import { IPermission } from './permission.types';
export type PermissionDocument = mongoose.Document & IPermission;
export declare const PermissionModel: mongoose.Model<PermissionDocument, {}, {}, {}, mongoose.Document<unknown, {}, PermissionDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IPermission & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, PermissionDocument>;
//# sourceMappingURL=permission.model.d.ts.map