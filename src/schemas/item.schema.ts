// ============================================
// SCHEMAS — Dominio: Museo / Obras de Arte
// ============================================
import { z } from 'zod';

// Schema para crear una nueva obra
export const createItemSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es obligatorio')
    .trim(),
  artista: z
    .string()
    .min(1, 'El artista es obligatorio')
    .trim(),
  anio: z
    .number({ message: 'El año debe ser un número' })
    .int('El año debe ser un número entero'),
  sala: z
    .string()
    .min(1, 'La sala es obligatoria')
    .trim(),
  valorEstimado: z
    .number({ message: 'El valor estimado debe ser un número' })
    .positive('El valor estimado debe ser mayor a 0'),
  tecnica: z
    .string()
    .min(1, 'La técnica no puede estar vacía')
    .trim()
    .default('Óleo sobre lienzo'),
  disponible: z.boolean().default(true),
});

// Schema para actualizar una obra (todos los campos opcionales)
export const updateItemSchema = createItemSchema.partial();

// Inferencia de tipos desde los schemas de Zod (Single Source of Truth)
export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;

// Alias descriptivos del dominio
export const createObraSchema = createItemSchema;
export const updateObraSchema = updateItemSchema;
export type CreateObraDto = CreateItemDto;
export type UpdateObraDto = UpdateItemDto;
