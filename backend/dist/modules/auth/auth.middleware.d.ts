import { Request, Response, NextFunction } from 'express';
import { UserRole } from './auth.types';
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map