import mongoose from 'mongoose';
import { IMovementHistory } from './inventory.types';
export type MovementHistoryDocument = mongoose.Document & IMovementHistory;
export declare const MovementHistoryModel: mongoose.Model<MovementHistoryDocument, {}, {}, {}, mongoose.Document<unknown, {}, MovementHistoryDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IMovementHistory & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, MovementHistoryDocument>;
//# sourceMappingURL=inventory.model.d.ts.map