import { z } from 'zod';
export declare const createPickListSchema: z.ZodObject<{
    workerId: z.ZodOptional<z.ZodString>;
    deviceIds: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
    priority: z.ZodEnum<["Low", "Medium", "High", "Urgent"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deviceIds: string[];
    priority: "Low" | "Medium" | "High" | "Urgent";
    notes?: string | undefined;
    workerId?: string | undefined;
}, {
    deviceIds: string[];
    priority: "Low" | "Medium" | "High" | "Urgent";
    notes?: string | undefined;
    workerId?: string | undefined;
}>;
export declare const assignPickListSchema: z.ZodObject<{
    workerId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    workerId: string;
}, {
    workerId: string;
}>;
export declare const pickListIdParamSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const workerIdParamSchema: z.ZodObject<{
    workerId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    workerId: string;
}, {
    workerId: string;
}>;
export declare const pickListQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Draft", "Assigned", "In Progress", "Completed", "Cancelled"]>>;
    workerId: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    sortBy: string;
    sortOrder: "asc" | "desc";
    status?: "Draft" | "Assigned" | "In Progress" | "Completed" | "Cancelled" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    workerId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    status?: "Draft" | "Assigned" | "In Progress" | "Completed" | "Cancelled" | undefined;
    limit?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: string | undefined;
    workerId?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
//# sourceMappingURL=pickList.validation.d.ts.map