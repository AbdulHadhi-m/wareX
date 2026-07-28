import mongoose from 'mongoose';
import { IWarehouse } from './warehouse.types';
export type WarehouseDocument = mongoose.Document & IWarehouse;
export declare const WarehouseModel: mongoose.Model<WarehouseDocument, {}, {}, {}, mongoose.Document<unknown, {}, WarehouseDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IWarehouse & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, WarehouseDocument>;
//# sourceMappingURL=warehouse.model.d.ts.map