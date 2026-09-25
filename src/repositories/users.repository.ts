import { User, IUser } from '../models/user.model.js';

export async function findByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function findByEmailWithPassword(email: string): Promise<IUser | null> {
  return User.findOne({ email }).select('+password +refreshToken');
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email }).select('+password +refreshToken');
}

export async function findByIdWithTokens(id: string): Promise<IUser | null> {
  return User.findById(id).select('+password +refreshToken');
}

export async function findById(id: string): Promise<IUser | null> {
  return User.findById(id);
}

export async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id);
}

export async function create(data: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<IUser> {
  return User.create(data);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}): Promise<IUser> {
  return User.create(data);
}

export async function updateRefreshToken(
  id: string,
  hashedToken: string | null | undefined
): Promise<void> {
  await User.findByIdAndUpdate(id, { refreshToken: hashedToken ?? null });
}
