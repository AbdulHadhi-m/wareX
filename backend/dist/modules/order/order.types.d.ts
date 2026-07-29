export type OrderStatus = 'Draft' | 'Pending' | 'Picking' | 'Ready' | 'Fulfilled' | 'Cancelled';
export type OrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export interface IOrder {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerReference?: string;
    deviceIds: string[];
    status: OrderStatus;
    priority: OrderPriority;
    notes?: string;
    pickListId?: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateOrderDTO {
    customerName: string;
    customerReference?: string;
    deviceIds: string[];
    priority: OrderPriority;
    notes?: string;
}
export interface UpdateOrderDTO {
    customerName?: string;
    customerReference?: string;
    deviceIds?: string[];
    priority?: OrderPriority;
    notes?: string;
}
export interface OrderResponse {
    id: string;
    orderNumber: string;
    customerName: string;
    customerReference?: string;
    deviceIds: string[];
    status: OrderStatus;
    priority: OrderPriority;
    notes?: string;
    pickListId?: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
export interface OrderSearchParams {
    status?: OrderStatus;
    customerName?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
//# sourceMappingURL=order.types.d.ts.map