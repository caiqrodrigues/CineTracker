import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const web = resolve(root, 'apps/web');
const wrapper = resolve(web, 'index-v021.html');
const legacy = resolve(web, 'index.html');
const favicon = resolve(web, 'favicon.svg');
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(wrapper, resolve(dist, 'index.html'));
  await cp(legacy, resolve(dist, 'legacy.html'));
  await cp(favicon, resolve(dist, 'favicon.svg'));
}

console.log('CineTracker Web 0.2.1 publicado em dist/ e apps/web/dist/');
