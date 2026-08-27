import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const preName = 'patch-v097-v0993-nav-pre.js';
const postName = 'patch-v098-v0993-web.js';
const preTag = `<script src="/${preName}"></script>`;
const postTag = `<script src="/${postName}"></script>`;
const fixTag = '<script src="/patch-v095-v0992-fix.js"></script>';
const unfreezeTag = '<script src="/patch-v096-v0992-unfreeze.js"></script>';
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  if (!html.includes(fixTag)) throw new Error(`Web 0.99.3: 0.99.2 navigation gate missing: ${indexPath}`);
  if (!html.includes(unfreezeTag)) throw new Error(`Web 0.99.3: FIX2 unfreeze layer missing: ${indexPath}`);
  html = html.split(preTag).join('').split(postTag).join('');
  html = html.replace(fixTag, `${preTag}${fixTag}`);
  html = html.replace('</body>', `${postTag}</body>`);
  if (html.indexOf(preTag) >= html.indexOf(fixTag)) throw new Error(`Web 0.99.3: pre-gate order invalid: ${indexPath}`);
  if (html.indexOf(postTag) <= html.indexOf(unfreezeTag)) throw new Error(`Web 0.99.3: final layer order invalid: ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(resolve(root, 'apps/web', preName), resolve(target, preName));
  await copyFile(resolve(root, 'apps/web', postName), resolve(target, postName));
}

console.log('CineTracker Web 0.99.3: navigation pre-gate + final sidebar/discover layer emitted.');
