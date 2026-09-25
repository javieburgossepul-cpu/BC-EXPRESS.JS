import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/items.controller';

export const itemsRouter: Router = Router();

itemsRouter.get('/', getAllHandler);
itemsRouter.get('/:id', getByIdHandler);
itemsRouter.post('/', authenticate, createHandler);
itemsRouter.put('/:id', authenticate, updateHandler);
itemsRouter.patch('/:id', authenticate, updateHandler);
itemsRouter.delete('/:id', authenticate, deleteHandler);

export const obraRouter = itemsRouter;
