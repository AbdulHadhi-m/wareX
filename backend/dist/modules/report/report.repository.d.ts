import { ReportQueryParams } from './report.types';
export declare class ReportRepository {
    countFacilities(): Promise<{
        totalWarehouses: number;
        totalZones: number;
        totalAisles: number;
        totalBins: number;
        totalDevices: number;
    }>;
    inventoryStatusSummary(): Promise<Record<string, number>>;
    devicesPerEntity(groupField: string, lookupCollection: string): Promise<Record<string, unknown>[]>;
    orderStatusSummary(): Promise<Record<string, number>>;
    pickListStatusSummary(): Promise<Record<string, number>>;
    notificationSummary(userId: string): Promise<{
        total: number;
        unread: number;
    }>;
    inventoryReport(params: ReportQueryParams): Promise<{
        data: Record<string, unknown>[];
        total: number;
    }>;
    warehouseUtilizationReport(): Promise<Record<string, unknown>[]>;
    deviceStatusReport(params: ReportQueryParams): Promise<{
        data: {
            _id: string;
            count: number;
        }[];
        total: number;
    }>;
    pickListPerformanceReport(params: ReportQueryParams): Promise<{
        data: Record<string, unknown>[];
        summary: {
            totalPickLists: number;
            completedPickLists: number;
            averageDurationMinutes: number;
            fastestDurationMinutes: number | null;
            slowestDurationMinutes: number | null;
        };
    }>;
    orderStatusReport(params: ReportQueryParams): Promise<{
        data: {
            _id: string;
            count: number;
        }[];
        total: number;
    }>;
}
//# sourceMappingURL=report.repository.d.ts.map