import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import obraRouter from './routes/obra.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app: Application = express();

app.use(express.json());
app.use(cookieParser());

// Endpoint de salud
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    domain: 'Museo',
    resource: 'Obras de Arte',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas del recurso principal: Obras de Arte (Museo)
app.use('/api/v1/obras', obraRouter);
app.use('/api/v1/artworks', obraRouter);

// Middlewares de manejo de errores
app.use(notFound);
app.use(errorHandler);
