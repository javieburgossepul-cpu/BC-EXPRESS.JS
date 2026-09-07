// ============================================
// CONTROLLER — Interfaz HTTP
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/items.service';
import { CreateItemDto, UpdateItemDto, ErrorResponse } from '../types';

// Obtener todas las obras
export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await service.findAll({ page, limit });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Obtener una obra por ID
export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const item = await service.findById(id);

    if (!item) {
      const response: ErrorResponse = {
        error: 'Not Found',
        message: 'Obra no encontrada',
      };

      res.status(404).json(response);
      return;
    }

    res.json({ data: item });
  } catch (err) {
    next(err);
  }
}

// Crear una obra
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dto = req.body as CreateItemDto;

    const item = await service.create(dto);

    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
}

// Actualizar una obra
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const dto = req.body as UpdateItemDto;

    const updated = await service.update(id, dto);

    if (!updated) {
      const response: ErrorResponse = {
        error: 'Not Found',
        message: 'Obra no encontrada',
      };

      res.status(404).json(response);
      return;
    }

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

// Eliminar una obra
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const removed = await service.remove(id);

    if (!removed) {
      const response: ErrorResponse = {
        error: 'Not Found',
        message: 'Obra no encontrada',
      };

      res.status(404).json(response);
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}