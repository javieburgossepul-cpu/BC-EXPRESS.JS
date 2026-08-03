import { readFile } from 'fs/promises';
import { join } from 'path';
import type { User } from './types.js';

export function loadUsersWithPromise(): Promise<User[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'users.json');

  return readFile(filePath, 'utf-8')
    .then((raw) => JSON.parse(raw) as User[])
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to load users: ${message}`);
    });
}