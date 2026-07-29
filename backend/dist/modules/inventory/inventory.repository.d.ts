import mongoose from 'mongoose';
import { IMovementHistory } from './inventory.types';
export declare class MovementHistoryRepository {
    create(data: Record<string, unknown>, session?: mongoose.ClientSession): Promise<IMovementHistory>;
    findByDeviceId(deviceId: string): Promise<IMovementHistory[]>;
    countByDeviceId(deviceId: string): Promise<number>;
}
//# sourceMappingURL=inventory.repository.d.ts.map