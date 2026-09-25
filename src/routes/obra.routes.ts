import { Router } from 'express';
import {
  getObras,
  getObraById,
  createObra,
  updateObra,
  deleteObra,
} from '../controllers/obra.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router: Router = Router();

// Rutas Públicas de catálogo
router.get('/', getObras);
router.get('/:id', getObraById);

// Rutas Protegidas de gestión
router.post('/', authMiddleware, createObra);
router.patch('/:id', authMiddleware, updateObra);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteObra);

export default router;
