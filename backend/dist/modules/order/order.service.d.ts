import { OrderRepository } from './order.repository';
import { CreateOrderDTO, UpdateOrderDTO, OrderResponse } from './order.types';
import { type PaginationMeta } from '../../shared/types/api-response';
export declare class OrderService {
    private readonly orderRepository;
    constructor(orderRepository: OrderRepository);
    create(dto: CreateOrderDTO, userId: string): Promise<OrderResponse>;
    search(queryParams: Record<string, unknown>): Promise<{
        data: OrderResponse[];
        meta: PaginationMeta;
    }>;
    findById(id: string): Promise<OrderResponse>;
    update(id: string, dto: UpdateOrderDTO, userId: string): Promise<OrderResponse>;
    cancel(id: string, userId: string): Promise<OrderResponse>;
    generatePickList(orderId: string, userId: string): Promise<OrderResponse>;
    fulfill(id: string, userId: string): Promise<OrderResponse>;
    onPickListCompleted(pickListId: string): Promise<void>;
    onPickListCancelled(pickListId: string): Promise<void>;
    private generateOrderNumber;
    private generatePickListNumber;
    private toOrderResponse;
}
//# sourceMappingURL=order.service.d.ts.map