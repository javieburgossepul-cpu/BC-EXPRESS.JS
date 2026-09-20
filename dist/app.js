"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================
// APP — Configuración de Express
// Registra middlewares, rutas y manejo de errores en el orden correcto
// ============================================
const express_1 = __importDefault(require("express"));
const logger_1 = require("./config/logger");
const items_routes_1 = __importDefault(require("./routes/items.routes"));
const notFound_1 = require("./middlewares/notFound");
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// 1. Middlewares generales (parser JSON y logger de peticiones HTTP)
app.use(express_1.default.json());
app.use(logger_1.morganMiddleware);
// Endpoint de Health Check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// 2. Rutas del dominio (disponible como /api/v1/obras y /api/v1/items)
app.use('/api/v1/obras', items_routes_1.default);
app.use('/api/v1/items', items_routes_1.default);
// 3. Middleware 404 (para rutas no encontradas, después de todas las rutas)
app.use(notFound_1.notFound);
// 4. Middleware global de manejo de errores (último middleware, 4 parámetros)
app.use(errorHandler_1.errorHandler);
exports.default = app;
