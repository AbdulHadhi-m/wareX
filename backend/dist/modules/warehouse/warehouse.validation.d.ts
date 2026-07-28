import { z } from 'zod';
export declare const createWarehouseSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["Active", "Inactive"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    description?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    postalCode?: string | undefined;
}, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    description?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    postalCode?: string | undefined;
}>;
export declare const updateWarehouseSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive"]>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    status?: "Active" | "Inactive" | undefined;
    name?: string | undefined;
    description?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    postalCode?: string | undefined;
}, {
    code?: string | undefined;
    status?: "Active" | "Inactive" | undefined;
    name?: string | undefined;
    description?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    postalCode?: string | undefined;
}>;
export declare const warehouseIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=warehouse.validation.d.ts.map