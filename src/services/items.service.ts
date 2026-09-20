// ============================================
// SERVICE — Lógica de negocio (Dominio: Museo)
// ============================================
import { Item, PaginatedResponse } from '../types';
import * as repo from '../repositories/items.repository';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

/**
 * Obtiene lista paginada de obras
 */
export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Item>> {
  const { page, limit } = opts;
  const all = await repo.findAll();

  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return {
    data,
    total: all.length,
    page,
    limit,
  };
}

/**
 * Busca una obra por su ID. Lanza 404 si no existe.
 */
export async function findById(id: number): Promise<Item> {
  const item = await repo.findById(id);
  if (!item) {
    throw new AppError(404, `Obra con id ${id} no encontrada`);
  }
  return item;
}

/**
 * Crea una nueva obra con validación de unicidad.
 */
export async function create(dto: repo.CreateItemRepoDto): Promise<Item> {
  const all = await repo.findAll();
  const duplicate = all.find(
    (item) =>
      item.titulo.toLowerCase() === dto.titulo.toLowerCase() &&
      item.artista.toLowerCase() === dto.artista.toLowerCase()
  );

  if (duplicate) {
    throw new AppError(
      409,
      `Ya existe una obra con el título '${dto.titulo}' del artista '${dto.artista}'`
    );
  }

  return repo.create(dto);
}

/**
 * Actualiza una obra existente. Lanza 404 si no existe.
 */
export async function update(
  id: number,
  dto: repo.UpdateItemRepoDto
): Promise<Item> {
  const exists = await repo.findById(id);
  if (!exists) {
    throw new AppError(404, `Obra con id ${id} no encontrada`);
  }

  const updated = await repo.update(id, dto);
  return updated!;
}

/**
 * Elimina una obra. Lanza 404 si no existe.
 */
export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) {
    throw new AppError(404, `Obra con id ${id} no encontrada`);
  }

  await repo.remove(id);
}
