// src/repositories/primary.repository.ts — Acceso a datos para Obras de Arte con populate('artista')
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Artwork } from '../models/primary.model';
import { AppError } from '../errors/AppError';
import type { CreatePrimaryDto, UpdatePrimaryDto } from '../schemas/primary.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<unknown>> {
  const skip = (page - 1) * limit;
  const filter = search ? { titulo: { $regex: search, $options: 'i' } } : {};

  const [data, total] = await Promise.all([
    Artwork.find(filter)
      .populate('artista')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Artwork.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function findById(id: string): Promise<unknown> {
  try {
    const item = await Artwork.findById(id).populate('artista').lean();
    if (!item) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }
    return item;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw error;
  }
}

export async function create(dto: CreatePrimaryDto): Promise<unknown> {
  try {
    const created = await Artwork.create(dto);
    const populated = await created.populate('artista');
    return populated.toJSON();
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new AppError(409, 'Ya existe una obra de arte con ese código de inventario');
    }
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID de artista inválido');
    }
    throw error;
  }
}

export async function update(id: string, dto: UpdatePrimaryDto): Promise<unknown> {
  try {
    const item = await Artwork.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate('artista')
      .lean();

    if (!item) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }
    return item;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new AppError(409, 'Ya existe una obra de arte con ese código de inventario');
    }
    throw error;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const item = await Artwork.findByIdAndDelete(id).lean();
    if (!item) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw error;
  }
}
