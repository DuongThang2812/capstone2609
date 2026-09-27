import { mkdir } from 'node:fs/promises';
import { env } from './config/env.js';
import { createDatabase } from './config/db.js';
import { createApp } from './app.js';

const db = createDatabase(env.DATABASE_URL);
await db.$connect();
await db.$queryRaw`SELECT 1`;
await mkdir(env.UPLOAD_DIR, { recursive: true });
const server = createApp(db).listen(env.PORT, () => console.log(`Capstone API: http://localhost:${env.PORT}/api`));
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error(error.code === 'EADDRINUSE' ? `Port ${env.PORT} đang được sử dụng.` : 'Không thể khởi động HTTP server.');
  void db.$disconnect().finally(() => process.exit(1));
});
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(() => { void db.$disconnect().finally(() => process.exit(0)); });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
