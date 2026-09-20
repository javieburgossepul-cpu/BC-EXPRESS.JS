// ============================================
// APP — Configuración de Express
// Registra middlewares, rutas y manejo de errores en el orden correcto
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import itemsRouter from './routes/items.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Middlewares generales (parser JSON y logger de peticiones HTTP)
app.use(express.json());
app.use(morganMiddleware);

// Endpoint de Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 2. Rutas del dominio (disponible como /api/v1/obras y /api/v1/items)
app.use('/api/v1/obras', itemsRouter);
app.use('/api/v1/items', itemsRouter);

// 3. Middleware 404 (para rutas no encontradas, después de todas las rutas)
app.use(notFound);

// 4. Middleware global de manejo de errores (último middleware, 4 parámetros)
app.use(errorHandler);

export default app;
