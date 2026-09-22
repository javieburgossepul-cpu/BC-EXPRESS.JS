import 'dotenv/config';
import { app } from './app';
import { connectDB } from './lib/mongoose';

const PORT = Number(process.env.PORT) || 8080;

async function main(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`🏛️ Dominio: Museo (Obras de Arte)`);
    console.log(`🔐 Autenticación: JWT con cookies HttpOnly y rotación de Refresh Token`);
  });
}

main().catch((err) => {
  console.error('Fatal error on startup:', err);
  process.exit(1);
});
