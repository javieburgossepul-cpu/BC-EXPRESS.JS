// src/app.ts — Configuración de Express para Dominio Museo
import express from 'express';
import secondaryRouter from './routes/secondary.routes';
import primaryRouter from './routes/primary.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Rutas del Dominio Museo (Artistas y Obras de Arte) y alias base
app.use('/api/v1/artists', secondaryRouter);
app.use('/api/v1/artworks', primaryRouter);

// Compatibilidad con endpoints genéricos
app.use('/api/v1/secondary', secondaryRouter);
app.use('/api/v1/primary', primaryRouter);

app.use(notFound);
app.use(errorHandler);
