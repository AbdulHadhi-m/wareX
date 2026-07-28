import { z } from 'zod';
export declare const createAisleSchema: z.ZodObject<{
    zoneId: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["Active", "Inactive"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    zoneId: string;
    description?: string | undefined;
}, {
    code: string;
    status: "Active" | "Inactive";
    name: string;
    zoneId: string;
    description?: string | undefined;
}>;
export declare const updateAisleSchema: z.ZodObject<{
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
export declare const aisleIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const zoneIdParamSchema: z.ZodObject<{
    zoneId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    zoneId: string;
}, {
    zoneId: string;
}>;
//# sourceMappingURL=aisle.validation.d.ts.map