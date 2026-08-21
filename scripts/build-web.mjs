import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'apps/web/index.html'), resolve(dist, 'index.html'));
console.log('CineTracker Web build concluído em dist/index.html');
