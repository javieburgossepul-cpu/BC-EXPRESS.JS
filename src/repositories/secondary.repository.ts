// src/repositories/secondary.repository.ts — Acceso a datos para Artistas
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Artist } from '../models/secondary.model';
import { AppError } from '../errors/AppError';
import type { CreateSecondaryDto, UpdateSecondaryDto } from '../schemas/secondary.schema';

export async function findAll(): Promise<unknown[]> {
  return Artist.find().sort({ nombre: 1 }).lean();
}

export async function findById(id: string): Promise<unknown> {
  try {
    const item = await Artist.findById(id).lean();
    if (!item) {
      throw new AppError(404, 'Artista no encontrado');
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

export async function create(dto: CreateSecondaryDto): Promise<unknown> {
  try {
    const item = await Artist.create(dto);
    return item.toJSON();
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new AppError(409, 'Ya existe un artista con ese nombre');
    }
    throw error;
  }
}

export async function update(id: string, dto: UpdateSecondaryDto): Promise<unknown> {
  try {
    const item = await Artist.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();

    if (!item) {
      throw new AppError(404, 'Artista no encontrado');
    }
    return item;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new AppError(409, 'Ya existe un artista con ese nombre');
    }
    throw error;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const item = await Artist.findByIdAndDelete(id).lean();
    if (!item) {
      throw new AppError(404, 'Artista no encontrado');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw error;
  }
}
