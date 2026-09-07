import { Router } from 'express';
import * as store from '../store.js';
import type { CreateItemDto, UpdateItemDto } from '../types.js';

export const itemsRouter = Router();

// GET /items — Listar todos los recursos
// Status: 200
itemsRouter.get('/', (_req, res) => {
  res.json(store.getAll());
});

// GET /items/:id — Obtener recurso por ID
// Status: 200 si existe | 404 si no existe
itemsRouter.get('/:id', (req, res) => {
  const item = store.getById(Number(req.params.id));

  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  res.json(item);
});

// POST /items — Crear nuevo recurso
// Status: 201 con el recurso creado
itemsRouter.post('/', (req, res) => {
  const data = req.body as CreateItemDto;
  const newItem = store.create(data);
  res.status(201).json(newItem);
});

// PUT /items/:id — Actualizar recurso completo
// Status: 200 con el recurso actualizado | 404 si no existe
itemsRouter.put('/:id', (req, res) => {
  const data = req.body as UpdateItemDto;
  const updated = store.update(Number(req.params.id), data);

  if (!updated) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  res.json(updated);
});

// DELETE /items/:id — Eliminar recurso
// Status: 204 sin body | 404 si no existe
itemsRouter.delete('/:id', (req, res) => {
  const deleted = store.remove(Number(req.params.id));

  if (!deleted) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  res.status(204).send();
});