"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
const AppError_1 = require("../errors/AppError");
function notFound(req, _res, next) {
    next(new AppError_1.AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
