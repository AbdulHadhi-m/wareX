import { z } from 'zod';
export declare const createZoneSchema: z.ZodObject<{
    warehouseId: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["Active", "Inactive"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    warehouseId: string;
    description?: string | undefined;
}, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    warehouseId: string;
    description?: string | undefined;
}>;
export declare const updateZoneSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive"]>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    status?: "Active" | "Inactive" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    code?: string | undefined;
    status?: "Active" | "Inactive" | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>;
export declare const zoneIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const warehouseIdParamSchema: z.ZodObject<{
    warehouseId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    warehouseId: string;
}, {
    warehouseId: string;
}>;
//# sourceMappingURL=zone.validation.d.ts.map