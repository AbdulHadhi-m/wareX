export interface DashboardResponse {
    facilities: FacilitiesSummary;
    inventorySummary: InventoryStatusSummary;
    warehouseSummary: WarehouseDistribution;
    orderSummary: OrderStatusSummary;
    pickListSummary: PickListStatusSummary;
    notificationSummary: NotificationSummary;
}
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
export interface WarehouseDistribution {
    devicesPerWarehouse: DeviceCountByEntity[];
    devicesPerZone: DeviceCountByEntity[];
    devicesPerAisle: DeviceCountByEntity[];
    devicesPerBin: DeviceCountByEntity[];
}
export interface DeviceCountByEntity {
    id: string;
    name: string;
    code?: string;
    deviceCount: number;
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
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}
export interface NotificationSummary {
    total: number;
    unread: number;
}
export interface InventoryReportItem {
    deviceId: string;
    deviceName: string;
    brand: string;
    model: string;
    serialNumber: string;
    sku: string;
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
export interface InventoryReportResponse {
    data: InventoryReportItem[];
    total: number;
}
export interface WarehouseUtilizationReportItem {
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
export interface WarehouseUtilizationReportResponse {
    data: WarehouseUtilizationReportItem[];
}
export interface DeviceStatusReportItem {
    status: string;
    count: number;
    percentage: number;
}
export interface DeviceStatusReportResponse {
    data: DeviceStatusReportItem[];
    total: number;
}
export interface PickListPerformanceReportItem {
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
export interface PickListPerformanceReportResponse {
    data: PickListPerformanceReportItem[];
    summary: PickListPerformanceSummary;
}
export interface OrderStatusReportItem {
    status: string;
    count: number;
    percentage: number;
}
export interface OrderStatusReportResponse {
    data: OrderStatusReportItem[];
    total: number;
}
export interface ReportQueryParams {
    warehouseId?: string;
    zoneId?: string;
    aisleId?: string;
    binId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    workerId?: string;
}
//# sourceMappingURL=report.types.d.ts.map