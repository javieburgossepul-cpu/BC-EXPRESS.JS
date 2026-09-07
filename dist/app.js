"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================
// APP — Configuración Express
// ============================================
const express_1 = __importDefault(require("express"));
const items_routes_1 = require("./routes/items.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', week: '03', project: 'api-arquitectura' });
});
// TODO: Cambia 'items' por la ruta de tu dominio (ej: 'books', 'medicines')
app.use('/api/v1/items', items_routes_1.itemsRouter);
// Error handler — no modificar
app.use((err, _req, res, _next) => {
    console.error(err.message);
    const response = {
        error: 'Internal Server Error',
        message: err.message,
    };
    res.status(500).json(response);
});
exports.default = app;
