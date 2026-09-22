// src/controllers/primary.controller.ts — Capa HTTP para Obras de Arte
import { Request, Response, NextFunction } from 'express';
import * as service from '../services/primary.service';
import {
  createPrimarySchema,
  updatePrimarySchema,
  objectIdSchema,
} from '../schemas/primary.schema';
import { AppError } from '../errors/AppError';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawPage = Number(req.query['page']);
    const rawLimit = Number(req.query['limit']);

    const page = !isNaN(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
    const limit = !isNaN(rawLimit) && rawLimit > 0 ? Math.min(100, Math.floor(rawLimit)) : 10;
    const search = typeof req.query['search'] === 'string' ? req.query['search'] : undefined;

    const result = await service.getAll(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de obra inválido (debe ser un ObjectId válido)');
    }

    const item = await service.getById(parsedId.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createPrimarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de validación inválidos',
        errors: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }

    const item = await service.createPrimary(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de obra inválido (debe ser un ObjectId válido)');
    }

    const parsed = updatePrimarySchema.safeParse(req.body);
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

    const item = await service.updatePrimary(parsedId.data, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      throw new AppError(400, 'ID de obra inválido (debe ser un ObjectId válido)');
    }

    await service.deletePrimary(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
