import { PrismaClient } from '../generated/prisma/client.js';

export function createDatabase(databaseUrl: string): PrismaClient {
  return new PrismaClient({ datasourceUrl: databaseUrl });
}
