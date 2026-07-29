import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { environment } from '../../shared/config/environment';
import { AuthenticationError } from '../../shared/errors/authentication-error';
import { AuthorizationError } from '../../shared/errors/authorization-error';
import { JwtPayload } from './auth.types';
import { UserModel } from './auth.model';
import { getCachedPermissions, setCachedPermissions } from '../../shared/cache/permission-cache';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, environment.JWT_SECRET) as JwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token has expired'));
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
      return;
    }

    next(new AuthenticationError('Authentication failed'));
  }
}

export function authorize(...permissions: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await UserModel.findById(req.userId).populate('roleId').lean();

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const role = user.roleId as unknown as {
        _id: string;
        name: string;
        isSuperAdmin: boolean;
        permissions: Array<{ _id: string; code: string }>;
      };

      if (!role) {
        throw new AuthorizationError('User role not assigned');
      }

      req.userRole = role.name;

      if (role.isSuperAdmin) {
        next();
        return;
      }

      const roleId = role._id.toString();
      let permissionCodes = getCachedPermissions(roleId);

      if (!permissionCodes) {
        const RoleModel = mongoose.model('Role');
        const populatedRole = await RoleModel.findById(roleId)
          .populate('permissions')
          .lean() as unknown as { permissions: Array<{ code: string }> } | null;

        if (!populatedRole) {
          throw new AuthorizationError('Role not found');
        }

        permissionCodes = new Set(
          (populatedRole.permissions || []).map((p: any) => p.code),
        );

        setCachedPermissions(roleId, permissionCodes);
      }

      const hasPermission = permissions.some((p) => permissionCodes!.has(p));

      if (!hasPermission) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        next(error);
        return;
      }
      next(new AuthorizationError('Authorization check failed'));
    }
  };
}
