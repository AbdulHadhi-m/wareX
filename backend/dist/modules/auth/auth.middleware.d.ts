import { Request, Response, NextFunction } from 'express';
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function authorize(...permissions: string[]): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map