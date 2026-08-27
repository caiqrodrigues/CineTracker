import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const preName = 'patch-v101-v0994-nav-pre.js';
const finalName = 'patch-v099-v0994-web.js';
const preTag = `<script src="/${preName}"></script>`;
const finalTag = `<script src="/${finalName}"></script>`;
const legacyAnchor = '<script src="/patch-v088-v098-nav-pre.js"></script>';
const fallbackAnchor = '<script src="/patch-v092-v0991.js"></script>';
const removeTags = [
  preTag,
  finalTag,
  '<script src="/patch-v100-v0994-authority.js"></script>',
  '<script src="/patch-v093-v0992.js"></script>',
  '<script src="/patch-v094-v0992-compat.js"></script>',
  '<script src="/patch-v095-v0992-fix.js"></script>',
  '<script src="/patch-v096-v0992-unfreeze.js"></script>',
  '<script src="/patch-v097-v0993-nav-pre.js"></script>',
  '<script src="/patch-v098-v0993-web.js"></script>'
];
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  for (const tag of removeTags) html = html.split(tag).join('');
  const anchor = html.includes(legacyAnchor) ? legacyAnchor : fallbackAnchor;
  if (!html.includes(anchor)) throw new Error(`Web 0.99.4: legacy navigation anchor missing: ${indexPath}`);
  html = html.replace(anchor, `${preTag}${anchor}`);
  html = html.replace('</body>', `${finalTag}</body>`);
  if (html.indexOf(preTag) >= html.indexOf(anchor)) throw new Error(`Web 0.99.4: pre-gate order invalid: ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');
  await copyFile(resolve(root, 'apps/web', preName), resolve(target, preName));
  await copyFile(resolve(root, 'apps/web', finalName), resolve(target, finalName));
}
console.log('CineTracker Web 0.99.4: 0.99.2/0.99.3 navigation runtimes removed; desktop/mobile pre-gate + 0.99.4 runtime emitted.');
