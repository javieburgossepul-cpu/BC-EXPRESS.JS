// ============================================
// ROUTES — Mapeo de URLs a controllers
// ============================================

import { Router } from 'express';
import * as controller from '../controllers/items.controller';

export const itemsRouter = Router();

// Obtener todas las obras
itemsRouter.get('/', controller.getAll);

// Obtener una obra por ID
itemsRouter.get('/:id', controller.getById);

// Crear una obra
itemsRouter.post('/', controller.create);

// Actualizar una obra
itemsRouter.put('/:id', controller.update);

// Eliminar una obra
itemsRouter.delete('/:id', controller.remove);