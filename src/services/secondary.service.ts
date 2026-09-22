// src/services/secondary.service.ts — Lógica de negocio para Artistas
import * as repo from '../repositories/secondary.repository';
import type { CreateSecondaryDto, UpdateSecondaryDto } from '../schemas/secondary.schema';

export async function getAll(): Promise<unknown[]> {
  return repo.findAll();
}

export async function getById(id: string): Promise<unknown> {
  return repo.findById(id);
}

export async function createSecondary(dto: CreateSecondaryDto): Promise<unknown> {
  return repo.create(dto);
}

export async function updateSecondary(id: string, dto: UpdateSecondaryDto): Promise<unknown> {
  return repo.update(id, dto);
}

export async function deleteSecondary(id: string): Promise<void> {
  return repo.remove(id);
}

// Aliases para el dominio Museo
export const createArtist = createSecondary;
export const updateArtist = updateSecondary;
export const deleteArtist = deleteSecondary;
