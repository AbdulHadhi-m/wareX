import mongoose from 'mongoose';
import { IAuditLog } from './auditLog.types';
export type AuditLogDocument = mongoose.Document & IAuditLog;
export declare const AuditLogModel: mongoose.Model<AuditLogDocument, {}, {}, {}, mongoose.Document<unknown, {}, AuditLogDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, AuditLogDocument>;
//# sourceMappingURL=auditLog.model.d.ts.map