import type { Item, CreateItemDto, UpdateItemDto } from './types.js';

// Store en memoria — simula una base de datos sin persistencia
// Los datos se pierden al reiniciar el servidor.
const items: Item[] = [];

export function getAll(): Item[] {
  return items;
}

export function getById(id: number): Item | undefined {
  return items.find((item) => item.id === id);
}

export function create(data: CreateItemDto): Item {
  // Buscar el primer ID disponible empezando desde 1
  let id = 1;

  while (items.some((item) => item.id === id)) {
    id++;
  }

  const newItem: Item = {
    id,
    ...data,
  };

  items.push(newItem);

  return newItem;
}

export function update(
  id: number,
  data: UpdateItemDto
): Item | undefined {
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return undefined;
  }

  items[index] = {
    ...items[index],
    ...data,
  };

  return items[index];
}

export function remove(id: number): boolean {
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);

  return true;
}