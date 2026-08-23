import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const web = resolve(root, 'apps/web');
const source = resolve(web, 'index.html');
const favicon = resolve(web, 'favicon.svg');
const patches = ['patch-v024.js','patch-v025.js','patch-v025-profile-sync.js','patch-v027.js','patch-v028.js','patch-v029.js','patch-v030.js','patch-v034.js','patch-v035.js','patch-v036.js','patch-v037.js','patch-v038.js','patch-v040.js','patch-v041.js','patch-v043.js','patch-v042.js','patch-v044.js','patch-v045.js','patch-v046.js','patch-v047.js'].map(x=>resolve(web,x));
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

const raw = await readFile(source, 'utf8');
const withIcon = raw.includes('rel="icon"') ? raw : raw.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
const tags = patches.map(f=>`<script src="/${f.split('/').pop()}"></script>`).join('');
const built = withIcon.replace('</body>', tags+'</body>');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await writeFile(resolve(dist, 'index.html'), built, 'utf8');
  await cp(favicon, resolve(dist, 'favicon.svg'));
  for (const f of patches) await cp(f, resolve(dist, f.split('/').pop()));
}
console.log('CineTracker Web 0.4.9 publicado com Home/Assistir sincronizados e Descobrir em 3 colunas');
