import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import type { LoginDto, RegisterDto } from '../types/index';
import * as usersRepo from '../repositories/users.repository';
import { signAccessToken } from '../utils/jwt';

const BCRYPT_ROUNDS = 10;

export async function register(dto: RegisterDto): Promise<Record<string, unknown>> {
  const existing = await usersRepo.findUserByEmail(dto.email);
  if (existing) {
    throw new AppError(409, 'El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
  const user = await usersRepo.createUser({ ...dto, password: hashedPassword, role: 'user' });

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete (safeUser as Record<string, unknown>).password;
  return safeUser as Record<string, unknown>;
}

export async function login(dto: LoginDto): Promise<{ accessToken: string; role: string }> {
  const user = await usersRepo.findUserByEmail(dto.email);
  if (!user) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const match = await bcrypt.compare(dto.password, user.password);
  if (!match) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const accessToken = signAccessToken({
    sub: String(user._id),
    role: user.role,
  });

  return { accessToken, role: user.role };
}

export async function getMe(userId: string): Promise<Record<string, unknown>> {
  const user = await usersRepo.findUserById(userId);
  if (!user) {
    throw new AppError(404, 'Usuario no encontrado');
  }

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete (safeUser as Record<string, unknown>).password;
  return safeUser as Record<string, unknown>;
}
