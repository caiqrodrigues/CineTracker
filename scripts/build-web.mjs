import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'apps/web/index.html');
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(source, resolve(dist, 'index.html'));
}

console.log('CineTracker Web build concluído em dist/index.html e apps/web/dist/index.html');
