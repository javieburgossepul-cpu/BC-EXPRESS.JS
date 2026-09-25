import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { AppError } from '../errors/AppError.js';

const isProduction = process.env.NODE_ENV === 'production';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body?.body ? req.body : { body: req.body });
    if (!parsed.success) {
      throw parsed.error;
    }

    const user = await authService.register(parsed.data.body);
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body?.body ? req.body : { body: req.body });
    if (!parsed.success) {
      throw parsed.error;
    }

    const result = await authService.login(parsed.data.body);

    // Guardar tokens en cookies HttpOnly seguras
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      accessToken: result.accessToken,
      role: result.role,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token =
      (req.cookies?.refreshToken as string | undefined) ||
      (req.body?.refreshToken as string | undefined);

    if (!token) {
      throw new AppError(401, 'Refresh token no encontrado');
    }

    const tokens = await authService.refreshTokens(token);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Tokens renovados exitosamente',
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    await authService.logout(req.user.sub);

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const user = await authService.getMe(req.user.sub);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}
