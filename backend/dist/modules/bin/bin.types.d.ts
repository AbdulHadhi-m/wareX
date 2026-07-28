export type BinStatus = 'Available' | 'Full' | 'Blocked' | 'Inactive';
export interface IBin {
    _id: string;
    aisleId: string;
    name: string;
    code: string;
    description?: string;
    capacity: number;
    status: BinStatus;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBinDTO {
    aisleId: string;
    name: string;
    code: string;
    description?: string;
    capacity: number;
    status: BinStatus;
}
export interface UpdateBinDTO {
    name?: string;
    code?: string;
    description?: string;
    capacity?: number;
    status?: BinStatus;
}
export interface BinResponse {
    id: string;
    aisleId: string;
    name: string;
    code: string;
    description?: string;
    capacity: number;
    status: BinStatus;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=bin.types.d.ts.map