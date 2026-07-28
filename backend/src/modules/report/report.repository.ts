import mongoose from 'mongoose';
import { DeviceModel } from '../device/device.model';
import { WarehouseModel } from '../warehouse/warehouse.model';
import { ZoneModel } from '../zone/zone.model';
import { AisleModel } from '../aisle/aisle.model';
import { BinModel } from '../bin/bin.model';
import { OrderModel } from '../order/order.model';
import { PickListModel } from '../pick-list/pickList.model';
import { NotificationModel } from '../notification/notification.model';
import { ReportQueryParams } from './report.types';

export class ReportRepository {
  async countFacilities(): Promise<{
    totalWarehouses: number;
    totalZones: number;
    totalAisles: number;
    totalBins: number;
    totalDevices: number;
  }> {
    const filter = { isDeleted: { $ne: true } };

    const [totalWarehouses, totalZones, totalAisles, totalBins, totalDevices] =
      await Promise.all([
        WarehouseModel.countDocuments(filter),
        ZoneModel.countDocuments(filter),
        AisleModel.countDocuments(filter),
        BinModel.countDocuments(filter),
        DeviceModel.countDocuments(filter),
      ]);

    return { totalWarehouses, totalZones, totalAisles, totalBins, totalDevices };
  }

  async inventoryStatusSummary(): Promise<Record<string, number>> {
    const results = await DeviceModel.aggregate<{ _id: string; count: number }>([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const summary: Record<string, number> = {};
    for (const row of results) {
      summary[row._id] = row.count;
    }

    return summary;
  }

  async devicesPerEntity(
    groupField: string,
    lookupCollection: string,
  ): Promise<Record<string, unknown>[]> {
    return DeviceModel.aggregate<Record<string, unknown>>([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: `$${groupField}`, deviceCount: { $sum: 1 } } },
      {
        $lookup: {
          from: lookupCollection,
          let: { entityId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', { $toObjectId: '$$entityId' }] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { name: 1, code: 1 } },
          ],
          as: 'entity',
        },
      },
      { $unwind: { path: '$entity', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: { $ifNull: ['$entity.name', 'Unknown'] },
          code: { $ifNull: ['$entity.code', ''] },
          deviceCount: 1,
        },
      },
    ]);
  }

  async orderStatusSummary(): Promise<Record<string, number>> {
    const results = await OrderModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const summary: Record<string, number> = {};
    for (const row of results) {
      summary[row._id] = row.count;
    }

    return summary;
  }

  async pickListStatusSummary(): Promise<Record<string, number>> {
    const results = await PickListModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const summary: Record<string, number> = {};
    for (const row of results) {
      summary[row._id] = row.count;
    }

    return summary;
  }

  async notificationSummary(
    userId: string,
  ): Promise<{ total: number; unread: number }> {
    const results = await NotificationModel.aggregate<{
      _id: null;
      total: number;
      unread: number;
    }>([
      {
        $match: {
          recipientId: userId,
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
        },
      },
    ]);

    if (results.length === 0) {
      return { total: 0, unread: 0 };
    }

    return { total: results[0].total, unread: results[0].unread };
  }

