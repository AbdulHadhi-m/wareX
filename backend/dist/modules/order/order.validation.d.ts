import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    customerName: z.ZodString;
    customerReference: z.ZodOptional<z.ZodString>;
    deviceIds: z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>;
    priority: z.ZodEnum<["Low", "Medium", "High", "Urgent"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deviceIds: string[];
    priority: "Low" | "Medium" | "High" | "Urgent";
    customerName: string;
    notes?: string | undefined;
    customerReference?: string | undefined;
}, {
    deviceIds: string[];
    priority: "Low" | "Medium" | "High" | "Urgent";
    customerName: string;
    notes?: string | undefined;
    customerReference?: string | undefined;
}>;
export declare const updateOrderSchema: z.ZodObject<{
    customerName: z.ZodOptional<z.ZodString>;
    customerReference: z.ZodOptional<z.ZodString>;
    deviceIds: z.ZodOptional<z.ZodEffects<z.ZodArray<z.ZodString, "many">, string[], string[]>>;
    priority: z.ZodOptional<z.ZodEnum<["Low", "Medium", "High", "Urgent"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
    deviceIds?: string[] | undefined;
    priority?: "Low" | "Medium" | "High" | "Urgent" | undefined;
    customerName?: string | undefined;
    customerReference?: string | undefined;
}, {
    notes?: string | undefined;
    deviceIds?: string[] | undefined;
    priority?: "Low" | "Medium" | "High" | "Urgent" | undefined;
    customerName?: string | undefined;
    customerReference?: string | undefined;
}>;
export declare const orderIdParamSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const orderQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Draft", "Pending", "Picking", "Ready", "Fulfilled", "Cancelled"]>>;
    customerName: z.ZodOptional<z.ZodString>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    sortBy: string;
    sortOrder: "asc" | "desc";
    status?: "Draft" | "Cancelled" | "Pending" | "Picking" | "Ready" | "Fulfilled" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    customerName?: string | undefined;
}, {
    status?: "Draft" | "Cancelled" | "Pending" | "Picking" | "Ready" | "Fulfilled" | undefined;
    limit?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: string | undefined;
    customerName?: string | undefined;
}>;
//# sourceMappingURL=order.validation.d.ts.map