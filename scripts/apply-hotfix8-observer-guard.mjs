import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const guardName = 'patch-v068-v097-observer-guard.js';
const guardSource = resolve(root, 'apps/web', guardName);
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];
const v97Tag = '<script src="/patch-v068-v097.js"></script>';
const guardTag = `<script src="/${guardName}"></script>`;

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  if (!html.includes(v97Tag)) throw new Error(`HOTFIX8: v97 tag missing in ${indexPath}`);
  if (!html.includes(guardTag)) html = html.replace(v97Tag, guardTag + v97Tag);
  if (html.indexOf(guardTag) > html.indexOf(v97Tag)) throw new Error(`HOTFIX8: observer guard loaded after v97 in ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(guardSource, resolve(target, guardName));
}

console.log('HOTFIX8: v97 MutationObserver guard injected before v97 runtime.');
