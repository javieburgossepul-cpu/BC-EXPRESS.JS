"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganMiddleware = exports.morganStream = exports.logger = void 0;
// ============================================
// CONFIG — logger de Winston + stream para Morgan
// ============================================
const winston_1 = require("winston");
const morgan_1 = __importDefault(require("morgan"));
const isDev = process.env['NODE_ENV'] !== 'production';
// Logger de Winston estructurado
exports.logger = (0, winston_1.createLogger)({
    level: isDev ? 'http' : 'warn',
    format: isDev
        ? winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.colorize({ all: true }), winston_1.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`))
        : winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.Console(),
        ...(isDev
            ? []
            : [
                new winston_1.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
            ]),
    ],
});
// Stream para conectar Morgan con Winston en nivel 'http'
exports.morganStream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
// Middleware de Morgan configurado con la stream de Winston
const morganFormat = isDev ? 'dev' : 'combined';
exports.morganMiddleware = (0, morgan_1.default)(morganFormat, { stream: exports.morganStream });
