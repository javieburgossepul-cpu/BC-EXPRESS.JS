import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// ─── Access Token (15 minutos) ──────────────────────────────────────────────
export function signAccessToken(payload: JwtPayload): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  if (!secret) throw new AppError(500, 'JWT_ACCESS_SECRET no está configurado');
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new AppError(500, 'JWT_ACCESS_SECRET no está configurado');
  return jwt.verify(token, secret) as JwtPayload;
}

// ─── Refresh Token (7 días) ─────────────────────────────────────────────────
export function signRefreshToken(payloadOrId: string | { sub: string }): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
  if (!secret) throw new AppError(500, 'JWT_REFRESH_SECRET no está configurado');
  const payload = typeof payloadOrId === 'string' ? { sub: payloadOrId } : payloadOrId;
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyRefreshToken(token: string): { sub: string } {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new AppError(500, 'JWT_REFRESH_SECRET no está configurado');
  return jwt.verify(token, secret) as { sub: string };
}
