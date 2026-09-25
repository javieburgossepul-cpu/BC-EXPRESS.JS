import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Manejo de errores de validación de Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Error de validación de datos',
      details: err.issues.map((issue) => ({
        campo: issue.path.filter((p) => p !== 'body').join('.'),
        mensaje: issue.message,
      })),
    });
    return;
  }

  // Manejo de errores operacionales de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Manejo de errores de unicidad de MongoDB (ej. código o email duplicado)
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'campo';
    res.status(409).json({
      error: `Conflicto: El valor para el campo '${field}' ya existe en el sistema`,
    });
    return;
  }

  // Manejo de errores de bloqueo por CORS
  if (err && typeof err.message === 'string' && err.message.startsWith('CORS blocked')) {
    res.status(403).json({ error: err.message });
    return;
  }

  // Error inesperado del servidor (sin filtrar stack traces en producción)
  console.error('Unhandled Server Error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(isProduction ? {} : { details: err?.message }),
  });
}
