import mongoose from 'mongoose';
import { IUser } from './auth.types';
export type UserDocument = mongoose.Document & IUser;
export declare const UserModel: mongoose.Model<UserDocument, {}, {}, {}, mongoose.Document<unknown, {}, UserDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, UserDocument>;
//# sourceMappingURL=auth.model.d.ts.map