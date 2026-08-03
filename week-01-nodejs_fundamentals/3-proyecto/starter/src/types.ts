// ============================================
// TIPOS — Adapta estas interfaces a tu dominio
// ============================================
// Renombra 'Item' al recurso de tu dominio asignado.
// Ejemplo: Book, Medicine, Member, Dish, Room...

// TODO: Renombrar 'Item' al recurso de tu dominio asignado
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  period: string;
  category: string;
  price: number;
  onDisplay: boolean;
}

// TODO: Agregar campos específicos de tu dominio
// Ejemplo para Biblioteca:
// export interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   year: number;
//   available: boolean;
// }

// Resumen que el procesador debe calcular
export interface ItemSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Artwork;
  cheapest: Artwork;
  categories: string[];
}

// Reporte final que se escribirá en output/report.json
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: ItemSummary;
  items: Artwork[];
}