import { z } from 'zod';
export declare const createBinSchema: z.ZodObject<{
    aisleId: z.ZodString;
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    capacity: z.ZodNumber;
    status: z.ZodEnum<["Available", "Full", "Blocked", "Inactive"]>;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "Inactive" | "Available" | "Full" | "Blocked";
    name: string;
    aisleId: string;
    capacity: number;
    description?: string | undefined;
}, {
    code: string;
    status: "Inactive" | "Available" | "Full" | "Blocked";
    name: string;
    aisleId: string;
    capacity: number;
    description?: string | undefined;
}>;
export declare const updateBinSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["Available", "Full", "Blocked", "Inactive"]>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    status?: "Inactive" | "Available" | "Full" | "Blocked" | undefined;
    name?: string | undefined;
    description?: string | undefined;
    capacity?: number | undefined;
}, {
    code?: string | undefined;
    status?: "Inactive" | "Available" | "Full" | "Blocked" | undefined;
    name?: string | undefined;
    description?: string | undefined;
    capacity?: number | undefined;
}>;
export declare const binIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const aisleIdParamSchema: z.ZodObject<{
    aisleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    aisleId: string;
}, {
    aisleId: string;
}>;
//# sourceMappingURL=bin.validation.d.ts.map