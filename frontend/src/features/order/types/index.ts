export type OrderStatus = 'Draft' | 'Pending' | 'Picking' | 'Ready' | 'Fulfilled' | 'Cancelled';
export type OrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Order {
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

export interface CreateOrderData {
  customerName: string;
  customerReference?: string;
  deviceIds: string[];
  priority: OrderPriority;
  notes?: string;
}

export interface UpdateOrderData {
  customerName?: string;
  customerReference?: string;
  deviceIds?: string[];
  priority?: OrderPriority;
  notes?: string;
}

export interface OrderListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: OrderStatus;
  priority?: OrderPriority;
  createdAtGte?: string;
  createdAtLte?: string;
}
