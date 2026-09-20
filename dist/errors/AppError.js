"use strict";
// ============================================
// ERRORS — AppError (clase de errores operacionales)
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.isAppError = isAppError;
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Ajuste necesario en TypeScript / V8 al extender la clase nativa Error
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Función type-guard para verificar si un error es instancia de AppError
 */
function isAppError(err) {
    return err instanceof AppError;
}
