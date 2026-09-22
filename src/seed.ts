// src/seed.ts — Carga de datos demo para MongoDB (Dominio Museo)
try {
  process.loadEnvFile();
} catch {
  // Ignorar si el archivo .env ya está cargado por el entorno
}
import { connectDB, disconnectDB } from './lib/mongoose';
import { Artist } from './models/secondary.model';
import { Artwork } from './models/primary.model';

async function seed(): Promise<void> {
  await connectDB();

  // 1. Limpieza de colecciones (Artwork primero, luego Artist)
  await Artwork.deleteMany({});
  await Artist.deleteMany({});
  console.log('Colecciones limpiadas.');

  // 2. Paso A — Insertar Artistas y capturar sus _id
  const [leonardo, vanGogh, picasso, velazquez, botticelli] = await Artist.insertMany([
    { nombre: 'Leonardo da Vinci', nacionalidad: 'Italiano', añoNacimiento: 1452 },
    { nombre: 'Vincent van Gogh', nacionalidad: 'Neerlandés', añoNacimiento: 1853 },
    { nombre: 'Pablo Picasso', nacionalidad: 'Español', añoNacimiento: 1881 },
    { nombre: 'Diego Velázquez', nacionalidad: 'Español', añoNacimiento: 1599 },
    { nombre: 'Sandro Botticelli', nacionalidad: 'Italiano', añoNacimiento: 1445 },
  ]);
  console.log('5 artistas insertados exitosamente.');

  // 3. Paso B — Insertar Obras de Arte referenciando los _id de los artistas
  await Artwork.insertMany([
    {
      titulo: 'La Gioconda (Mona Lisa)',
      codigoInventario: 'MUS-ART-001',
      año: 1503,
      tecnica: 'Óleo sobre tabla de álamo',
      valorEstimado: 860000000,
      enExhibicion: true,
      artista: leonardo._id,
    },
    {
      titulo: 'La última cena',
      codigoInventario: 'MUS-ART-002',
      año: 1498,
      tecnica: 'Pintura al temple y óleo sobre yeso',
      valorEstimado: 450000000,
      enExhibicion: true,
      artista: leonardo._id,
    },
    {
      titulo: 'La noche estrellada',
      codigoInventario: 'MUS-ART-003',
      año: 1889,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 100000000,
      enExhibicion: true,
      artista: vanGogh._id,
    },
    {
      titulo: 'Los girasoles',
      codigoInventario: 'MUS-ART-004',
      año: 1888,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 84000000,
      enExhibicion: false,
      artista: vanGogh._id,
    },
    {
      titulo: 'Guernica',
      codigoInventario: 'MUS-ART-005',
      año: 1937,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 200000000,
      enExhibicion: true,
      artista: picasso._id,
    },
    {
      titulo: 'Las señoritas de Avignon',
      codigoInventario: 'MUS-ART-006',
      año: 1907,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 120000000,
      enExhibicion: false,
      artista: picasso._id,
    },
    {
      titulo: 'Las Meninas',
      codigoInventario: 'MUS-ART-007',
      año: 1656,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 350000000,
      enExhibicion: true,
      artista: velazquez._id,
    },
    {
      titulo: 'El nacimiento de Venus',
      codigoInventario: 'MUS-ART-008',
      año: 1485,
      tecnica: 'Temple sobre lienzo',
      valorEstimado: 180000000,
      enExhibicion: true,
      artista: botticelli._id,
    },
  ]);
  console.log('8 obras de arte insertadas exitosamente.');

  console.log('Seed de Museo completado.');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
