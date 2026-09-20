"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateObraSchema = exports.createObraSchema = exports.updateItemSchema = exports.createItemSchema = void 0;
// ============================================
// SCHEMAS — Dominio: Museo / Obras de Arte
// ============================================
const zod_1 = require("zod");
// Schema para crear una nueva obra
exports.createItemSchema = zod_1.z.object({
    titulo: zod_1.z
        .string()
        .min(1, 'El título es obligatorio')
        .trim(),
    artista: zod_1.z
        .string()
        .min(1, 'El artista es obligatorio')
        .trim(),
    anio: zod_1.z
        .number({ message: 'El año debe ser un número' })
        .int('El año debe ser un número entero'),
    sala: zod_1.z
        .string()
        .min(1, 'La sala es obligatoria')
        .trim(),
    valorEstimado: zod_1.z
        .number({ message: 'El valor estimado debe ser un número' })
        .positive('El valor estimado debe ser mayor a 0'),
    tecnica: zod_1.z
        .string()
        .min(1, 'La técnica no puede estar vacía')
        .trim()
        .default('Óleo sobre lienzo'),
    disponible: zod_1.z.boolean().default(true),
});
// Schema para actualizar una obra (todos los campos opcionales)
exports.updateItemSchema = exports.createItemSchema.partial();
// Alias descriptivos del dominio
exports.createObraSchema = exports.createItemSchema;
exports.updateObraSchema = exports.updateItemSchema;
