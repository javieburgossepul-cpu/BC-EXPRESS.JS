"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const AppError_1 = require("../errors/AppError");
const logger_1 = require("../config/logger");
function errorHandler(err, _req, res, _next) {
    // 1. Errores de validación de Zod -> 400
    if (err instanceof zod_1.ZodError) {
        const issues = err.issues.map((issue) => ({
            field: issue.path.join('.') || 'body',
            message: issue.message,
        }));
        logger_1.logger.warn(`Validation Error: ${JSON.stringify(issues)}`);
        res.status(400).json({
            error: 'Validation Error',
            message: 'Datos de entrada inválidos',
            issues,
        });
        return;
    }
    // 2. Errores operacionales controlados (AppError)
    if (err instanceof AppError_1.AppError) {
        logger_1.logger.warn(`AppError [${err.statusCode}]: ${err.message}`);
        const errorType = err.statusCode === 404
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
    logger_1.logger.error(`Unhandled Error: ${err instanceof Error ? err.stack ?? err.message : String(err)}`);
    res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage,
        ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
    });
}
