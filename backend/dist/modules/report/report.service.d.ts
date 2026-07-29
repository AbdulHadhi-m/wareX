import { ReportRepository } from './report.repository';
import { DashboardResponse, InventoryReportResponse, WarehouseUtilizationReportResponse, DeviceStatusReportResponse, PickListPerformanceReportResponse, OrderStatusReportResponse, ReportQueryParams } from './report.types';
export declare class ReportService {
    private readonly reportRepository;
    constructor(reportRepository: ReportRepository);
    getDashboard(userId: string): Promise<DashboardResponse>;
    getInventoryReport(params: ReportQueryParams): Promise<InventoryReportResponse>;
    getWarehouseUtilizationReport(): Promise<WarehouseUtilizationReportResponse>;
    getDeviceStatusReport(params: ReportQueryParams): Promise<DeviceStatusReportResponse>;
    getPickListPerformanceReport(params: ReportQueryParams): Promise<PickListPerformanceReportResponse>;
    getOrderStatusReport(params: ReportQueryParams): Promise<OrderStatusReportResponse>;
    private formatFacilities;
    private formatInventorySummary;
    private formatWarehouseDistribution;
    private formatOrderSummary;
    private formatPickListSummary;
}
//# sourceMappingURL=report.service.d.ts.map