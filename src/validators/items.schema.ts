import { z } from 'zod';

// ============================================================
// ESQUEMAS ZOD — DOMINIO MUSEO (OBRAS DE ARTE)
// ============================================================

function normalizeYear(copy: Record<string, unknown>): void {
  if (copy['año'] === undefined) {
    for (const key of Object.keys(copy)) {
      const k = key.toLowerCase();
      if (
        k === 'anio' ||
        k === 'ano' ||
        k === 'year' ||
        (k.startsWith('a') && k.endsWith('o') && k.length <= 4) ||
        (k.includes('ñ') && k.length <= 4)
      ) {
        copy['año'] = copy[key];
        break;
      }
    }
  }
  if (typeof copy['año'] === 'string') {
    copy['año'] = Number(copy['año']);
  }
}

export const createItemSchema = z.object({
  body: z.preprocess((rawBody: unknown) => {
    if (rawBody && typeof rawBody === 'object') {
      const copy = { ...(rawBody as Record<string, unknown>) };
      normalizeYear(copy);
      return copy;
    }
    return rawBody;
  }, z.object({
    titulo: z
      .string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres'),
    codigo: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(50, 'El código no puede exceder 50 caracteres'),
    año: z
      .number()
      .int('El año debe ser un número entero')
      .min(0, 'El año no puede ser negativo')
      .max(2100, 'El año no puede ser mayor a 2100'),
    tecnica: z
      .string()
      .min(2, 'La técnica debe tener al menos 2 caracteres')
      .max(200, 'La técnica no puede exceder 200 caracteres'),
    valorEstimado: z
      .number()
      .min(0, 'El valor estimado no puede ser negativo'),
    estaExhibida: z.boolean().optional().default(true),
  })),
});

export const updateItemSchema = z.object({
  body: z.preprocess((rawBody: unknown) => {
    if (rawBody && typeof rawBody === 'object') {
      const copy = { ...(rawBody as Record<string, unknown>) };
      normalizeYear(copy);
      return copy;
    }
    return rawBody;
  }, z.object({
    titulo: z
      .string()
      .min(2, 'El título debe tener al menos 2 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres')
      .optional(),
    codigo: z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres')
      .max(50, 'El código no puede exceder 50 caracteres')
      .optional(),
    año: z
      .number()
      .int('El año debe ser un número entero')
      .min(0, 'El año no puede ser negativo')
      .max(2100, 'El año no puede ser mayor a 2100')
      .optional(),
    tecnica: z
      .string()
      .min(2, 'La técnica debe tener al menos 2 caracteres')
      .max(200, 'La técnica no puede exceder 200 caracteres')
      .optional(),
    valorEstimado: z
      .number()
      .min(0, 'El valor estimado no puede ser negativo')
      .optional(),
    estaExhibida: z.boolean().optional(),
  })),
});

export const itemIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB inválido'),
  }),
});

// Aliases para el dominio Museo
export const createObraSchema = createItemSchema;
export const updateObraSchema = updateItemSchema;
export const obraIdSchema = itemIdSchema;
