import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError.js';
import * as usersRepository from '../repositories/users.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import type { RegisterDto, LoginDto } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 10;

export async function register(dto: RegisterDto) {
  const existing = await usersRepository.findByEmail(dto.email);
  if (existing) {
    throw new AppError(409, 'El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await usersRepository.create({
    name: dto.name,
    email: dto.email,
    password: hashedPassword,
    role: dto.role ?? 'user',
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function login(dto: LoginDto) {
  const user = await usersRepository.findByEmailWithPassword(dto.email);
  if (!user) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(dto.password, user.password);
  if (!isMatch) {
    throw new AppError(401, 'Credenciales inválidas');
  }

  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(user._id.toString());

  // Almacenar hash del refresh token para máxima seguridad
  const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await usersRepository.updateRefreshToken(user._id.toString(), hashedRefresh);

  return {
    accessToken,
    refreshToken,
    role: user.role,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function refreshTokens(incomingToken: string) {
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingToken);
  } catch {
    throw new AppError(401, 'Refresh token inválido o expirado');
  }

  const user = await usersRepository.findByIdWithTokens(payload.sub);
  if (!user || !user.refreshToken) {
    throw new AppError(401, 'Sesión no válida o expirada');
  }

  // Verificar si coincide con el hash almacenado (o token plano si migrado)
  const isValid = user.refreshToken.startsWith('$2')
    ? await bcrypt.compare(incomingToken, user.refreshToken)
    : user.refreshToken === incomingToken;

  if (!isValid) {
    throw new AppError(401, 'Refresh token no coincide o fue revocado');
  }

  const newPayload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const newAccessToken = signAccessToken(newPayload);
  const newRefreshToken = signRefreshToken(user._id.toString());

  const newHashedRefresh = await bcrypt.hash(newRefreshToken, SALT_ROUNDS);
  await usersRepository.updateRefreshToken(user._id.toString(), newHashedRefresh);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export const refresh = refreshTokens;

export async function logout(userId: string): Promise<void> {
  await usersRepository.updateRefreshToken(userId, null);
}

export async function getMe(userId: string) {
  const user = await usersRepository.findById(userId);
  if (!user) {
    throw new AppError(404, 'Usuario no encontrado');
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
