import mongoose from 'mongoose';
import { IOrder } from './order.types';
export type OrderDocument = mongoose.Document & IOrder;
export declare const OrderModel: mongoose.Model<OrderDocument, {}, {}, {}, mongoose.Document<unknown, {}, OrderDocument, {}, mongoose.DefaultSchemaOptions> & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId & string;
}> & {
    __v: number;
} & {
    id: string;
}, any, OrderDocument>;
//# sourceMappingURL=order.model.d.ts.map