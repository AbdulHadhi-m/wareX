import mongoose from 'mongoose';
import { IPickList } from './pickList.types';
import { type MongoQuery } from '../../shared/query';
export declare class PickListRepository {
    findById(id: string): Promise<IPickList | null>;
    findByPickListNumber(number: string): Promise<IPickList | null>;
    search(query: MongoQuery): Promise<IPickList[]>;
    countSearch(query: MongoQuery): Promise<number>;
    create(data: Record<string, unknown>, session?: mongoose.ClientSession): Promise<IPickList>;
    update(id: string, data: Record<string, unknown>, session?: mongoose.ClientSession): Promise<IPickList | null>;
    findActiveByDeviceId(deviceId: string, session?: mongoose.ClientSession): Promise<IPickList | null>;
    findLastPickList(session?: mongoose.ClientSession): Promise<IPickList | null>;
}
//# sourceMappingURL=pickList.repository.d.ts.map