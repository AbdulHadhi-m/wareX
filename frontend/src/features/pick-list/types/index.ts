export type PickListStatus =
  | 'Draft'
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type PickListPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface PickList {
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

export interface CreatePickListData {
  workerId?: string;
  deviceIds: string[];
  priority: PickListPriority;
  notes?: string;
}

export interface AssignPickListData {
  workerId: string;
}

export interface PickListListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: PickListStatus;
  priority?: PickListPriority;
  workerId?: string;
}

export interface WorkerOption {
  id: string;
  name: string;
  email: string;
}
