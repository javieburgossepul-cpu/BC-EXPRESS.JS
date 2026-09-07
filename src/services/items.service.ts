// ============================================
// SERVICE — Lógica de negocio
// ============================================

import {
  CreateItemDto,
  UpdateItemDto,
  Item,
  PaginatedResponse,
  PaginationParams,
} from '../types';

import * as repo from '../repositories/items.repository';

// Obtener obras con paginación
export async function findAll(
  params: PaginationParams
): Promise<PaginatedResponse<Item>> {
  const { page, limit } = params;

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

// Buscar una obra por ID
export async function findById(
  id: number
): Promise<Item | undefined> {
  return repo.findById(id);
}

// Crear una obra
export async function create(
  dto: CreateItemDto
): Promise<Item> {
  return repo.create(dto);
}

// Actualizar una obra
export async function update(
  id: number,
  dto: UpdateItemDto
): Promise<Item | undefined> {
  const exists = await repo.findById(id);

  if (!exists) {
    return undefined;
  }

  return repo.update(id, dto);
}

// Eliminar una obra
export async function remove(
  id: number
): Promise<boolean> {
  const exists = await repo.findById(id);

  if (!exists) {
    return false;
  }

  return repo.remove(id);
}