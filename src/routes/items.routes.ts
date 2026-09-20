// ============================================
// ROUTES — Rutas del recurso del dominio (Obras / Items)
// ============================================
import { Router } from 'express';
import * as controller from '../controllers/items.controller';

const router = Router();

// Endpoints REST CRUD
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
