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
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const repo = __importStar(require("../repositories/items.repository"));
const AppError_1 = require("../errors/AppError");
/**
 * Obtiene lista paginada de obras
 */
async function findAll(opts) {
    const { page, limit } = opts;
    const all = await repo.findAll();
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    return {
        data,
        total: all.length,
        page,
        limit,
    };
}
/**
 * Busca una obra por su ID. Lanza 404 si no existe.
 */
async function findById(id) {
    const item = await repo.findById(id);
    if (!item) {
        throw new AppError_1.AppError(404, `Obra con id ${id} no encontrada`);
    }
    return item;
}
/**
 * Crea una nueva obra con validación de unicidad.
 */
async function create(dto) {
    const all = await repo.findAll();
    const duplicate = all.find((item) => item.titulo.toLowerCase() === dto.titulo.toLowerCase() &&
        item.artista.toLowerCase() === dto.artista.toLowerCase());
    if (duplicate) {
        throw new AppError_1.AppError(409, `Ya existe una obra con el título '${dto.titulo}' del artista '${dto.artista}'`);
    }
    return repo.create(dto);
}
/**
 * Actualiza una obra existente. Lanza 404 si no existe.
 */
async function update(id, dto) {
    const exists = await repo.findById(id);
    if (!exists) {
        throw new AppError_1.AppError(404, `Obra con id ${id} no encontrada`);
    }
    const updated = await repo.update(id, dto);
    return updated;
}
/**
 * Elimina una obra. Lanza 404 si no existe.
 */
async function remove(id) {
    const exists = await repo.findById(id);
    if (!exists) {
        throw new AppError_1.AppError(404, `Obra con id ${id} no encontrada`);
    }
    await repo.remove(id);
}
