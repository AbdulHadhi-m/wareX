import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import {
  RegisterDTO,
  LoginDTO,
  AuthResponse,
  UserResponse,
  JwtPayload,
  IUser,
} from './auth.types';
import { environment } from '../../shared/config/environment';
import { AuthenticationError } from '../../shared/errors/authentication-error';
import { ConflictError } from '../../shared/errors/conflict-error';

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponse> {
    const exists = await this.repository.existsByEmail(dto.email);

    if (exists) {
      throw new ConflictError('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.repository.create({
      ...dto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    const userResponse = this.toUserResponse(user);

    return { token, user: userResponse };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.repository.findByEmailWithPassword(dto.email);

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const token = this.generateToken(user);
    const userResponse = this.toUserResponse(user);

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
      role: user.role,
    };

    return jwt.sign(payload, environment.JWT_SECRET, {
      expiresIn: environment.JWT_EXPIRES_IN,
    });
  }

  private toUserResponse(user: IUser): UserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: new Date(user.createdAt).toISOString(),
    };
  }
}
