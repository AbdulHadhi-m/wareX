import { z } from 'zod';
export declare const moveDeviceSchema: z.ZodObject<{
    deviceId: z.ZodEffects<z.ZodString, string, string>;
    toBinId: z.ZodEffects<z.ZodString, string, string>;
    movementType: z.ZodEnum<["Initial Placement", "Transfer", "Return", "Adjustment"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
    toBinId: string;
    movementType: "Initial Placement" | "Transfer" | "Return" | "Adjustment";
    reason?: string | undefined;
}, {
    deviceId: string;
    toBinId: string;
    movementType: "Initial Placement" | "Transfer" | "Return" | "Adjustment";
    reason?: string | undefined;
}>;
export declare const deviceIdParamSchema: z.ZodObject<{
    deviceId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
}, {
    deviceId: string;
}>;
export declare const binIdParamSchema: z.ZodObject<{
    binId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    binId: string;
}, {
    binId: string;
}>;
export declare const warehouseIdParamSchema: z.ZodObject<{
    warehouseId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    warehouseId: string;
}, {
    warehouseId: string;
}>;
export declare const zoneIdParamSchema: z.ZodObject<{
    zoneId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    zoneId: string;
}, {
    zoneId: string;
}>;
export declare const aisleIdParamSchema: z.ZodObject<{
    aisleId: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    aisleId: string;
}, {
    aisleId: string;
}>;
export declare const inventoryQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Available", "Reserved", "Picked", "Shipped", "Damaged", "Returned"]>>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    status?: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}, {
    status?: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned" | undefined;
    limit?: string | undefined;
    page?: string | undefined;
}>;
//# sourceMappingURL=inventory.validation.d.ts.map