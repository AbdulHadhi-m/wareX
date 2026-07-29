import mongoose from 'mongoose';
import { IOrder } from './order.types';
import { type MongoQuery } from '../../shared/query';
export declare class OrderRepository {
    findById(id: string): Promise<IOrder | null>;
    findByOrderNumber(number: string): Promise<IOrder | null>;
    findByPickListId(pickListId: string): Promise<IOrder | null>;
    search(query: MongoQuery): Promise<IOrder[]>;
    countSearch(query: MongoQuery): Promise<number>;
    create(data: Record<string, unknown>, session?: mongoose.ClientSession): Promise<IOrder>;
    update(id: string, data: Record<string, unknown>, session?: mongoose.ClientSession): Promise<IOrder | null>;
    findLastOrder(session?: mongoose.ClientSession): Promise<IOrder | null>;
    findActiveByDeviceId(deviceId: string, excludeOrderId?: string, session?: mongoose.ClientSession): Promise<IOrder | null>;
}
//# sourceMappingURL=order.repository.d.ts.map