import { readFile } from 'fs/promises';
import { join } from 'path';
import type { User, Product } from './types.js';

export async function loadUsersWithAsync(): Promise<User[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'users.json');

  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as User[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load users: ${message}`);
  }
}

export async function loadProductsWithAsync(): Promise<Product[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'products.json');

  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load products: ${message}`);
  }
}