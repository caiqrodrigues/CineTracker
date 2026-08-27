import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const fileName = 'patch-preview-navigation.js';
const source = resolve(root, 'apps', 'web', fileName);
const targets = [resolve(root, 'dist'), resolve(root, 'apps', 'web', 'dist')];
const tag = `<script src="/${fileName}"></script>`;
const unfreezeTag = '<script src="/patch-v096-v0992-unfreeze.js"></script>';

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  if (!html.includes(unfreezeTag)) throw new Error(`Preview navigation: FIX2 layer missing in ${indexPath}`);
  html = html.split(tag).join('');
  html = html.replace('</body>', `${tag}</body>`);
  if (html.indexOf(tag) <= html.indexOf(unfreezeTag)) throw new Error(`Preview navigation: patch order invalid in ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(source, resolve(target, fileName));
}

console.log('CineTracker Work Preview: four-button navigation polish emitted after FIX2.');
