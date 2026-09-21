// src/server.ts — Entry point del servidor
import { app } from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = Number(process.env['PORT']) || 8080;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  logger.info(`🏛️ Dominio: Museo (Obras de Arte y Artistas)`);
  logger.info(`📘 Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
});

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Recibida señal ${signal}. Cerrando servidor de forma ordenada...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Conexión con Prisma desconectada.');
      process.exit(0);
    } catch (err) {
      logger.error('Error al desconectar Prisma:', err);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
