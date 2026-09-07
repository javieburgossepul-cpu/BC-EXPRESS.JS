// ============================================
// READER — Lee el archivo de datos JSON
// ============================================

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Artwork } from './types.js';

// TODO: Implementar la función readItems
// Debe:
// 1. Construir la ruta al archivo data/items.json usando join() e import.meta.dirname
// 2. Leer el archivo con readFile (de 'fs/promises') usando 'utf-8'
// 3. Parsear el JSON y retornar el array de Artwork[]
// 4. Si ocurre un error, lanzar un Error descriptivo con el mensaje original
//
// Firma esperada:
// export async function readItems(): Promise<Artwork[]>

export async function readItems(): Promise<Artwork[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'artwork.json');

  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Artwork[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Error al leer el archivo: ${message}`);
  }
}