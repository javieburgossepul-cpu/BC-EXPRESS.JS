// src/controllers/items.controller.ts — Capa HTTP para Obras de Arte
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/items.service';
import { createArtworkSchema, updateArtworkSchema } from '../schemas/items.schema';
import { AppError } from '../errors/AppError';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawPage = Number(req.query['page']);
    const rawLimit = Number(req.query['limit']);

    const page = !isNaN(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(100, Math.floor(rawLimit)) : 10;

    const result = await service.listArtworks(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (isNaN(id) || id <= 0) {
      throw new AppError(400, 'El parámetro ID debe ser un número entero positivo');
    }

    const item = await service.getArtwork(id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createArtworkSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: 'error',
        message: 'Datos de validación inválidos',
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    const created = await service.createArtwork(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (isNaN(id) || id <= 0) {
      throw new AppError(400, 'El parámetro ID debe ser un número entero positivo');
    }

    const parsed = updateArtworkSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: 'error',
        message: 'Datos de validación inválidos',
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({
        status: 'error',
        message: 'Debe proporcionar al menos un campo para actualizar',
      });
      return;
    }

    const updated = await service.updateArtwork(id, parsed.data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (isNaN(id) || id <= 0) {
      throw new AppError(400, 'El parámetro ID debe ser un número entero positivo');
    }

    await service.deleteArtwork(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
