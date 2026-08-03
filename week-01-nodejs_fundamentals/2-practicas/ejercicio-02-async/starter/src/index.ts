import { loadUsersWithCallback } from './01-callbacks.js';
import { loadUsersWithPromise } from './02-promises.js';
import { loadUsersWithAsync, loadProductsWithAsync } from './03-async.js';

console.log('=== Ejercicio 02: Patrones Asíncronos ===\n');

// 1️⃣ Callbacks
loadUsersWithCallback((err, users) => {
  if (err) {
    console.error('❌ Callback error:', err.message);
    return;
  }
  console.log(`✅ Callbacks       → ${users?.length} users cargados`);
  console.log('   Primer usuario:', users?.[0].name);
});

// 2️⃣ Promises
loadUsersWithPromise()
  .then((users) => {
    console.log(`✅ Promises        → ${users.length} users cargados`);
    console.log('   Primer usuario:', users[0].name);
  })
  .catch((err: Error) => console.error('❌ Promise error:', err.message));

// 3️⃣ Async/Await
const runComparison = async (): Promise<void> => {
  try {
    const users = await loadUsersWithAsync();
    console.log(`✅ Async/Await     → ${users.length} users cargados`);
    console.log('   Primer usuario:', users[0].name);
  } catch (err) {
    console.error('❌ Async error:', err instanceof Error ? err.message : err);
  }
};

runComparison();

// Promise.all
const runParallel = async (): Promise<void> => {
  console.log('\n--- Carga Paralela con Promise.all ---');

  console.time('parallel');

  const [users, products] = await Promise.all([
    loadUsersWithAsync(),
    loadProductsWithAsync(),
  ]);

  console.timeEnd('parallel');

  console.log('✅ Cargados en paralelo:');
  console.log(`   ${users.length} users, ${products.length} products`);

  const activeUsers = users.filter((u) => u.active);
  console.log(`   Usuarios activos: ${activeUsers.length}`);
};

runParallel();