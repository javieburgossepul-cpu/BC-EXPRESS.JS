// src/schemas/items.schema.ts — Validación Zod para el recurso Obras de Arte (Artworks)
import { z } from 'zod';

export const createArtworkSchema = z.object({
  title: z
    .string({ required_error: 'El título es requerido' })
    .min(1, 'El título no puede estar vacío')
    .max(200, 'El título no puede exceder 200 caracteres'),
  inventoryCode: z
    .string({ required_error: 'El código de inventario es requerido' })
    .min(3, 'El código de inventario debe tener al menos 3 caracteres')
    .max(50, 'El código de inventario no puede exceder 50 caracteres'),
  year: z
    .number({ required_error: 'El año es requerido' })
    .int('El año debe ser un número entero')
    .min(0, 'El año debe ser mayor o igual a 0')
    .max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  medium: z
    .string({ required_error: 'La técnica o medio es requerido' })
    .min(1, 'La técnica o medio no puede estar vacío')
    .max(150, 'La técnica no puede exceder 150 caracteres'),
  estimatedValue: z
    .number({ required_error: 'El valor estimado es requerido' })
    .positive('El valor estimado debe ser un número positivo'),
  isExhibited: z.boolean().default(true),
  artistId: z
    .number({ required_error: 'El ID del artista es requerido' })
    .int('El artistId debe ser un número entero')
    .positive('El artistId debe ser un ID positivo'),
});

export const updateArtworkSchema = createArtworkSchema.partial();

export type CreateArtworkDto = z.infer<typeof createArtworkSchema>;
export type UpdateArtworkDto = z.infer<typeof updateArtworkSchema>;

// Aliases genéricos para compatibilidad con interfaces base
export const createItemSchema = createArtworkSchema;
export const updateItemSchema = updateArtworkSchema;
export type CreateItemDto = CreateArtworkDto;
export type UpdateItemDto = UpdateArtworkDto;
