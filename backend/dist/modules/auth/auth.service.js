"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const environment_1 = require("../../shared/config/environment");
const authentication_error_1 = require("../../shared/errors/authentication-error");
const conflict_error_1 = require("../../shared/errors/conflict-error");
const event_emitter_1 = require("../../shared/events/event-emitter");
const SALT_ROUNDS = 12;
class AuthService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async register(dto) {
        const exists = await this.repository.existsByEmail(dto.email);
        if (exists) {
            throw new conflict_error_1.ConflictError('A user with this email already exists');
        }
        const RoleModel = mongoose_1.default.model('Role');
        const role = await RoleModel.findOne({ name: dto.role }).lean();
        if (!role) {
            throw new authentication_error_1.AuthenticationError('Invalid role');
        }
        const hashedPassword = await bcrypt_1.default.hash(dto.password, SALT_ROUNDS);
        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            roleId: role._id.toString(),
        });
        const token = this.generateToken(user);
        const userResponse = await this.toUserResponse(user);
        return { token, user: userResponse };
    }
    async login(dto) {
        const user = await this.repository.findByEmailWithPassword(dto.email);
        if (!user) {
            throw new authentication_error_1.AuthenticationError('Invalid email or password');
        }
        const isPasswordValid = await bcrypt_1.default.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new authentication_error_1.AuthenticationError('Invalid email or password');
        }
        const token = this.generateToken(user);
        const userResponse = await this.toUserResponse(user);
        event_emitter_1.eventEmitter.emit(event_emitter_1.Events.AUTH_LOGIN, {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
        });
        return { token, user: userResponse };
    }
    async getProfile(userId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new authentication_error_1.AuthenticationError('User not found');
        }
        return this.toUserResponse(user);
    }
    generateToken(user) {
        const payload = {
            userId: user._id.toString(),
        };
        return jsonwebtoken_1.default.sign(payload, environment_1.environment.JWT_SECRET, {
            expiresIn: environment_1.environment.JWT_EXPIRES_IN,
        });
    }
    async toUserResponse(user) {
        const RoleModel = mongoose_1.default.model('Role');
        const roleDoc = await RoleModel.findById(user.roleId).lean();
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: roleDoc?.name ?? 'Unknown',
            createdAt: new Date(user.createdAt).toISOString(),
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map