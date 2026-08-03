// ============================================
// PROCESSOR — Filtra y calcula estadísticas
// ============================================

import type { Artwork, ItemSummary } from './types.js';

// TODO: Implementar filterByCategory
// Debe:
// 1. Si categoryFilter es null, retornar todos los items
// 2. Si categoryFilter está definido, retornar solo los items de esa categoría
//    (comparación case-insensitive con .toLowerCase())
// 3. Si no hay items en esa categoría, lanzar un Error que liste las categorías disponibles
//
// Firma esperada:
// export function filterByCategory(items: Artwork[], categoryFilter: string | null): Artwork[]

export function filterByCategory(
  items: Artwork[],
  categoryFilter: string | null
): Artwork[] {
  if (categoryFilter === null) {
    return items;
  }

  const filtered = items.filter(
    (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  if (filtered.length === 0) {
    const categories = Array.from(new Set(items.map((item) => item.category)));
    throw new Error(
      `Categoría no encontrada. Categorías disponibles: ${categories.join(', ')}`
    );
  }

  return filtered;
}

// TODO: Implementar calculateSummary
// Debe calcular y retornar un objeto ItemSummary con:
// - total: longitud del array
// - active: items con active === true
// - inactive: items con active === false
// - averagePrice: precio promedio redondeado a 2 decimales
// - mostExpensive: item con el mayor precio
// - cheapest: item con el menor precio
// - categories: array de categorías únicas (sin repetición)
//
// Pistas:
// - Usa .reduce() para sumar precios
// - Usa .filter() para separar activos e inactivos
// - Usa new Set() + Array.from() para categorías únicas
// - Usa Math.max/min o sort para el más caro/barato
//
// Firma esperada:
// export function calculateSummary(items: Artwork[]): ItemSummary

export function calculateSummary(items: Artwork[]): ItemSummary {
  const active = items.filter((item) => item.onDisplay).length;
  const inactive = items.filter((item) => !item.onDisplay).length;

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const averagePrice = Number((totalPrice / items.length).toFixed(2));

  const mostExpensive = items.reduce((a, b) =>
    a.price > b.price ? a : b
  );

  const cheapest = items.reduce((a, b) =>
    a.price < b.price ? a : b
  );

  const categories = Array.from(
    new Set(items.map((item) => item.category))
  );

  return {
    total: items.length,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}