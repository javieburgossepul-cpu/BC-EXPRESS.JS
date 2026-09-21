// src/repositories/items.repository.ts — Acceso a datos con Prisma para Obras de Arte
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { CreateArtworkDto, UpdateArtworkDto } from '../schemas/items.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function findAll(page: number, limit: number): Promise<PaginatedResult<unknown>> {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.artwork.findMany({
      skip,
      take: limit,
      include: {
        artist: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.artwork.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
}

export async function findById(id: number): Promise<unknown | null> {
  return prisma.artwork.findUnique({
    where: { id },
    include: {
      artist: true,
    },
  });
}

export async function create(data: CreateArtworkDto): Promise<unknown> {
  try {
    return await prisma.artwork.create({
      data,
      include: {
        artist: true,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(409, 'Ya existe una obra de arte con ese código de inventario');
      }
      if (error.code === 'P2003') {
        throw new AppError(404, 'El artista asociado no existe');
      }
    }
    throw error;
  }
}

export async function update(id: number, data: UpdateArtworkDto): Promise<unknown> {
  try {
    return await prisma.artwork.update({
      where: { id },
      data,
      include: {
        artist: true,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError(404, 'Obra de arte no encontrada');
      }
      if (error.code === 'P2002') {
        throw new AppError(409, 'Ya existe una obra de arte con ese código de inventario');
      }
      if (error.code === 'P2003') {
        throw new AppError(404, 'El artista asociado no existe');
      }
    }
    throw error;
  }
}

export async function remove(id: number): Promise<void> {
  try {
    await prisma.artwork.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new AppError(404, 'Obra de arte no encontrada');
      }
    }
    throw error;
  }
}
