import { z } from 'zod';
export declare const createPermissionSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    module: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    description: string;
    module: string;
}, {
    code: string;
    name: string;
    module: string;
    description?: string | undefined;
}>;
export declare const updatePermissionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
}>;
//# sourceMappingURL=permission.validation.d.ts.map