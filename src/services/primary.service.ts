// src/services/primary.service.ts — Lógica de negocio para Obras de Arte
import * as repo from '../repositories/primary.repository';
import type { CreatePrimaryDto, UpdatePrimaryDto } from '../schemas/primary.schema';

export async function getAll(page: number, limit: number, search?: string): Promise<repo.PaginatedResult<unknown>> {
  return repo.findAll(page, limit, search);
}

export async function getById(id: string): Promise<unknown> {
  return repo.findById(id);
}

export async function createPrimary(dto: CreatePrimaryDto): Promise<unknown> {
  return repo.create(dto);
}

export async function updatePrimary(id: string, dto: UpdatePrimaryDto): Promise<unknown> {
  return repo.update(id, dto);
}

export async function deletePrimary(id: string): Promise<void> {
  return repo.remove(id);
}

// Aliases para el dominio Museo
export const createArtwork = createPrimary;
export const updateArtwork = updatePrimary;
export const deleteArtwork = deletePrimary;
