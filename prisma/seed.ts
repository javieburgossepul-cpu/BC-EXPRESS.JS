// prisma/seed.ts — Datos iniciales para el dominio Museo
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed para el dominio Museo...');

  // 1. Limpieza de datos existentes para idempotencia
  await prisma.artwork.deleteMany();
  await prisma.artist.deleteMany();
  console.log('🧹 Datos previos eliminados.');

  // 2. Creación de artistas (recurso secundario)
  const leonardo = await prisma.artist.create({
    data: {
      name: 'Leonardo da Vinci',
      nationality: 'Italiano',
      birthYear: 1452,
    },
  });

  const vanGogh = await prisma.artist.create({
    data: {
      name: 'Vincent van Gogh',
      nationality: 'Neerlandés',
      birthYear: 1853,
    },
  });

  const picasso = await prisma.artist.create({
    data: {
      name: 'Pablo Picasso',
      nationality: 'Español',
      birthYear: 1881,
    },
  });

  const velazquez = await prisma.artist.create({
    data: {
      name: 'Diego Velázquez',
      nationality: 'Español',
      birthYear: 1599,
    },
  });

  const botticelli = await prisma.artist.create({
    data: {
      name: 'Sandro Botticelli',
      nationality: 'Italiano',
      birthYear: 1445,
    },
  });

  console.log('✅ 5 artistas creados.');

  // 3. Creación de obras de arte (recurso principal)
  const artworksData = [
    {
      title: 'La Gioconda (Mona Lisa)',
      inventoryCode: 'MUS-ART-001',
      year: 1503,
      medium: 'Óleo sobre tabla de álamo',
      estimatedValue: 860000000.0,
      isExhibited: true,
      artistId: leonardo.id,
    },
    {
      title: 'La última cena',
      inventoryCode: 'MUS-ART-002',
      year: 1498,
      medium: 'Pintura al temple y óleo sobre yeso',
      estimatedValue: 450000000.0,
      isExhibited: true,
      artistId: leonardo.id,
    },
    {
      title: 'La noche estrellada',
      inventoryCode: 'MUS-ART-003',
      year: 1889,
      medium: 'Óleo sobre lienzo',
      estimatedValue: 100000000.0,
      isExhibited: true,
      artistId: vanGogh.id,
    },
    {
      title: 'Los girasoles',
      inventoryCode: 'MUS-ART-004',
      year: 1888,
      medium: 'Óleo sobre lienzo',
      estimatedValue: 84000000.0,
      isExhibited: false,
      artistId: vanGogh.id,
    },
    {
      title: 'Guernica',
      inventoryCode: 'MUS-ART-005',
      year: 1937,
      medium: 'Óleo sobre lienzo',
      estimatedValue: 200000000.0,
      isExhibited: true,
      artistId: picasso.id,
    },
    {
      title: 'Las señoritas de Avignon',
      inventoryCode: 'MUS-ART-006',
      year: 1907,
      medium: 'Óleo sobre lienzo',
      estimatedValue: 120000000.0,
      isExhibited: false,
      artistId: picasso.id,
    },
    {
      title: 'Las Meninas',
      inventoryCode: 'MUS-ART-007',
      year: 1656,
      medium: 'Óleo sobre lienzo',
      estimatedValue: 350000000.0,
      isExhibited: true,
      artistId: velazquez.id,
    },
    {
      title: 'El nacimiento de Venus',
      inventoryCode: 'MUS-ART-008',
      year: 1485,
      medium: 'Temple sobre lienzo',
      estimatedValue: 180000000.0,
      isExhibited: true,
      artistId: botticelli.id,
    },
  ];

  const result = await prisma.artwork.createMany({
    data: artworksData,
  });

  console.log(`✅ ${result.count} obras de arte creadas exitosamente.`);
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
