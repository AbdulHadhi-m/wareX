import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["SuperAdmin", "Manager", "Worker"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "SuperAdmin" | "Manager" | "Worker";
}, {
    name: string;
    email: string;
    password: string;
    role: "SuperAdmin" | "Manager" | "Worker";
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["SuperAdmin", "Manager", "Worker"]>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: "SuperAdmin" | "Manager" | "Worker" | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    role?: "SuperAdmin" | "Manager" | "Worker" | undefined;
}>;
export declare const userListQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    role: z.ZodOptional<z.ZodEnum<["SuperAdmin", "Manager", "Worker"]>>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    role?: "SuperAdmin" | "Manager" | "Worker" | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
}, {
    limit?: number | undefined;
    role?: "SuperAdmin" | "Manager" | "Worker" | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=admin.validation.d.ts.map