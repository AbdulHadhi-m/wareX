"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../../shared/config/environment");
const authentication_error_1 = require("../../shared/errors/authentication-error");
const authorization_error_1 = require("../../shared/errors/authorization-error");
const auth_model_1 = require("./auth.model");
const permission_cache_1 = require("../../shared/cache/permission-cache");
function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new authentication_error_1.AuthenticationError('Missing or invalid token');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.environment.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof authentication_error_1.AuthenticationError) {
            next(error);
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new authentication_error_1.AuthenticationError('Token has expired'));
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new authentication_error_1.AuthenticationError('Invalid token'));
            return;
        }
        next(new authentication_error_1.AuthenticationError('Authentication failed'));
    }
}
function authorize(...permissions) {
    return async (req, _res, next) => {
        try {
            if (!req.userId) {
                throw new authentication_error_1.AuthenticationError('Not authenticated');
            }
            const user = await auth_model_1.UserModel.findById(req.userId).populate('roleId').lean();
            if (!user) {
                throw new authentication_error_1.AuthenticationError('User not found');
            }
            const role = user.roleId;
            if (!role) {
                throw new authorization_error_1.AuthorizationError('User role not assigned');
            }
            req.userRole = role.name;
            if (role.isSuperAdmin) {
                next();
                return;
            }
            const roleId = role._id.toString();
            let permissionCodes = (0, permission_cache_1.getCachedPermissions)(roleId);
            if (!permissionCodes) {
                const RoleModel = mongoose_1.default.model('Role');
                const populatedRole = await RoleModel.findById(roleId)
                    .populate('permissions')
                    .lean();
                if (!populatedRole) {
                    throw new authorization_error_1.AuthorizationError('Role not found');
                }
                permissionCodes = new Set((populatedRole.permissions || []).map((p) => p.code));
                (0, permission_cache_1.setCachedPermissions)(roleId, permissionCodes);
            }
            const hasPermission = permissions.some((p) => permissionCodes.has(p));
            if (!hasPermission) {
                throw new authorization_error_1.AuthorizationError('Insufficient permissions');
            }
            next();
        }
        catch (error) {
            if (error instanceof authentication_error_1.AuthenticationError || error instanceof authorization_error_1.AuthorizationError) {
                next(error);
                return;
            }
            next(new authorization_error_1.AuthorizationError('Authorization check failed'));
        }
    };
}
//# sourceMappingURL=auth.middleware.js.map