  async inventoryReport(
    params: ReportQueryParams,
  ): Promise<{
    data: Record<string, unknown>[];
    total: number;
  }> {
    const matchStage: Record<string, unknown> = { isDeleted: { $ne: true } };
    const countMatchStage: Record<string, unknown> = { isDeleted: { $ne: true } };

    if (params.warehouseId) {
      matchStage.warehouseId = params.warehouseId;
    }
    if (params.zoneId) {
      matchStage.zoneId = params.zoneId;
    }
    if (params.aisleId) {
      matchStage.aisleId = params.aisleId;
    }
    if (params.binId) {
      matchStage.binId = params.binId;
    }
    if (params.status) {
      matchStage.status = params.status;
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage as mongoose.PipelineStage.Match['$match'] },
      {
        $lookup: {
          from: 'bins',
          let: { binId: '$binId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', { $toObjectId: '$$binId' }] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { name: 1, code: 1, aisleId: 1 } },
          ] as mongoose.PipelineStage[],
          as: 'bin',
        },
      } as mongoose.PipelineStage,
      { $unwind: { path: '$bin', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'aisles',
          let: { aisleId: '$bin.aisleId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', { $toObjectId: '$$aisleId' }] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { name: 1, zoneId: 1 } },
          ] as mongoose.PipelineStage[],
          as: 'aisle',
        },
      } as mongoose.PipelineStage,
      { $unwind: { path: '$aisle', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'zones',
          let: { zoneId: '$aisle.zoneId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', { $toObjectId: '$$zoneId' }] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { name: 1, warehouseId: 1 } },
          ] as mongoose.PipelineStage[],
          as: 'zone',
        },
      } as mongoose.PipelineStage,
      { $unwind: { path: '$zone', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'warehouses',
          let: { warehouseId: '$zone.warehouseId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', { $toObjectId: '$$warehouseId' }] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { name: 1 } },
          ] as mongoose.PipelineStage[],
          as: 'warehouse',
        },
      } as mongoose.PipelineStage,
      { $unwind: { path: '$warehouse', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          deviceId: { $toString: '$_id' },
          deviceName: 1,
          brand: 1,
          model: 1,
          serialNumber: 1,
          sku: 1,
          category: 1,
          status: 1,
          condition: 1,
          warehouseName: { $ifNull: ['$warehouse.name', null] },
          zoneName: { $ifNull: ['$zone.name', null] },
          aisleName: { $ifNull: ['$aisle.name', null] },
          binCode: { $ifNull: ['$bin.code', null] },
          warehouseId: 1,
          zoneId: 1,
          aisleId: 1,
          binId: 1,
          createdAt: { $toString: '$createdAt' },
        },
      },
    ] as mongoose.PipelineStage[];

    const countPipeline: mongoose.PipelineStage[] = [
      { $match: countMatchStage as mongoose.PipelineStage.Match['$match'] },
      { $count: 'total' },
    ];

    const [data, countResult] = await Promise.all([
      DeviceModel.aggregate(pipeline),
      DeviceModel.aggregate(countPipeline),
    ]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    return { data, total };
  }

  async warehouseUtilizationReport(): Promise<Record<string, unknown>[]> {
    return WarehouseModel.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      {
        $lookup: {
          from: 'zones',
          let: { wid: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$warehouseId', '$$wid'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'zones',
        },
      },
      {
        $lookup: {
          from: 'aisles',
          let: { zoneIds: '$zones._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: [{ $toObjectId: '$zoneId' }, '$$zoneIds'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $project: { _id: 1 } },
          ],
          as: 'aisles',
        },
      },
      {
        $lookup: {
          from: 'bins',
          let: { aisleIds: '$aisles._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: [{ $toObjectId: '$aisleId' }, '$$aisleIds'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                status: 1,
                capacity: 1,
              },
            },
          ],
          as: 'bins',
        },
      },
      {
        $lookup: {
          from: 'devices',
          let: {
            binIds: {
              $map: { input: '$bins', as: 'bin', in: { $toString: '$$bin._id' } },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$binId', '$$binIds'] },
                    { $ne: ['$isDeleted', true] },
                  ],
                },
              },
            },
            { $count: 'deviceCount' },
          ],
          as: 'devices',
        },
      },
      {
        $project: {
          _id: 0,
          warehouseId: { $toString: '$_id' },
          warehouseName: '$name',
          warehouseCode: '$code',
          totalZones: { $size: '$zones' },
          totalAisles: { $size: '$aisles' },
          totalBins: { $size: '$bins' },
          usedBins: {
            $size: {
              $filter: {
                input: '$bins',
                as: 'bin',
                cond: { $ne: ['$$bin.status', 'Available'] },
              },
            },
          },
          availableBins: {
            $size: {
              $filter: {
                input: '$bins',
                as: 'bin',
                cond: { $eq: ['$$bin.status', 'Available'] },
              },
            },
          },
          fullBins: {
            $size: {
              $filter: {
                input: '$bins',
                as: 'bin',
                cond: { $eq: ['$$bin.status', 'Full'] },
              },
            },
          },
          blockedBins: {
            $size: {
              $filter: {
                input: '$bins',
                as: 'bin',
                cond: { $eq: ['$$bin.status', 'Blocked'] },
              },
            },
          },
          totalCapacity: { $sum: '$bins.capacity' },
          usedCapacity: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$bins',
                    as: 'bin',
                    cond: {
                      $in: ['$$bin.status', ['Full', 'Blocked']],
                    },
                  },
                },
                as: 'bin',
                in: '$$bin.capacity',
              },
            },
          },
          deviceCount: {
            $ifNull: [{ $arrayElemAt: ['$devices.deviceCount', 0] }, 0],
          },
        },
      },
      {
        $addFields: {
          utilizationPercentage: {
            $cond: [
              { $gt: ['$totalCapacity', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$usedCapacity', '$totalCapacity'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { warehouseName: 1 } },
    ]);
  }

  async deviceStatusReport(
    params: ReportQueryParams,
  ): Promise<{
    data: { _id: string; count: number }[];
    total: number;
  }> {
    const matchStage: Record<string, unknown> = { isDeleted: { $ne: true } };

    if (params.warehouseId) {
      matchStage.warehouseId = params.warehouseId;
    }
    if (params.zoneId) {
      matchStage.zoneId = params.zoneId;
    }
    if (params.aisleId) {
      matchStage.aisleId = params.aisleId;
    }

    const results = await DeviceModel.aggregate<{ _id: string; count: number }>([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalResult = await DeviceModel.aggregate<{ total: number }>([
      { $match: matchStage },
      { $count: 'total' },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return { data: results, total };
  }

  async pickListPerformanceReport(
    params: ReportQueryParams,
  ): Promise<{
    data: Record<string, unknown>[];
    summary: {
      totalPickLists: number;
      completedPickLists: number;
      averageDurationMinutes: number;
      fastestDurationMinutes: number | null;
      slowestDurationMinutes: number | null;
    };
  }> {
    const matchStage: Record<string, unknown> = {};

    if (params.workerId) {
      matchStage.workerId = params.workerId;
    }

    if (params.dateFrom || params.dateTo) {
      const createdAtFilter: Record<string, unknown> = {};

      if (params.dateFrom) {
        createdAtFilter.$gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        createdAtFilter.$lte = new Date(params.dateTo);
      }

      matchStage.createdAt = createdAtFilter;
    }

    const pipeline: mongoose.PipelineStage[] = [
      { $match: matchStage as mongoose.PipelineStage.Match['$match'] },
      {
        $addFields: {
          durationMinutes: {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$startedAt', null] },
                  { $ne: ['$completedAt', null] },
                ],
              },
              then: {
                $divide: [
                  { $subtract: ['$completedAt', '$startedAt'] },
                  60000,
                ],
              },
              else: null,
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 0,
          pickListId: { $toString: '$_id' },
          pickListNumber: 1,
          workerId: 1,
          status: 1,
          priority: 1,
          deviceCount: { $size: { $ifNull: ['$deviceIds', []] } },
          startedAt: {
            $cond: {
              if: { $ne: ['$startedAt', null] },
              then: { $toString: '$startedAt' },
              else: null,
            },
          },
          completedAt: {
            $cond: {
              if: { $ne: ['$completedAt', null] },
              then: { $toString: '$completedAt' },
              else: null,
            },
          },
          durationMinutes: 1,
          createdBy: 1,
          createdAt: { $toString: '$createdAt' },
        },
      },
    ] as mongoose.PipelineStage[];

    const summaryPipeline: mongoose.PipelineStage[] = [
      { $match: matchStage as mongoose.PipelineStage.Match['$match'] },
      {
        $addFields: {
          durationMinutes: {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$startedAt', null] },
                  { $ne: ['$completedAt', null] },
                ],
              },
              then: {
                $divide: [
                  { $subtract: ['$completedAt', '$startedAt'] },
                  60000,
                ],
              },
              else: null,
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPickLists: { $sum: 1 },
          completedPickLists: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
          },
          averageDurationMinutes: { $avg: '$durationMinutes' },
          fastestDurationMinutes: { $min: '$durationMinutes' },
          slowestDurationMinutes: { $max: '$durationMinutes' },
        },
      },
    ] as mongoose.PipelineStage[];

    const [data, summaryResults] = await Promise.all([
      PickListModel.aggregate(pipeline),
      PickListModel.aggregate(summaryPipeline),
    ]);

    const defaultSummary = {
      totalPickLists: 0,
      completedPickLists: 0,
      averageDurationMinutes: 0,
      fastestDurationMinutes: null,
      slowestDurationMinutes: null,
    };

    const summary =
      summaryResults.length > 0
        ? {
            totalPickLists: summaryResults[0].totalPickLists,
            completedPickLists: summaryResults[0].completedPickLists,
            averageDurationMinutes: Math.round(summaryResults[0].averageDurationMinutes || 0),
            fastestDurationMinutes: summaryResults[0].fastestDurationMinutes
              ? Math.round(summaryResults[0].fastestDurationMinutes)
              : null,
            slowestDurationMinutes: summaryResults[0].slowestDurationMinutes
              ? Math.round(summaryResults[0].slowestDurationMinutes)
              : null,
          }
        : defaultSummary;

    return { data, summary };
  }

  async orderStatusReport(
    params: ReportQueryParams,
  ): Promise<{
    data: { _id: string; count: number }[];
    total: number;
  }> {
    const matchStage: Record<string, unknown> = {};

    if (params.dateFrom || params.dateTo) {
      const createdAtFilter: Record<string, unknown> = {};

      if (params.dateFrom) {
        createdAtFilter.$gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        createdAtFilter.$lte = new Date(params.dateTo);
      }

      matchStage.createdAt = createdAtFilter;
    }

    const results = await OrderModel.aggregate<{ _id: string; count: number }>([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const totalResult = await OrderModel.aggregate<{ total: number }>([
      { $match: matchStage },
      { $count: 'total' },
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return { data: results, total };
  }
}
