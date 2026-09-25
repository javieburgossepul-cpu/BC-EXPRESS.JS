import 'dotenv/config';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import obraRoutes from './routes/obra.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions } from './config/security.js';

const app: Application = express();

// =======================================================
// CAPAS DE SEGURIDAD (EL ORDEN ES CRÍTICO)
// =======================================================

// 1. Headers de seguridad HTTP con Helmet
app.use(helmet());

// 2. Rate Limiting Global (100 solicitudes / 15 min)
app.use(globalLimiter);

// 3. CORS con lista blanca (Whitelist)
app.use(cors(corsOptions));

// 4. Procesamiento de cuerpo y cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Sanitización contra inyecciones NoSQL (Compatible con Express 5)
app.use((req, _res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// =======================================================
// ENDPOINTS DE SALUD (HEALTH CHECK)
// =======================================================
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    domain: 'Museo',
    recurso: 'Obras de Arte',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    domain: 'Museo',
    recurso: 'Obras de Arte',
    timestamp: new Date().toISOString(),
  });
});

// =======================================================
// RUTAS DE LA API
// =======================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/obras', obraRoutes);

// =======================================================
// MANEJO DE ERRORES (SIEMPRE AL FINAL)
// =======================================================
app.use(notFound);
app.use(errorHandler);

export { app };
