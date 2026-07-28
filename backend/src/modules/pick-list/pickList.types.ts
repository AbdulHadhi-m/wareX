export type PickListStatus = 'Draft' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
export type PickListPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface IPickList {
  _id: string;
  pickListNumber: string;
  workerId?: string;
  deviceIds: string[];
  status: PickListStatus;
  priority: PickListPriority;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePickListDTO {
  workerId?: string;
  deviceIds: string[];
  priority: PickListPriority;
  notes?: string;
}

export interface AssignPickListDTO {
  workerId: string;
}

export interface PickListResponse {
  id: string;
  pickListNumber: string;
  workerId?: string;
  deviceIds: string[];
  status: PickListStatus;
  priority: PickListPriority;
  notes?: string;
  createdBy: string;
  updatedBy: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickListSearchParams {
  status?: PickListStatus;
  workerId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
