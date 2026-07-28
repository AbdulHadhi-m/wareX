export type AisleStatus = 'Active' | 'Inactive';
export interface IAisle {
    _id: string;
    zoneId: string;
    name: string;
    code: string;
    description?: string;
    status: AisleStatus;
    createdBy: string;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateAisleDTO {
    zoneId: string;
    name: string;
    code: string;
    description?: string;
    status: AisleStatus;
}
export interface UpdateAisleDTO {
    name?: string;
    code?: string;
    description?: string;
    status?: AisleStatus;
}
export interface AisleResponse {
    id: string;
    zoneId: string;
    name: string;
    code: string;
    description?: string;
    status: AisleStatus;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=aisle.types.d.ts.map