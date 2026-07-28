import { z } from 'zod';
export declare const createDeviceSchema: z.ZodObject<{
    deviceName: z.ZodString;
    brand: z.ZodString;
    model: z.ZodString;
    category: z.ZodString;
    imei: z.ZodOptional<z.ZodString>;
    serialNumber: z.ZodString;
    sku: z.ZodString;
    binId: z.ZodString;
    status: z.ZodEnum<["Available", "Reserved", "Picked", "Shipped", "Damaged", "Returned"]>;
    condition: z.ZodEnum<["New", "Good", "Fair", "Damaged"]>;
    purchaseDate: z.ZodOptional<z.ZodString>;
    warrantyExpiry: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned";
    model: string;
    deviceName: string;
    brand: string;
    category: string;
    serialNumber: string;
    sku: string;
    binId: string;
    condition: "Damaged" | "New" | "Good" | "Fair";
    imei?: string | undefined;
    purchaseDate?: string | undefined;
    warrantyExpiry?: string | undefined;
    notes?: string | undefined;
}, {
    status: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned";
    model: string;
    deviceName: string;
    brand: string;
    category: string;
    serialNumber: string;
    sku: string;
    binId: string;
    condition: "Damaged" | "New" | "Good" | "Fair";
    imei?: string | undefined;
    purchaseDate?: string | undefined;
    warrantyExpiry?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateDeviceSchema: z.ZodObject<{
    deviceName: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    imei: z.ZodOptional<z.ZodString>;
    serialNumber: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    binId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Available", "Reserved", "Picked", "Shipped", "Damaged", "Returned"]>>;
    condition: z.ZodOptional<z.ZodEnum<["New", "Good", "Fair", "Damaged"]>>;
    purchaseDate: z.ZodOptional<z.ZodString>;
    warrantyExpiry: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned" | undefined;
    model?: string | undefined;
    deviceName?: string | undefined;
    brand?: string | undefined;
    category?: string | undefined;
    imei?: string | undefined;
    serialNumber?: string | undefined;
    sku?: string | undefined;
    binId?: string | undefined;
    condition?: "Damaged" | "New" | "Good" | "Fair" | undefined;
    purchaseDate?: string | undefined;
    warrantyExpiry?: string | undefined;
    notes?: string | undefined;
}, {
    status?: "Available" | "Reserved" | "Picked" | "Shipped" | "Damaged" | "Returned" | undefined;
    model?: string | undefined;
    deviceName?: string | undefined;
    brand?: string | undefined;
    category?: string | undefined;
    imei?: string | undefined;
    serialNumber?: string | undefined;
    sku?: string | undefined;
    binId?: string | undefined;
    condition?: "Damaged" | "New" | "Good" | "Fair" | undefined;
    purchaseDate?: string | undefined;
    warrantyExpiry?: string | undefined;
    notes?: string | undefined;
}>;
export declare const deviceIdSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
//# sourceMappingURL=device.validation.d.ts.map