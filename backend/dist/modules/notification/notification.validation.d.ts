import { z } from 'zod';
export declare const createNotificationSchema: z.ZodObject<{
    recipientId: z.ZodEffects<z.ZodString, string, string>;
    title: z.ZodString;
    message: z.ZodString;
    type: z.ZodEnum<["Order Created", "Order Cancelled", "Order Fulfilled", "Pick List Assigned", "Pick List Started", "Pick List Completed", "Pick List Cancelled", "Device Reserved", "Device Moved", "Inventory Updated", "System"]>;
    priority: z.ZodDefault<z.ZodEnum<["Low", "Medium", "High", "Critical"]>>;
    relatedModule: z.ZodOptional<z.ZodString>;
    relatedResourceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "Order Created" | "Order Cancelled" | "Order Fulfilled" | "Pick List Assigned" | "Pick List Started" | "Pick List Completed" | "Pick List Cancelled" | "Device Reserved" | "Device Moved" | "Inventory Updated" | "System";
    priority: "Low" | "Medium" | "High" | "Critical";
    recipientId: string;
    title: string;
    relatedModule?: string | undefined;
    relatedResourceId?: string | undefined;
}, {
    message: string;
    type: "Order Created" | "Order Cancelled" | "Order Fulfilled" | "Pick List Assigned" | "Pick List Started" | "Pick List Completed" | "Pick List Cancelled" | "Device Reserved" | "Device Moved" | "Inventory Updated" | "System";
    recipientId: string;
    title: string;
    priority?: "Low" | "Medium" | "High" | "Critical" | undefined;
    relatedModule?: string | undefined;
    relatedResourceId?: string | undefined;
}>;
export declare const notificationIdParamSchema: z.ZodObject<{
    id: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const notificationQuerySchema: z.ZodObject<{
    isRead: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean | undefined, "true" | "false" | undefined>;
    type: z.ZodOptional<z.ZodEnum<["Order Created", "Order Cancelled", "Order Fulfilled", "Pick List Assigned", "Pick List Started", "Pick List Completed", "Pick List Cancelled", "Device Reserved", "Device Moved", "Inventory Updated", "System"]>>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    sortBy: string;
    sortOrder: "asc" | "desc";
    type?: "Order Created" | "Order Cancelled" | "Order Fulfilled" | "Pick List Assigned" | "Pick List Started" | "Pick List Completed" | "Pick List Cancelled" | "Device Reserved" | "Device Moved" | "Inventory Updated" | "System" | undefined;
    limit?: number | undefined;
    page?: number | undefined;
    isRead?: boolean | undefined;
}, {
    type?: "Order Created" | "Order Cancelled" | "Order Fulfilled" | "Pick List Assigned" | "Pick List Started" | "Pick List Completed" | "Pick List Cancelled" | "Device Reserved" | "Device Moved" | "Inventory Updated" | "System" | undefined;
    limit?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: string | undefined;
    isRead?: "true" | "false" | undefined;
}>;
//# sourceMappingURL=notification.validation.d.ts.map