// src/controllers/secondary.controller.ts — Capa HTTP para Artistas
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/secondary.service';
import {
  createSecondarySchema,
  updateSecondarySchema,
} from '../schemas/secondary.schema';
import { objectIdSchema } from '../schemas/primary.schema';
import { AppError } from '../errors/AppError';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await service.getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de artista inválido');
    }

    const item = await service.getById(parsedId.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSecondarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de validación inválidos',
        errors: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }

    const item = await service.createSecondary(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de artista inválido');
    }

    const parsed = updateSecondarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de validación inválidos',
        errors: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }

    if (Object.keys(parsed.data).length === 0) {
      res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar' });
      return;
    }

    const item = await service.updateSecondary(parsedId.data, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de artista inválido');
    }

    await service.deleteSecondary(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
