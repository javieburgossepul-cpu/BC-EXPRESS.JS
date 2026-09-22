// src/schemas/primary.schema.ts — Validación Zod para Obras de Arte
import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(objectIdRegex, 'ID de artista inválido (debe ser un ObjectId válido)');

export const createPrimarySchema = z
  .object({
    titulo: z.string().min(1, 'El título es requerido').max(150, 'El título no puede exceder 150 caracteres'),
    codigoInventario: z.string().min(1, 'El código de inventario es requerido').max(50, 'El código de inventario no puede exceder 50 caracteres'),
    año: z.number().int('El año debe ser un número entero').min(0).max(new Date().getFullYear()).optional(),
    anio: z.number().int('El año debe ser un número entero').min(0).max(new Date().getFullYear()).optional(),
    tecnica: z.string().min(1, 'La técnica o medio es requerido').max(100, 'La técnica no puede exceder 100 caracteres'),
    valorEstimado: z.number().min(0, 'El valor estimado debe ser mayor o igual a 0'),
    enExhibicion: z.boolean().default(true),
    artista: z.string().regex(objectIdRegex, 'ID de artista inválido (debe ser un ObjectId válido)'),
  })
  .transform((data) => {
    const calculatedYear = data.año ?? data.anio ?? 1500;
    return {
      titulo: data.titulo,
      codigoInventario: data.codigoInventario,
      año: calculatedYear,
      tecnica: data.tecnica,
      valorEstimado: data.valorEstimado,
      enExhibicion: data.enExhibicion,
      artista: data.artista,
    };
  });

export const updatePrimarySchema = z
  .object({
    titulo: z.string().min(1).max(150).optional(),
    codigoInventario: z.string().min(1).max(50).optional(),
    año: z.number().int().min(0).max(new Date().getFullYear()).optional(),
    anio: z.number().int().min(0).max(new Date().getFullYear()).optional(),
    tecnica: z.string().min(1).max(100).optional(),
    valorEstimado: z.number().min(0).optional(),
    enExhibicion: z.boolean().optional(),
    artista: z.string().regex(objectIdRegex).optional(),
  })
  .transform((data) => {
    const res: Record<string, unknown> = { ...data };
    if (data.año !== undefined || data.anio !== undefined) {
      res['año'] = data.año ?? data.anio;
      delete res['anio'];
    }
    return res;
  });

export type CreatePrimaryDto = z.infer<typeof createPrimarySchema>;
export type UpdatePrimaryDto = z.infer<typeof updatePrimarySchema>;

export const createArtworkSchema = createPrimarySchema;
export const updateArtworkSchema = updatePrimarySchema;
export type CreateArtworkDto = CreatePrimaryDto;
export type UpdateArtworkDto = UpdatePrimaryDto;
