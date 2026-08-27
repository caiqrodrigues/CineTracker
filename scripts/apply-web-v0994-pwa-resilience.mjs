import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const layer = 'patch-v108-v0994-pwa-resilience.js';
const layerTag = `<script src="/${layer}"></script>`;
const afterTag = '<script src="/patch-v107-v0994-data-ui-fix.js"></script>';
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  html = html.split(layerTag).join('');
  if (!html.includes(afterTag)) throw new Error(`0.99.4 PWA resilience: v107 layer missing in ${indexPath}`);
  html = html.replace(afterTag, `${afterTag}${layerTag}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(resolve(root, 'apps/web', layer), resolve(target, layer));
}

console.log('CineTracker Web 0.99.4: PWA/atalho com navegação não bloqueante, timeout da Home e fallback local aplicado.');
