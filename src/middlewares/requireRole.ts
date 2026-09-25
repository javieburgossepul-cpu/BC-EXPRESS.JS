import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../errors/AppError.js';

// requireRole es una función de orden superior que retorna un RequestHandler.
// Verifica req.user.role contra la lista de roles permitidos.
// SIEMPRE debe ejecutarse después de authMiddleware (requiere req.user poblado).
export function requireRole(...roles: string[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Autenticación requerida'));
    }

    if (!roles.includes(req.user.role as string)) {
      return next(
        new AppError(403, `Acceso denegado. Roles requeridos: ${roles.join(', ')}`)
      );
    }

    next();
  };
}
