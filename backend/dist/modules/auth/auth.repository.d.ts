import { IUser } from './auth.types';
export declare class AuthRepository {
    findByEmail(email: string): Promise<IUser | null>;
    findByEmailWithPassword(email: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
        roleId: string;
    }): Promise<IUser>;
    existsByEmail(email: string): Promise<boolean>;
}
//# sourceMappingURL=auth.repository.d.ts.map