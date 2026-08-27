import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
const output = resolve(root, '..', 'preview-build', 'CineTracker_Web_0.99.2_FIX2_Preview.html');
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const matches = [...html.matchAll(/<script src="\/([^"?]+)"><\/script>/g)];

for (const match of matches) {
  const name = match[1];
  const source = (await readFile(resolve(dist, name), 'utf8')).replace(/<\/script/gi, '<\\/script');
  html = html.replace(match[0], `<script data-ct-work-inline="${name}">\n${source}\n</script>`);
}

html = html.replaceAll('navigator.serviceWorker.register(', 'window.__ctWorkPreviewNoopServiceWorker(');
html = html.replace('</head>', '<script>window.__ctWorkPreview="web-0.99.2-fix2-routes-v2";window.__ctWorkPreviewNoopServiceWorker=()=>Promise.resolve(null);</script></head>');

await mkdir(dirname(output), { recursive: true });
await writeFile(output, html, 'utf8');
console.log(`WORK_PREVIEW_OK scripts=${matches.length} output=${output}`);
