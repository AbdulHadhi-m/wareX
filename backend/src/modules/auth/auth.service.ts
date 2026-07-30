import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AuthRepository } from './auth.repository';
import { RegisterDTO, LoginDTO, AuthResponse, UserResponse, JwtPayload, IUser } from './auth.types';
import { environment } from '../../shared/config/environment';
import { AuthenticationError } from '../../shared/errors/authentication-error';
import { ConflictError } from '../../shared/errors/conflict-error';
import { eventEmitter, Events } from '../../shared/events/event-emitter';

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const exists = await this.repository.existsByEmail(dto.email);

    if (exists) {
      throw new ConflictError('A user with this email already exists');
    }

    const RoleModel = mongoose.model('Role');
    const role = await RoleModel.findOne({ name: dto.role }).lean() as { _id: { toString(): string } } | null;

    if (!role) {
      throw new AuthenticationError('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

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

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.repository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    if (user.isActive === false) {
      throw new AuthenticationError('Account has been suspended. Please contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = this.generateToken(user);
    const userResponse = await this.toUserResponse(user);

    eventEmitter.emit(Events.AUTH_LOGIN, {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return { token, user: userResponse };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return this.toUserResponse(user);
  }

  private generateToken(user: IUser): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
    };

    return jwt.sign(payload, environment.JWT_SECRET, {
      expiresIn: environment.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }

  private async toUserResponse(user: IUser): Promise<UserResponse> {
    const RoleModel = mongoose.model('Role');
    const roleDoc = await RoleModel.findById(user.roleId).lean() as { name: string } | null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: roleDoc?.name ?? 'Unknown',
      createdAt: new Date(user.createdAt).toISOString(),
    };
  }
}
