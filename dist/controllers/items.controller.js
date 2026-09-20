"use strict";
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
const zod_1 = require("zod");
const service = __importStar(require("../services/items.service"));
const item_schema_1 = require("../schemas/item.schema");
// Schema para validar parámetro :id
const idSchema = zod_1.z.coerce.number().int({
    message: 'El id debe ser un número entero',
}).positive({
    message: 'El id debe ser un número positivo',
});
// Helper para formatear issues de Zod de forma consistente
function formatIssues(error) {
    return error.issues.map((issue) => ({
        field: issue.path.join('.') || 'id',
        message: issue.message,
    }));
}
/**
 * GET /api/v1/obras (o /api/v1/items) — Listar con paginación
 */
async function getAll(req, res, next) {
    try {
        const page = Math.max(1, Number(req.query['page']) || 1);
        const limit = Math.max(1, Number(req.query['limit']) || 10);
        const result = await service.findAll({ page, limit });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
/**
 * GET /api/v1/obras/:id — Obtener obra por ID
 */
async function getById(req, res, next) {
    try {
        const parsedId = idSchema.safeParse(req.params['id']);
        if (!parsedId.success) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Parámetro id inválido',
                issues: formatIssues(parsedId.error),
            });
            return;
        }
        const item = await service.findById(parsedId.data);
        res.json({ data: item });
    }
    catch (err) {
        next(err);
    }
}
/**
 * POST /api/v1/obras — Crear nueva obra validando con Zod
 */
async function create(req, res, next) {
    try {
        const result = item_schema_1.createItemSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Datos de entrada inválidos',
                issues: formatIssues(result.error),
            });
            return;
        }
        const dto = result.data;
        const item = await service.create(dto);
        res.status(201).json({ data: item });
    }
    catch (err) {
        next(err);
    }
}
/**
 * PUT /api/v1/obras/:id — Actualizar obra existente
 */
async function update(req, res, next) {
    try {
        const parsedId = idSchema.safeParse(req.params['id']);
        if (!parsedId.success) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Parámetro id inválido',
                issues: formatIssues(parsedId.error),
            });
            return;
        }
        const result = item_schema_1.updateItemSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Datos de entrada inválidos',
                issues: formatIssues(result.error),
            });
            return;
        }
        const dto = result.data;
        const item = await service.update(parsedId.data, dto);
        res.json({ data: item });
    }
    catch (err) {
        next(err);
    }
}
/**
 * DELETE /api/v1/obras/:id — Eliminar obra por ID
 */
async function remove(req, res, next) {
    try {
        const parsedId = idSchema.safeParse(req.params['id']);
        if (!parsedId.success) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Parámetro id inválido',
                issues: formatIssues(parsedId.error),
            });
            return;
        }
        await service.remove(parsedId.data);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
