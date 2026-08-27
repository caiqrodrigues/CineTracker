import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const name = 'patch-v099-v0994-web.js';
const tag = `<script src="/${name}"></script>`;
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  html = html.split(tag).join('');
  html = html.replace('</body>', `${tag}</body>`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(resolve(root, 'apps/web', name), resolve(target, name));
}
console.log('CineTracker Web 0.99.4: authoritative Home/Profile layer emitted.');
