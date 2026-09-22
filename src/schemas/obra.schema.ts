import { z } from 'zod';

// ============================================
// ESQUEMAS DE VALIDACIÓN ZOD (OBRA DE ARTE)
// ============================================

export const createObraSchema = z
  .object({
    titulo: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
    codigo: z.string().min(3, 'El código de inventario debe tener al menos 3 caracteres'),
    año: z.number().int('El año debe ser un número entero').optional(),
    anio: z.number().int('El año debe ser un número entero').optional(),
    tecnica: z.string().min(2, 'La técnica debe tener al menos 2 caracteres'),
    valorEstimado: z.number().nonnegative('El valor estimado no puede ser negativo'),
    estaExhibida: z.boolean().default(true),
  })
  .transform((data) => ({
    titulo: data.titulo,
    codigo: data.codigo,
    año: data.año ?? data.anio ?? 2026,
    tecnica: data.tecnica,
    valorEstimado: data.valorEstimado,
    estaExhibida: data.estaExhibida,
  }));

export const updateObraSchema = z.object({
  titulo: z.string().min(2).optional(),
  codigo: z.string().min(3).optional(),
  año: z.number().int().optional(),
  anio: z.number().int().optional(),
  tecnica: z.string().min(2).optional(),
  valorEstimado: z.number().nonnegative().optional(),
  estaExhibida: z.boolean().optional(),
}).transform((data) => {
  const res: Record<string, any> = { ...data };
  if (data.anio !== undefined && data.año === undefined) {
    res.año = data.anio;
    delete res.anio;
  }
  return res;
});

export type CreateObraDto = z.infer<typeof createObraSchema>;
export type UpdateObraDto = z.infer<typeof updateObraSchema>;
