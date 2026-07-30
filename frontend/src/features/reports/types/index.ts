export interface FacilitiesSummary {
  totalWarehouses: number;
  totalZones: number;
  totalAisles: number;
  totalBins: number;
  totalDevices: number;
}

export interface InventoryStatusSummary {
  available: number;
  reserved: number;
  picked: number;
  damaged: number;
  returned: number;
}

export interface OrderStatusSummary {
  draft: number;
  pending: number;
  picking: number;
  ready: number;
  fulfilled: number;
  cancelled: number;
}

export interface PickListStatusSummary {
  draft?: number;
  assigned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface DashboardData {
  facilities: FacilitiesSummary;
  inventorySummary: InventoryStatusSummary;
  orderSummary: OrderStatusSummary;
  pickListSummary: PickListStatusSummary;
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

export interface PickListPerformanceItem {
  pickListId: string;
  pickListNumber: string;
  workerId?: string;
  workerName?: string;
  status: string;
  priority: string;
  deviceCount: number;
  startedAt?: string;
  completedAt?: string;
  durationMinutes?: number;
  createdBy: string;
  createdAt: string;
}

export interface PickListPerformanceSummary {
  totalPickLists: number;
  completedPickLists: number;
  averageDurationMinutes: number;
  fastestDurationMinutes: number | null;
  slowestDurationMinutes: number | null;
}

export interface InventoryReportItem {
  deviceId: string;
  deviceName: string;
  brand: string;
  model: string;
  serialNumber: string;
  sku?: string;
  category: string;
  status: string;
  condition: string;
  warehouseName?: string;
  zoneName?: string;
  aisleName?: string;
  binCode?: string;
  warehouseId?: string;
  zoneId?: string;
  aisleId?: string;
  binId?: string;
  createdAt: string;
}

export interface ReportFilters {
  warehouseId?: string;
  zoneId?: string;
  aisleId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
