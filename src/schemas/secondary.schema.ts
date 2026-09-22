// src/schemas/secondary.schema.ts — Validación Zod para Artistas
import { z } from 'zod';

export const createSecondarySchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  nacionalidad: z.string().max(100).optional(),
  añoNacimiento: z.number().int().min(0).max(new Date().getFullYear()).optional(),
});

export const updateSecondarySchema = createSecondarySchema.partial();

export type CreateSecondaryDto = z.infer<typeof createSecondarySchema>;
export type UpdateSecondaryDto = z.infer<typeof updateSecondarySchema>;

export const createArtistSchema = createSecondarySchema;
export const updateArtistSchema = updateSecondarySchema;
export type CreateArtistDto = CreateSecondaryDto;
export type UpdateArtistDto = UpdateSecondaryDto;
