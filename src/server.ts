import 'dotenv/config';
import { app } from './app.js';
import { connectDB } from './lib/mongoose.js';
import bcrypt from 'bcrypt';
import { User } from './models/user.model.js';

const PORT = Number(process.env.PORT) || 8080;

async function seedInitialUsers(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) return;

  const passwordAdmin = await bcrypt.hash('Admin1234!', 10);
  const passwordUser = await bcrypt.hash('User1234!', 10);

  await User.insertMany([
    {
      name: 'Curador Principal',
      email: 'curador@museo.com',
      password: passwordUser,
      role: 'user',
    },
    {
      name: 'Administrador General',
      email: 'admin@museo.com',
      password: passwordAdmin,
      role: 'admin',
    },
    {
      name: 'Regular User',
      email: 'user@test.com',
      password: passwordUser,
      role: 'user',
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: passwordAdmin,
      role: 'admin',
    },
  ]);

  console.log('🌱 Usuarios iniciales creados:');
  console.log('   👤 Curador: curador@museo.com (Pass: User1234!)');
  console.log('   🛡️ Admin:   admin@museo.com   (Pass: Admin1234!)');
}

async function main(): Promise<void> {
  await connectDB();
  await seedInitialUsers();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor Museo API iniciado en: http://localhost:${PORT}`);
    console.log(`🏛️ Dominio: Museo | Recurso: Obras de Arte`);
    console.log(`🛡️ Capas de Seguridad: Helmet, RateLimiter, CORS, MongoSanitize, RBAC`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`======================================================\n`);
  });
}

main().catch((err) => {
  console.error('❌ Error crítico al iniciar el servidor:', err);
  process.exit(1);
});
