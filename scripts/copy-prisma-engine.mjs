import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// tsc compiles TypeScript but does not copy Prisma's native query engine.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'src/generated/prisma');
const destination = path.join(root, 'dist/generated/prisma');
const engines = (await readdir(source)).filter(name => /^(?:lib)?query_engine-/.test(name));
if (engines.length === 0) throw new Error('Prisma engine missing. Run prisma generate before building.');
await mkdir(destination, { recursive: true });
for (const name of engines) await copyFile(path.join(source, name), path.join(destination, name));
console.log(`Copied ${engines.length} Prisma query engine(s) into dist.`);
