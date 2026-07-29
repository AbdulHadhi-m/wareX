import { api } from '@/lib/axios';
import type { ApiResponse, PaginationMeta } from '@/types';
import type {
  PickList,
  CreatePickListData,
  AssignPickListData,
  PickListListParams,
} from '../types';
import type { Device } from '@/features/device/types';

export const pickListApi = {
  list: (params?: PickListListParams) =>
    api
      .get<ApiResponse<PickList[]> & { meta?: PaginationMeta }>('/pick-lists', {
        params,
      })
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  byId: (id: string) =>
    api.get<ApiResponse<PickList>>(`/pick-lists/${id}`).then((r) => r.data.data!),

  byWorker: (workerId: string, params?: { page?: number; limit?: number }) =>
    api
      .get<ApiResponse<PickList[]> & { meta?: PaginationMeta }>(
        `/pick-lists/worker/${workerId}`,
        { params },
      )
      .then((r) => ({ data: r.data.data!, meta: r.data.meta! })),

  create: (data: CreatePickListData) =>
    api.post<ApiResponse<PickList>>('/pick-lists', data).then((r) => r.data.data!),

  assign: (id: string, data: AssignPickListData) =>
    api
      .patch<ApiResponse<PickList>>(`/pick-lists/${id}/assign`, data)
      .then((r) => r.data.data!),

  start: (id: string) =>
    api
      .patch<ApiResponse<PickList>>(`/pick-lists/${id}/start`)
      .then((r) => r.data.data!),

  complete: (id: string) =>
    api
      .patch<ApiResponse<PickList>>(`/pick-lists/${id}/complete`)
      .then((r) => r.data.data!),

  cancel: (id: string) =>
    api
      .patch<ApiResponse<PickList>>(`/pick-lists/${id}/cancel`)
      .then((r) => r.data.data!),

  searchDevices: (search: string) =>
    api
      .get<ApiResponse<Device[]>>('/devices', {
        params: { search, limit: 20, status: 'Available' },
      })
      .then((r) => r.data.data! ?? []),
};
