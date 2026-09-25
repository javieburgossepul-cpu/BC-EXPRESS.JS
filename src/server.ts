import mongoose from 'mongoose';
import { app } from './app';
import { env } from './config/env';

const PORT = env.PORT || 3000;

async function startServer(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor Museo API iniciado en: http://localhost:${PORT}`);
    console.log(`🏛️ Dominio: Museo | Recurso: Obras de Arte`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🎨 Catálogo Obras: http://localhost:${PORT}/api/v1/obras`);
    console.log(`======================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('❌ Error al iniciar el servidor:', err);
  process.exit(1);
});
