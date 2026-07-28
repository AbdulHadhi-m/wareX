import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["Manager", "Worker"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    role: "Manager" | "Worker";
}, {
    name: string;
    email: string;
    password: string;
    role: "Manager" | "Worker";
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
//# sourceMappingURL=auth.validation.d.ts.map