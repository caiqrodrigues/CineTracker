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
const rootDist = resolve(root, 'dist');
const webDist = resolve(root, 'apps/web/dist');

const raw = await readFile(source, 'utf8');
const withIcon = raw.includes('rel="icon"') ? raw : raw.replace('</head>', '<link rel="icon" type="image/svg+xml" href="/favicon.svg"></head>');
const built = withIcon.replace('</body>', '<script src="/patch-v024.js"></script><script src="/patch-v025.js"></script><script src="/patch-v025-profile-sync.js"></script><script src="/patch-v027.js"></script><script src="/patch-v028.js"></script><script src="/patch-v029.js"></script><script src="/patch-v030.js"></script><script src="/patch-v034.js"></script><script src="/patch-v035.js"></script><script src="/patch-v036.js"></script><script src="/patch-v037.js"></script></body>');

for (const dist of [rootDist, webDist]) {
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await writeFile(resolve(dist, 'index.html'), built, 'utf8');
  await cp(favicon, resolve(dist, 'favicon.svg'));
  await cp(patch024, resolve(dist, 'patch-v024.js'));
  await cp(patch025, resolve(dist, 'patch-v025.js'));
  await cp(patch025Profile, resolve(dist, 'patch-v025-profile-sync.js'));
  await cp(patch027, resolve(dist, 'patch-v027.js'));
  await cp(patch028, resolve(dist, 'patch-v028.js'));
  await cp(patch029, resolve(dist, 'patch-v029.js'));
  await cp(patch030, resolve(dist, 'patch-v030.js'));
  await cp(patch034, resolve(dist, 'patch-v034.js'));
  await cp(patch035, resolve(dist, 'patch-v035.js'));
  await cp(patch036, resolve(dist, 'patch-v036.js'));
  await cp(patch037, resolve(dist, 'patch-v037.js'));
}
console.log('CineTracker Web 0.3.9 publicado em dist/ e apps/web/dist/');
