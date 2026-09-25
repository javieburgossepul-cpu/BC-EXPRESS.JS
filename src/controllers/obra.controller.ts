import { Request, Response, NextFunction } from 'express';
import * as obraService from '../services/obra.service.js';
import { createObraSchema, updateObraSchema } from '../schemas/obra.schema.js';
import { AppError } from '../errors/AppError.js';

// =======================================================
// CONTROLADOR DE OBRAS DE ARTE (DOMINIO: MUSEO)
// =======================================================

export async function getObras(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const obras = await obraService.findAll();
    res.json({
      status: 'success',
      total: obras.length,
      data: obras,
    });
  } catch (err) {
    next(err);
  }
}

export async function getObraById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const obra = await obraService.findById(req.params.id);
    if (!obra) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }
    res.json({
      status: 'success',
      data: obra,
    });
  } catch (err) {
    next(err);
  }
}

export async function createObra(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const parsed = createObraSchema.safeParse(
      req.body?.body ? req.body : { body: req.body }
    );
    if (!parsed.success) {
      throw parsed.error;
    }

    const obra = await obraService.create(parsed.data.body, req.user.sub);
    res.status(201).json({
      message: 'Obra de arte registrada exitosamente',
      data: obra,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateObra(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const parsed = updateObraSchema.safeParse(
      req.body?.body ? req.body : { body: req.body }
    );
    if (!parsed.success) {
      throw parsed.error;
    }

    const obra = await obraService.update(
      req.params.id,
      parsed.data.body,
      req.user.sub,
      req.user.role as string
    );

    if (!obra) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }

    res.json({
      message: 'Obra de arte actualizada exitosamente',
      data: obra,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteObra(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const obra = await obraService.remove(req.params.id);
    if (!obra) {
      throw new AppError(404, 'Obra de arte no encontrada');
    }
    res.json({
      message: 'Obra de arte eliminada exitosamente del inventario',
    });
  } catch (err) {
    next(err);
  }
}

// Aliases para compatibilidad
export const getAll = getObras;
export const getById = getObraById;
export const create = createObra;
export const update = updateObra;
export const remove = deleteObra;
