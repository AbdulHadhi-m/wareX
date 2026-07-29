import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    roleId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    roleId: string;
}, {
    name: string;
    email: string;
    password: string;
    roleId: string;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    roleId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    roleId?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    roleId?: string | undefined;
}>;
export declare const userListQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodOptional<z.ZodNumber>;
    limit: z.ZodOptional<z.ZodNumber>;
    sortBy: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
    roleId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    roleId?: string | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
}, {
    limit?: number | undefined;
    roleId?: string | undefined;
    search?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=admin.validation.d.ts.map