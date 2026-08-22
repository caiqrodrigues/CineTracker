import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const web = resolve(root, 'apps/web');
const source = resolve(web, 'index.html');
const favicon = resolve(web, 'favicon.svg');
const patch024 = resolve(web, 'patch-v024.js');
const patch025 = resolve(web, 'patch-v025.js');
const patch025Profile = resolve(web, 'patch-v025-profile-sync.js');
const patch027 = resolve(web, 'patch-v027.js');
const patch028 = resolve(web, 'patch-v028.js');
const patch029 = resolve(web, 'patch-v029.js');
const patch030 = resolve(web, 'patch-v030.js');
const patch034 = resolve(web, 'patch-v034.js');
const patch035 = resolve(web, 'patch-v035.js');
const patch036 = resolve(web, 'patch-v036.js');
const patch037 = resolve(web, 'patch-v037.js');
const patch038 = resolve(web, 'patch-v038.js');
const patch040 = resolve(web, 'patch-v040.js');
const patch041 = resolve(web, 'patch-v041.js');
const patch042 = resolve(web, 'patch-v042.js');
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

const raw = await readFile(source, 'utf8');
const withIcon = raw.includes('rel="icon"') ? raw : raw.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
const built = withIcon.replace('</body>', '<script src="/patch-v024.js"></script><script src="/patch-v025.js"></script><script src="/patch-v025-profile-sync.js"></script><script src="/patch-v027.js"></script><script src="/patch-v028.js"></script><script src="/patch-v029.js"></script><script src="/patch-v030.js"></script><script src="/patch-v034.js"></script><script src="/patch-v035.js"></script><script src="/patch-v036.js"></script><script src="/patch-v037.js"></script><script src="/patch-v038.js"></script><script src="/patch-v040.js"></script><script src="/patch-v041.js"></script><script src="/patch-v042.js"></script></body>');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await writeFile(resolve(dist, 'index.html'), built, 'utf8');
  await cp(favicon, resolve(dist, 'favicon.svg'));
  for (const f of [patch024,patch025,patch025Profile,patch027,patch028,patch029,patch030,patch034,patch035,patch036,patch037,patch038,patch040,patch041,patch042]) await cp(f, resolve(dist, f.split('/').pop()));
}
console.log('CineTracker Web 0.4.5 publicado em dist/ e apps/web/dist/');
