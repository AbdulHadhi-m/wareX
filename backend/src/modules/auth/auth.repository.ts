import { UserModel } from './auth.model';
import { IUser } from './auth.types';

export class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password').lean();
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean();
  }

  async create(data: { name: string; email: string; password: string; roleId: string }): Promise<IUser> {
    const user = await UserModel.create(data);
    const obj = user.toObject();
    const { password: _, ...userWithoutPassword } = obj;
    return userWithoutPassword as unknown as IUser;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}
