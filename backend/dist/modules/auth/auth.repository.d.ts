import { IUser, RegisterDTO } from './auth.types';
export declare class AuthRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findByEmailWithPassword(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    create(data: RegisterDTO & {
        password: string;
    }): Promise<IUser>;
    existsByEmail(email: string): Promise<boolean>;
}
//# sourceMappingURL=auth.repository.d.ts.map