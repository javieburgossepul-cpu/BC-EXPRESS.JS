import { ObraModel, IObra } from '../models/obra.model';
import { CreateObraDto, UpdateObraDto } from '../schemas/obra.schema';
import mongoose from 'mongoose';

// ============================================
// REPOSITORIO DE OBRAS DE ARTE
// ============================================

export async function findAll(): Promise<IObra[]> {
  return ObraModel.find().populate('creadoPor', 'name email role').sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IObra | null> {
  return ObraModel.findById(id).populate('creadoPor', 'name email role');
}

export async function findByCodigo(codigo: string): Promise<IObra | null> {
  return ObraModel.findOne({ codigo: codigo.toUpperCase().trim() });
}

export async function create(
  data: CreateObraDto,
  userId: string
): Promise<IObra> {
  const obra = await ObraModel.create({
    ...data,
    creadoPor: new mongoose.Types.ObjectId(userId),
  });
  return (await obra.populate('creadoPor', 'name email role')) as IObra;
}

export async function updateById(
  id: string,
  data: UpdateObraDto
): Promise<IObra | null> {
  return ObraModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('creadoPor', 'name email role');
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await ObraModel.findByIdAndDelete(id);
  return result !== null;
}
