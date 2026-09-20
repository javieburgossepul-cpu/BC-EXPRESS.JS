// ============================================
// CONTROLLER — Controlador HTTP delgado (Thin Controller)
// ============================================
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/items.service';
import {
  createItemSchema,
  updateItemSchema,
  CreateItemDto,
  UpdateItemDto,
} from '../schemas/item.schema';
import { SingleResponse, PaginatedResponse } from '../types';

// Schema para validar parámetro :id
const idSchema = z.coerce.number().int({
  message: 'El id debe ser un número entero',
}).positive({
  message: 'El id debe ser un número positivo',
});

// Helper para formatear issues de Zod de forma consistente
function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'id',
    message: issue.message,
  }));
}

/**
 * GET /api/v1/obras (o /api/v1/items) — Listar con paginación
 */
export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.max(1, Number(req.query['limit']) || 10);

    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<typeof result.data[number]>);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/obras/:id — Obtener obra por ID
 */
export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro id inválido',
        issues: formatIssues(parsedId.error),
      });
      return;
    }

    const item = await service.findById(parsedId.data);
    res.json({ data: item } satisfies SingleResponse<typeof item>);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/obras — Crear nueva obra validando con Zod
 */
export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = createItemSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      });
      return;
    }

    const dto: CreateItemDto = result.data;
    const item = await service.create(dto);
    res.status(201).json({ data: item } satisfies SingleResponse<typeof item>);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/obras/:id — Actualizar obra existente
 */
export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro id inválido',
        issues: formatIssues(parsedId.error),
      });
      return;
    }

    const result = updateItemSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      });
      return;
    }

    const dto: UpdateItemDto = result.data;
    const item = await service.update(parsedId.data, dto);
    res.json({ data: item } satisfies SingleResponse<typeof item>);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/obras/:id — Eliminar obra por ID
 */
export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro id inválido',
        issues: formatIssues(parsedId.error),
      });
      return;
    }

    await service.remove(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
