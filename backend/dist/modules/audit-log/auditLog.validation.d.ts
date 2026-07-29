import { z } from 'zod';
export declare const auditLogQuerySchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    module: z.ZodOptional<z.ZodString>;
    action: z.ZodOptional<z.ZodString>;
    resourceType: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    sortBy: string;
    sortOrder: "asc" | "desc";
    limit?: number | undefined;
    userId?: string | undefined;
    module?: string | undefined;
    action?: string | undefined;
    resourceType?: string | undefined;
    page?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    limit?: string | undefined;
    userId?: string | undefined;
    module?: string | undefined;
    action?: string | undefined;
    resourceType?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
//# sourceMappingURL=auditLog.validation.d.ts.map