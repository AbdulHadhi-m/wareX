"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
class ReportService {
    reportRepository;
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async getDashboard(userId) {
        const facilities = this.reportRepository.countFacilities();
        const inventorySummary = this.reportRepository.inventoryStatusSummary();
        const devicesPerWarehouse = this.reportRepository.devicesPerEntity('warehouseId', 'warehouses');
        const devicesPerZone = this.reportRepository.devicesPerEntity('zoneId', 'zones');
        const devicesPerAisle = this.reportRepository.devicesPerEntity('aisleId', 'aisles');
        const devicesPerBin = this.reportRepository.devicesPerEntity('binId', 'bins');
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
        const [facilitiesData, inventoryData, warehouseDevices, zoneDevices, aisleDevices, binDevices, orderData, pickListData, notificationData,] = results;
        return {
            facilities: this.formatFacilities(facilitiesData),
            inventorySummary: this.formatInventorySummary(inventoryData),
            warehouseSummary: this.formatWarehouseDistribution(warehouseDevices, zoneDevices, aisleDevices, binDevices),
            orderSummary: this.formatOrderSummary(orderData),
            pickListSummary: this.formatPickListSummary(pickListData),
            notificationSummary: notificationData,
        };
    }
    async getInventoryReport(params) {
        const result = await this.reportRepository.inventoryReport(params);
        return {
            data: result.data,
            total: result.total,
        };
    }
    async getWarehouseUtilizationReport() {
        const data = await this.reportRepository.warehouseUtilizationReport();
        return { data: data };
    }
    async getDeviceStatusReport(params) {
        const result = await this.reportRepository.deviceStatusReport(params);
        const total = result.total;
        const data = result.data.map((row) => ({
            status: row._id,
            count: row.count,
            percentage: total > 0 ? Math.round((row.count / total) * 10000) / 100 : 0,
        }));
        return { data, total };
    }
    async getPickListPerformanceReport(params) {
        const result = await this.reportRepository.pickListPerformanceReport(params);
        return {
            data: result.data,
            summary: result.summary,
        };
    }
    async getOrderStatusReport(params) {
        const result = await this.reportRepository.orderStatusReport(params);
        const total = result.total;
        const data = result.data.map((row) => ({
            status: row._id,
            count: row.count,
            percentage: total > 0 ? Math.round((row.count / total) * 10000) / 100 : 0,
        }));
        return { data, total };
    }
    formatFacilities(raw) {
        return raw;
    }
    formatInventorySummary(raw) {
        return {
            available: raw['Available'] || 0,
            reserved: raw['Reserved'] || 0,
            picked: raw['Picked'] || 0,
            damaged: raw['Damaged'] || 0,
            returned: raw['Returned'] || 0,
        };
    }
    formatWarehouseDistribution(warehouseDevices, zoneDevices, aisleDevices, binDevices) {
        return {
            devicesPerWarehouse: warehouseDevices,
            devicesPerZone: zoneDevices,
            devicesPerAisle: aisleDevices,
            devicesPerBin: binDevices,
        };
    }
    formatOrderSummary(raw) {
        return {
            draft: raw['Draft'] || 0,
            pending: raw['Pending'] || 0,
            picking: raw['Picking'] || 0,
            ready: raw['Ready'] || 0,
            fulfilled: raw['Fulfilled'] || 0,
            cancelled: raw['Cancelled'] || 0,
        };
    }
    formatPickListSummary(raw) {
        return {
            assigned: raw['Assigned'] || 0,
            inProgress: raw['In Progress'] || 0,
            completed: raw['Completed'] || 0,
            cancelled: raw['Cancelled'] || 0,
        };
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map