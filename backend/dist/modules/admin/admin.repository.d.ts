import type { CreateUserData, UpdateUserData, UserListParams } from './admin.types';
export declare class AdminRepository {
    findAll(params: UserListParams): Promise<(import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: import("mongoose").Types.ObjectId & string;
    }> & {
        __v: number;
    })[]>;
    count(params: UserListParams): Promise<number>;
    findById(id: string): Promise<(import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: import("mongoose").Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    findByEmail(email: string): Promise<(import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: import("mongoose").Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    create(data: CreateUserData & {
        password: string;
    }): Promise<{
        _id: import("mongoose").Types.ObjectId & string;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        name: string;
        email: string;
        role: import("../auth").UserRole;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }>;
    update(id: string, data: UpdateUserData): Promise<(import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: import("mongoose").Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: import("mongoose").Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=admin.repository.d.ts.map