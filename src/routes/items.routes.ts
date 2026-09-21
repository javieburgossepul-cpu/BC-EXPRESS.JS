// src/routes/items.routes.ts — Definición de rutas CRUD para Obras de Arte
import { Router } from 'express';
import * as ctrl from '../controllers/items.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
