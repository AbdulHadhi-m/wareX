import { AuthRepository } from './auth.repository';
import { RegisterDTO, LoginDTO, AuthResponse, UserResponse } from './auth.types';
export declare class AuthService {
    private readonly repository;
    constructor(repository: AuthRepository);
    register(dto: RegisterDTO): Promise<AuthResponse>;
    login(dto: LoginDTO): Promise<AuthResponse>;
    getProfile(userId: string): Promise<UserResponse>;
    private generateToken;
    private toUserResponse;
}
//# sourceMappingURL=auth.service.d.ts.map