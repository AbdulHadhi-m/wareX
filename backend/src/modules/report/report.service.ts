import { ReportRepository } from './report.repository';
import {
  DashboardResponse,
  FacilitiesSummary,
  InventoryStatusSummary,
  WarehouseDistribution,
  DeviceCountByEntity,
  OrderStatusSummary,
  PickListStatusSummary,
  InventoryReportResponse,
  WarehouseUtilizationReportResponse,
  DeviceStatusReportResponse,
  DeviceStatusReportItem,
  PickListPerformanceReportResponse,
  OrderStatusReportResponse,
  OrderStatusReportItem,
  ReportQueryParams,
} from './report.types';
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async getDashboard(userId: string): Promise<DashboardResponse> {
    const facilities = this.reportRepository.countFacilities();
    const inventorySummary = this.reportRepository.inventoryStatusSummary();
    const devicesPerWarehouse = this.reportRepository.devicesPerEntity(
      '$warehouseId',
      'warehouses',
    );
    const devicesPerZone = this.reportRepository.devicesPerEntity(
      '$zoneId',
      'zones',
    );
    const devicesPerAisle = this.reportRepository.devicesPerEntity(
      '$aisleId',
      'aisles',
    );
    const devicesPerBin = this.reportRepository.devicesPerEntity(
      '$binId',
      'bins',
    );
    const orderSummary = this.reportRepository.orderStatusSummary();
    const pickListSummary = this.reportRepository.pickListStatusSummary();
    const notificationSummary = this.reportRepository.notificationSummary(userId);

    const results = await Promise.all([
      facilities,
      inventorySummary,
      devicesPerWarehouse,
      devicesPerZone,
      devicesPerAisle,
      devicesPerBin,
      orderSummary,
      pickListSummary,
      notificationSummary,
    ]);

    const [
      facilitiesData,
      inventoryData,
      warehouseDevices,
      zoneDevices,
      aisleDevices,
      binDevices,
      orderData,
      pickListData,
      notificationData,
    ] = results;

    return {
      facilities: this.formatFacilities(facilitiesData),
      inventorySummary: this.formatInventorySummary(inventoryData),
      warehouseSummary: this.formatWarehouseDistribution(
        warehouseDevices as unknown as DeviceCountByEntity[],
        zoneDevices as unknown as DeviceCountByEntity[],
        aisleDevices as unknown as DeviceCountByEntity[],
        binDevices as unknown as DeviceCountByEntity[],
      ),
      orderSummary: this.formatOrderSummary(orderData),
      pickListSummary: this.formatPickListSummary(pickListData),
      notificationSummary: notificationData,
    };
  }

  async getInventoryReport(params: ReportQueryParams): Promise<InventoryReportResponse> {
    const result = await this.reportRepository.inventoryReport(params);

    return {
      data: result.data as unknown as InventoryReportResponse['data'],
      total: result.total,
    };
  }

  async getWarehouseUtilizationReport(): Promise<WarehouseUtilizationReportResponse> {
    const data = await this.reportRepository.warehouseUtilizationReport();
    return { data: data as unknown as WarehouseUtilizationReportResponse['data'] };
  }

  async getDeviceStatusReport(
    params: ReportQueryParams,
  ): Promise<DeviceStatusReportResponse> {
    const result = await this.reportRepository.deviceStatusReport(params);

    const total = result.total;

    const data: DeviceStatusReportItem[] = result.data.map((row) => ({
      status: row._id,
      count: row.count,
      percentage: total > 0 ? Math.round((row.count / total) * 10000) / 100 : 0,
    }));

    return { data, total };
  }

  async getPickListPerformanceReport(
    params: ReportQueryParams,
  ): Promise<PickListPerformanceReportResponse> {
    const result = await this.reportRepository.pickListPerformanceReport(params);
    return {
      data: result.data as unknown as PickListPerformanceReportResponse['data'],
      summary: result.summary,
    };
  }

  async getOrderStatusReport(
    params: ReportQueryParams,
  ): Promise<OrderStatusReportResponse> {
    const result = await this.reportRepository.orderStatusReport(params);

    const total = result.total;

    const data: OrderStatusReportItem[] = result.data.map((row) => ({
      status: row._id,
      count: row.count,
      percentage: total > 0 ? Math.round((row.count / total) * 10000) / 100 : 0,
    }));

    return { data, total };
  }

  private formatFacilities(raw: FacilitiesSummary): FacilitiesSummary {
    return raw;
  }

  private formatInventorySummary(
    raw: Record<string, number>,
  ): InventoryStatusSummary {
    return {
      available: raw['Available'] || 0,
      reserved: raw['Reserved'] || 0,
      picked: raw['Picked'] || 0,
      damaged: raw['Damaged'] || 0,
      returned: raw['Returned'] || 0,
    };
  }

  private formatWarehouseDistribution(
    warehouseDevices: DeviceCountByEntity[],
    zoneDevices: DeviceCountByEntity[],
    aisleDevices: DeviceCountByEntity[],
    binDevices: DeviceCountByEntity[],
  ): WarehouseDistribution {
    return {
      devicesPerWarehouse: warehouseDevices,
      devicesPerZone: zoneDevices,
      devicesPerAisle: aisleDevices,
      devicesPerBin: binDevices,
    };
  }

  private formatOrderSummary(raw: Record<string, number>): OrderStatusSummary {
    return {
      draft: raw['Draft'] || 0,
      pending: raw['Pending'] || 0,
      picking: raw['Picking'] || 0,
      ready: raw['Ready'] || 0,
      fulfilled: raw['Fulfilled'] || 0,
      cancelled: raw['Cancelled'] || 0,
    };
  }

  private formatPickListSummary(
    raw: Record<string, number>,
  ): PickListStatusSummary {
    return {
      assigned: raw['Assigned'] || 0,
      inProgress: raw['In Progress'] || 0,
      completed: raw['Completed'] || 0,
      cancelled: raw['Cancelled'] || 0,
    };
  }
}
