import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => RequestHandler;
//# sourceMappingURL=async-handler.d.ts.map