import { IObra } from '../models/obra.model';
import * as obraRepository from '../repositories/obra.repository';
import { CreateObraDto, UpdateObraDto } from '../schemas/obra.schema';
import { AppError } from '../errors/AppError';
import mongoose from 'mongoose';

// ============================================
// SERVICIO DE OBRAS DE ARTE
// ============================================

export async function getAll(): Promise<IObra[]> {
  return obraRepository.findAll();
}

export async function getById(id: string): Promise<IObra> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'ID de obra inválido');
  }
  const obra = await obraRepository.findById(id);
  if (!obra) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
  return obra;
}

export async function create(
  dto: CreateObraDto,
  userId: string
): Promise<IObra> {
  const existing = await obraRepository.findByCodigo(dto.codigo);
  if (existing) {
    throw new AppError(409, `Ya existe una obra con el código '${dto.codigo.toUpperCase()}'`);
  }
  return obraRepository.create(dto, userId);
}

export async function update(
  id: string,
  dto: UpdateObraDto
): Promise<IObra> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'ID de obra inválido');
  }

  if (dto.codigo) {
    const existing = await obraRepository.findByCodigo(dto.codigo);
    if (existing && existing._id.toString() !== id) {
      throw new AppError(409, `Ya existe otra obra con el código '${dto.codigo.toUpperCase()}'`);
    }
  }

  const updated = await obraRepository.updateById(id, dto);
  if (!updated) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
  return updated;
}

export async function remove(id: string): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'ID de obra inválido');
  }
  const deleted = await obraRepository.deleteById(id);
  if (!deleted) {
    throw new AppError(404, 'Obra de arte no encontrada');
  }
}
