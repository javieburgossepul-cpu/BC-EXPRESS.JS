import express from 'express';
import helmet from 'helmet';
import { authRouter } from './routes/auth.routes';
import { itemsRouter } from './routes/items.routes';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

app.use(helmet());
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/items', itemsRouter);
app.use('/api/v1/obras', itemsRouter);

app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    domain: 'Museo',
    recurso: 'Obras de Arte',
  });
});

app.use(errorHandler);
