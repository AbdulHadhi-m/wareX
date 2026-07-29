export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument {
  _id: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface JwtPayload {
  userId: string;
}
