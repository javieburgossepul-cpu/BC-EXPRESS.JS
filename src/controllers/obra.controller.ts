import { Request, Response, NextFunction } from 'express';
import * as obraService from '../services/obra.service';
import { createObraSchema, updateObraSchema } from '../schemas/obra.schema';

// ============================================
// CONTROLADOR DE OBRAS DE ARTE
// ============================================

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const obras = await obraService.getAll();
    res.status(200).json(obras);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const obra = await obraService.getById(id);
    res.status(200).json(obra);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createObraSchema.parse(req.body);
    const userId = req.user!.sub;
    const nuevaObra = await obraService.create(dto, userId);
    res.status(201).json(nuevaObra);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const dto = updateObraSchema.parse(req.body);
    const obraActualizada = await obraService.update(id, dto);
    res.status(200).json(obraActualizada);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    await obraService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
