import { AppError } from '../errors/AppError';
import type { CreateItemDto, UpdateItemDto } from '../types/index';
import type { IItem } from '../models/item.model';
import * as itemsRepo from '../repositories/items.repository';

// ============================================================
// SERVICIO DE OBRAS DE ARTE (LÓGICA DE NEGOCIO Y RBAC)
// ============================================================

export async function getAll(filter: Record<string, unknown> = {}): Promise<IItem[]> {
  return itemsRepo.findAllItems(filter);
}

export async function getById(id: string): Promise<IItem> {
  const item = await itemsRepo.findItemById(id);
  if (!item) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
  return item;
}

export async function create(dto: CreateItemDto, createdBy: string): Promise<IItem> {
  const existingCodigo = await itemsRepo.findItemByCodigo(dto.codigo);
  if (existingCodigo) {
    throw new AppError(409, `El código de inventario '${dto.codigo.toUpperCase()}' ya existe`);
  }

  return itemsRepo.createItem(dto, createdBy);
}

export async function update(
  id: string,
  dto: UpdateItemDto,
  requesterId: string,
  requesterRole: string,
): Promise<IItem> {
  const existing = await itemsRepo.findItemById(id);
  if (!existing) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }

  // Verificación de permisos: Solo el curador creador o un admin pueden modificar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Permisos insuficientes para modificar esta obra');
  }

  if (dto.codigo && dto.codigo.toUpperCase() !== existing.codigo) {
    const codeConflict = await itemsRepo.findItemByCodigo(dto.codigo);
    if (codeConflict && String(codeConflict._id) !== id) {
      throw new AppError(409, `El código de inventario '${dto.codigo.toUpperCase()}' ya está en uso`);
    }
  }

  const updated = await itemsRepo.updateItem(id, dto);
  if (!updated) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
  return updated;
}

export async function remove(
  id: string,
  requesterId: string,
  requesterRole: string,
): Promise<void> {
  const existing = await itemsRepo.findItemById(id);
  if (!existing) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }

  // Verificación de permisos: Solo el curador creador o un admin pueden eliminar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Permisos insuficientes para eliminar esta obra');
  }

  await itemsRepo.deleteItem(id);
}
