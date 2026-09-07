"use strict";
// ============================================
// CONTROLLER — Interfaz HTTP
// ============================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const service = __importStar(require("../services/items.service"));
// Obtener todas las obras
async function getAll(req, res, next) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await service.findAll({ page, limit });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
// Obtener una obra por ID
async function getById(req, res, next) {
    try {
        const id = Number(req.params.id);
        const item = await service.findById(id);
        if (!item) {
            const response = {
                error: 'Not Found',
                message: 'Obra no encontrada',
            };
            res.status(404).json(response);
            return;
        }
        res.json({ data: item });
    }
    catch (err) {
        next(err);
    }
}
// Crear una obra
async function create(req, res, next) {
    try {
        const dto = req.body;
        const item = await service.create(dto);
        res.status(201).json({ data: item });
    }
    catch (err) {
        next(err);
    }
}
// Actualizar una obra
async function update(req, res, next) {
    try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updated = await service.update(id, dto);
        if (!updated) {
            const response = {
                error: 'Not Found',
                message: 'Obra no encontrada',
            };
            res.status(404).json(response);
            return;
        }
        res.json({ data: updated });
    }
    catch (err) {
        next(err);
    }
}
// Eliminar una obra
async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);
        const removed = await service.remove(id);
        if (!removed) {
            const response = {
                error: 'Not Found',
                message: 'Obra no encontrada',
            };
            res.status(404).json(response);
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
