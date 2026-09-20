// ============================================
// MIDDLEWARES — errorHandler (4 parámetros obligatorios)
// ============================================
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Errores de validación de Zod -> 400
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join('.') || 'body',
      message: issue.message,
    }));

    logger.warn(`Validation Error: ${JSON.stringify(issues)}`);

    res.status(400).json({
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues,
    });
    return;
  }

  // 2. Errores operacionales controlados (AppError)
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.statusCode}]: ${err.message}`);

    const errorType =
      err.statusCode === 404
        ? 'Not Found'
        : err.statusCode === 400
        ? 'Bad Request'
        : err.statusCode === 409
        ? 'Conflict'
        : err.statusCode >= 500
        ? 'Internal Server Error'
        : 'Application Error';

    res.status(err.statusCode).json({
      error: errorType,
      message: err.message,
    });
    return;
  }

  // 3. Errores inesperados / no controlados -> 500
  const isProduction = process.env['NODE_ENV'] === 'production';
  const errorMessage = isProduction
    ? 'Error interno del servidor'
    : err instanceof Error
    ? err.message
    : 'Error desconocido';

  logger.error(
    `Unhandled Error: ${err instanceof Error ? err.stack ?? err.message : String(err)}`
  );

  res.status(500).json({
    error: 'Internal Server Error',
    message: errorMessage,
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
