import { z } from 'zod';
export declare const createRoleSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    permissionIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    permissionIds: string[];
}, {
    name: string;
    permissionIds: string[];
    description?: string | undefined;
}>;
export declare const updateRoleSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    permissionIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    permissionIds?: string[] | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    permissionIds?: string[] | undefined;
}>;
//# sourceMappingURL=role.validation.d.ts.map