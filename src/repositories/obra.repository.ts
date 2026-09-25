import { Obra, IObra } from '../models/obra.model.js';
import type { CreateObraDto, UpdateObraDto } from '../schemas/obra.schema.js';

export async function findAll(): Promise<IObra[]> {
  return Obra.find().sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IObra | null> {
  return Obra.findById(id);
}

export async function findByCodigo(codigo: string): Promise<IObra | null> {
  return Obra.findOne({ codigo: codigo.toUpperCase() });
}

export async function create(data: CreateObraDto, userId: string): Promise<IObra> {
  return Obra.create({
    ...data,
    creadoPor: userId,
  });
}

export async function updateById(id: string, data: UpdateObraDto): Promise<IObra | null> {
  return Obra.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteById(id: string): Promise<IObra | null> {
  return Obra.findByIdAndDelete(id);
}
