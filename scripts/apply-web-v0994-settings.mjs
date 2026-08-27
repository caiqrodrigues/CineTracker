import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const layer = 'patch-v109-v0994-settings-web.js';
const layerTag = `<script src="/${layer}"></script>`;
const afterTag = '<script src="/patch-v108-v0994-pwa-resilience.js"></script>';
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  html = html.split(layerTag).join('');
  if (!html.includes(afterTag)) throw new Error(`0.99.4 Settings: v108 layer missing in ${indexPath}`);
  html = html.replace(afterTag, `${afterTag}${layerTag}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(resolve(root, 'apps/web', layer), resolve(target, layer));
}

console.log('CineTracker Web 0.99.4: Configurações Web/PWA unificadas e responsivas aplicadas.');
