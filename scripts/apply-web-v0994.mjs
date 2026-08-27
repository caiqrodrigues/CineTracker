import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const names = ['patch-v099-v0994-web.js','patch-v100-v0994-authority.js'];
const tags = names.map(name => `<script src="/${name}"></script>`);
const legacy993 = [
  '<script src="/patch-v097-v0993-nav-pre.js"></script>',
  '<script src="/patch-v098-v0993-web.js"></script>'
];
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  for (const tag of [...tags, ...legacy993]) html = html.split(tag).join('');
  html = html.replace('</body>', `${tags.join('')}</body>`);
  await writeFile(indexPath, html, 'utf8');
  for (const name of names) await copyFile(resolve(root, 'apps/web', name), resolve(target, name));
}
console.log('CineTracker Web 0.99.4: 0.99.3 runtime removed; authoritative 0.99.4 layers emitted.');
