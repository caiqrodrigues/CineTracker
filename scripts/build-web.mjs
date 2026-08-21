import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const web = resolve(root, 'apps/web');
const source = resolve(web, 'index.html');
const favicon = resolve(web, 'favicon.svg');
const patch024 = resolve(web, 'patch-v024.js');
const patch025 = resolve(web, 'patch-v025.js');
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

const raw = await readFile(source, 'utf8');
const withIcon = raw.includes('rel="icon"')
  ? raw
  : raw.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
const built = withIcon.replace(
  '</body>',
  '<script src="/patch-v024.js"></script><script src="/patch-v025.js"></script></body>'
);

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await writeFile(resolve(dist, 'index.html'), built, 'utf8');
  await cp(favicon, resolve(dist, 'favicon.svg'));
  await cp(patch024, resolve(dist, 'patch-v024.js'));
  await cp(patch025, resolve(dist, 'patch-v025.js'));
}

console.log('CineTracker Web 0.2.5 publicado em dist/ e apps/web/dist/');
