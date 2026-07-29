import mongoose from 'mongoose';
import type { CreateUserData, UpdateUserData, UserListParams } from './admin.types';
export declare class AdminRepository {
    findAll(params: UserListParams): Promise<(mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: mongoose.Types.ObjectId & string;
    }> & {
        __v: number;
    })[]>;
    count(params: UserListParams): Promise<number>;
    findById(id: string): Promise<(mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: mongoose.Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    findByEmail(email: string): Promise<(mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: mongoose.Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    create(data: CreateUserData & {
        password: string;
    }): Promise<{
        _id: mongoose.Types.ObjectId & string;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        isNew: boolean;
        schema: mongoose.Schema;
        name: string;
        email: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }>;
    update(id: string, data: UpdateUserData): Promise<(mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: mongoose.Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & import("../auth/auth.types").IUser & Required<{
        _id: mongoose.Types.ObjectId & string;
    }> & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=admin.repository.d.ts.map