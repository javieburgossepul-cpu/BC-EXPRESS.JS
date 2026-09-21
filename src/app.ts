// src/app.ts — Configuración de la aplicación Express
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import itemsRouter from './routes/items.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API para el dominio Museo (Obras de Arte) y alias de compatibilidad
app.use('/api/v1/artworks', itemsRouter);
app.use('/api/v1/items', itemsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
