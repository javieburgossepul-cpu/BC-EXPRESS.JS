// ============================================
// ERRORS — AppError (clase de errores operacionales)
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Ajuste necesario en TypeScript / V8 al extender la clase nativa Error
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Función type-guard para verificar si un error es instancia de AppError
 */
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
