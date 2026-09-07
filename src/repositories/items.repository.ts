// ============================================
// REPOSITORY — Capa de acceso a datos
// ============================================

import { Item, CreateItemDto, UpdateItemDto } from '../types';

// Datos iniciales del museo
const store: Item[] = [
  {
    id: 1,
    titulo: 'La Gioconda',
    artista: 'Leonardo da Vinci',
    año: 1503,
    sala: 'Sala 1',
  },
  {
    id: 2,
    titulo: 'La Noche Estrellada',
    artista: 'Vincent van Gogh',
    año: 1889,
    sala: 'Sala 2',
  },
  {
    id: 3,
    titulo: 'Guernica',
    artista: 'Pablo Picasso',
    año: 1937,
    sala: 'Sala 3',
  },
  {
    id: 4,
    titulo: 'El Grito',
    artista: 'Edvard Munch',
    año: 1893,
    sala: 'Sala 4',
  },
];

let nextId = 5;

// Obtener todas las obras
export async function findAll(): Promise<Item[]> {
  return [...store];
}

// Buscar una obra por ID
export async function findById(id: number): Promise<Item | undefined> {
  const item = store.find((item) => item.id === id);

  return item ? { ...item } : undefined;
}

// Crear una nueva obra
export async function create(dto: CreateItemDto): Promise<Item> {
  const item: Item = {
    id: nextId++,
    ...dto,
  };

  store.push(item);

  return { ...item };
}

// Actualizar una obra
export async function update(
  id: number,
  dto: UpdateItemDto
): Promise<Item | undefined> {
  const index = store.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  store[index] = {
    ...store[index],
    ...dto,
  };

  return { ...store[index] };
}

// Eliminar una obra
export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  store.splice(index, 1);

  return true;
}