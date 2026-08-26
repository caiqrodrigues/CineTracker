import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const targets = [resolve(root, 'dist', 'index.html'), resolve(root, 'apps/web/dist', 'index.html')];
const removeTags = [
  '<script src="/patch-v068-v097-observer-guard.js"></script>',
  '<script src="/patch-v068-v097.js"></script>'
];

for (const indexPath of targets) {
  let html = await readFile(indexPath, 'utf8');
  for (const tag of removeTags) html = html.replaceAll(tag, '');
  if (html.includes('patch-v068-v097.js')) throw new Error(`HOTFIX9: v97 runtime still present in ${indexPath}`);
  if (html.includes('patch-v068-v097-observer-guard.js')) throw new Error(`HOTFIX9: v97 observer guard still present in ${indexPath}`);
  if (!html.includes('patch-v067-v095.js')) throw new Error(`HOTFIX9: stable v95 feature layer missing in ${indexPath}`);
  if (!html.includes("window.__ctP0SessionReset = 'hotfix7-once'")) throw new Error(`HOTFIX9: auth/session recovery missing in ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
}

console.log('HOTFIX9 stability: v97 overlay disabled; v95 core + auth recovery retained.');
