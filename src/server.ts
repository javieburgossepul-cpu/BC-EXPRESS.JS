import { createApp } from './app.js';

const PORT = process.env.PORT ?? '3000';
const app = createApp();

const server = app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function shutdown(signal: string): void {
  console.log(`\n${signal} received. Closing server gracefully...`);

  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }

    console.log('Server closed. Bye 👋');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));