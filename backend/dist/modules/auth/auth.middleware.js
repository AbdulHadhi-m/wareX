"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../../shared/config/environment");
const authentication_error_1 = require("../../shared/errors/authentication-error");
const authorization_error_1 = require("../../shared/errors/authorization-error");
function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new authentication_error_1.AuthenticationError('Missing or invalid token');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.environment.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
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
function authorize(...roles) {
    return (req, _res, next) => {
        if (req.userRole === 'SuperAdmin') {
            next();
            return;
        }
        if (!req.userRole || !roles.includes(req.userRole)) {
            next(new authorization_error_1.AuthorizationError('Insufficient permissions'));
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map