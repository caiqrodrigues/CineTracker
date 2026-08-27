import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const fileName = 'patch-preview-navigation.js';
const runtimeName = 'patch-preview-navigation-runtime.js';
const source = resolve(root, 'apps', 'web', fileName);
const runtimeSource = resolve(root, 'apps', 'web', runtimeName);
const targets = [resolve(root, 'dist'), resolve(root, 'apps', 'web', 'dist')];
const tag = `<script src="/${fileName}"></script>`;
const runtimeTag = `<script src="/${runtimeName}"></script>`;
const fixTag = '<script src="/patch-v095-v0992-fix.js"></script>';
const unfreezeTag = '<script src="/patch-v096-v0992-unfreeze.js"></script>';

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  if (!html.includes(fixTag)) throw new Error(`Preview navigation: 0.99.2 route gate missing in ${indexPath}`);
  if (!html.includes(unfreezeTag)) throw new Error(`Preview navigation: FIX2 layer missing in ${indexPath}`);
  html = html.split(tag).join('');
  html = html.split(runtimeTag).join('');
  html = html.replace(fixTag, `${runtimeTag}${fixTag}`);
  html = html.replace('</body>', `${tag}</body>`);
  if (html.indexOf(runtimeTag) >= html.indexOf(fixTag)) throw new Error(`Preview navigation: runtime order invalid in ${indexPath}`);
  if (html.indexOf(tag) <= html.indexOf(unfreezeTag)) throw new Error(`Preview navigation: patch order invalid in ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(source, resolve(target, fileName));
  await copyFile(runtimeSource, resolve(target, runtimeName));
}

console.log('CineTracker Work Preview: functional four-route controller and button polish emitted.');
