import { Router } from 'express';
import * as obraController from '../controllers/obra.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================
// RUTAS DE OBRAS DE ARTE (DOMINIO: MUSEO)
// ============================================
// Todas las rutas están protegidas con authMiddleware
// ============================================

const router: Router = Router();

// Middleware de autenticación para todas las operaciones de obras
router.use(authMiddleware);

router.get('/', obraController.getAll);
router.get('/:id', obraController.getById);
router.post('/', obraController.create);
router.patch('/:id', obraController.update);
router.delete('/:id', obraController.remove);

export default router;
