export interface FacilitiesSummary {
  totalWarehouses: number;
  totalZones: number;
  totalAisles: number;
  totalBins: number;
  totalDevices: number;
}

export interface InventorySummary {
  available: number;
  reserved: number;
  picked: number;
  damaged: number;
  returned: number;
}

export interface OrderSummary {
  draft: number;
  pending: number;
  picking: number;
  ready: number;
  fulfilled: number;
  cancelled: number;
}

export interface PickListSummary {
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface DeviceCountByEntity {
  id: string;
  name: string;
  code: string;
  deviceCount: number;
}

export interface WarehouseSummary {
  devicesPerWarehouse: DeviceCountByEntity[];
  devicesPerZone: DeviceCountByEntity[];
  devicesPerAisle: DeviceCountByEntity[];
  devicesPerBin: DeviceCountByEntity[];
}

export interface NotificationSummary {
  total: number;
  unread: number;
}

export interface DashboardData {
  facilities: FacilitiesSummary;
  inventorySummary: InventorySummary;
  orderSummary: OrderSummary;
  pickListSummary: PickListSummary;
  warehouseSummary: WarehouseSummary;
  notificationSummary: NotificationSummary;
}

export interface DeviceStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface OrderStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface WarehouseUtilizationItem {
  warehouseId: string;
  warehouseName: string;
  warehouseCode: string;
  totalZones: number;
  totalAisles: number;
  totalBins: number;
  usedBins: number;
  availableBins: number;
  fullBins: number;
  blockedBins: number;
  totalCapacity: number;
  usedCapacity: number;
  utilizationPercentage: number;
  deviceCount: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface PickListItem {
  id: string;
  pickListNumber: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}
