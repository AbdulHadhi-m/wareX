import mongoose from 'mongoose';
import { IRole } from './role.types';
export type RoleDocument = mongoose.Document & IRole;
export declare const RoleModel: mongoose.Model<RoleDocument, {}, {}, {}, mongoose.Document<unknown, {}, RoleDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IRole & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, RoleDocument>;
//# sourceMappingURL=role.model.d.ts.map