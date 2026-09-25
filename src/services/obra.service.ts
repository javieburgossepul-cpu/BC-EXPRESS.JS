import { Obra, IObra } from '../models/obra.model.js';
import type { CreateObraDto, UpdateObraDto } from '../schemas/obra.schema.js';
import { AppError } from '../errors/AppError.js';

// =======================================================
// SERVICIO DE OBRAS DE ARTE (LÓGICA DE NEGOCIO Y RBAC)
// =======================================================

export async function findAll(): Promise<IObra[]> {
  return Obra.find().sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IObra | null> {
  return Obra.findById(id);
}

export async function create(data: CreateObraDto, userId: string): Promise<IObra> {
  return Obra.create({
    ...data,
    creadoPor: userId,
  });
}

export async function update(
  id: string,
  data: UpdateObraDto,
  requesterId: string,
  requesterRole: string
): Promise<IObra | null> {
  const obra = await Obra.findById(id);
  if (!obra) return null;

  // Verificación de permisos (RBAC a nivel de recurso):
  // Un usuario regular solo puede modificar sus propias obras; el admin puede modificar cualquier obra.
  const creadorId = obra.creadoPor ? obra.creadoPor.toString() : '';
  if (requesterRole !== 'admin' && creadorId !== requesterId) {
    throw new AppError(
      403,
      'Acceso denegado: Solo puedes modificar las obras creadas por tu usuario o disponer de rol administrador'
    );
  }

  return Obra.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IObra | null> {
  return Obra.findByIdAndDelete(id);
}
