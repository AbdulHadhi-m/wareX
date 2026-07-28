import { type Request, type Response, type NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare enum ValidationSource {
    BODY = "body",
    QUERY = "query",
    PARAMS = "params"
}
export declare function validate(schema: ZodSchema, source?: ValidationSource): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map