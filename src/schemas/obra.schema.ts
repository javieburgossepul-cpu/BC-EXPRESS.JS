import { z } from 'zod';

// =======================================================
// ESQUEMAS DE VALIDACIÓN ZOD (OBRAS DE ARTE - MUSEO)
// =======================================================

export const createObraSchema = z.object({
  body: z.object({
    titulo: z
      .string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres')
      .regex(/^[^<>]*$/, 'El título no debe contener caracteres HTML'),
    codigo: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(50, 'El código no puede exceder 50 caracteres')
      .regex(/^[^<>]*$/, 'El código no debe contener caracteres HTML'),
    año: z
      .number()
      .int('El año debe ser un número entero')
      .min(0, 'El año no puede ser un número negativo')
      .max(2100, 'El año no puede ser mayor a 2100'),
    tecnica: z
      .string()
      .min(2, 'La técnica debe tener al menos 2 caracteres')
      .max(200, 'La técnica no puede exceder 200 caracteres')
      .regex(/^[^<>]*$/, 'La técnica no debe contener caracteres HTML'),
    valorEstimado: z
      .number()
      .min(0, 'El valor estimado no puede ser negativo'),
    estaExhibida: z.boolean().optional().default(true),
  }),
});

export const updateObraSchema = z.object({
  body: z.object({
    titulo: z
      .string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres')
      .regex(/^[^<>]*$/, 'El título no debe contener caracteres HTML')
      .optional(),
    codigo: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(50, 'El código no puede exceder 50 caracteres')
      .regex(/^[^<>]*$/, 'El código no debe contener caracteres HTML')
      .optional(),
    año: z
      .number()
      .int('El año debe ser un número entero')
      .min(0, 'El año no puede ser un número negativo')
      .max(2100, 'El año no puede ser mayor a 2100')
      .optional(),
    tecnica: z
      .string()
      .min(2, 'La técnica debe tener al menos 2 caracteres')
      .max(200, 'La técnica no puede exceder 200 caracteres')
      .regex(/^[^<>]*$/, 'La técnica no debe contener caracteres HTML')
      .optional(),
    valorEstimado: z
      .number()
      .min(0, 'El valor estimado no puede ser negativo')
      .optional(),
    estaExhibida: z.boolean().optional(),
  }),
});

export type CreateObraDto = z.infer<typeof createObraSchema>['body'];
export type UpdateObraDto = z.infer<typeof updateObraSchema>['body'];
