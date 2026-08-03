import { readFile } from 'fs';
import { join } from 'path';
import type { User } from './types.js';

export function loadUsersWithCallback(
  callback: (error: Error | null, users?: User[]) => void
): void {
  const filePath = join(import.meta.dirname, '..', 'data', 'users.json');

  readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      callback(new Error(`Could not read file: ${err.message}`));
      return;
    }

    try {
      const users = JSON.parse(data) as User[];
      callback(null, users);
    } catch {
      callback(new Error('Invalid JSON format in users.json'));
    }
  });
}