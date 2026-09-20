// ============================================
// CONFIG — logger de Winston + stream para Morgan
// ============================================
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

// Logger de Winston estructurado
export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: isDev
    ? format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize({ all: true }),
        format.printf(
          ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
        )
      )
    : format.combine(
        format.timestamp(),
        format.json()
      ),
  transports: [
    new transports.Console(),
    ...(isDev
      ? []
      : [
          new transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
        ]),
  ],
});

// Stream para conectar Morgan con Winston en nivel 'http'
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};

// Middleware de Morgan configurado con la stream de Winston
const morganFormat = isDev ? 'dev' : 'combined';
export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
