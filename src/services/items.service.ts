// src/services/items.service.ts — Lógica de negocio para Obras de Arte
import * as repo from '../repositories/items.repository';
import { AppError } from '../errors/AppError';
import { CreateArtworkDto, UpdateArtworkDto } from '../schemas/items.schema';

export async function listArtworks(page: number, limit: number): Promise<repo.PaginatedResult<unknown>> {
  return repo.findAll(page, limit);
}

export async function getArtwork(id: number): Promise<unknown> {
  const artwork = await repo.findById(id);
  if (!artwork) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
  return artwork;
}

export async function createArtwork(data: CreateArtworkDto): Promise<unknown> {
  return repo.create(data);
}

export async function updateArtwork(id: number, data: UpdateArtworkDto): Promise<unknown> {
  return repo.update(id, data);
}

export async function deleteArtwork(id: number): Promise<void> {
  return repo.remove(id);
}

// Aliases para compatibilidad con firmas de items
export const listItems = listArtworks;
export const getItem = getArtwork;
export const createItem = createArtwork;
export const updateItem = updateArtwork;
export const deleteItem = deleteArtwork;
