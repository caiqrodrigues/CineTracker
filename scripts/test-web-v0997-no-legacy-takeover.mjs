import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const removed = [
  'patch-v101-v0994-nav-pre.js',
  'patch-v103-v0994-session-gate.js',
  'patch-v104-v0994-authority.js',
  'patch-v112-v0994-warm-boot.js',
  'patch-v113-v0994-fluidity.js'
];

for (const dir of ['dist','apps/web/dist']) {
  const html = await readFile(resolve(root,dir,'index.html'),'utf8');
  for (const name of removed) assert.ok(!html.includes(`<script src="/${name}"></script>`), `${name} must not execute in ${dir}`);
  assert.equal((html.match(/patch-v132-v0997-deeplink-pages\.js/g)||[]).length,1,`r132 must load once in ${dir}`);
  assert.equal((html.match(/patch-v133-v0997-primary-authority\.js/g)||[]).length,1,`r133 must load once in ${dir}`);
  assert.ok(html.indexOf('patch-v133-v0997-primary-authority.js')>html.indexOf('patch-v132-v0997-deeplink-pages.js'),`r133 must load after r132 in ${dir}`);

  const legacy = await readFile(resolve(root,dir,'patch-v099-v0994-web.js'),'utf8');
  assert.match(legacy,/r135-no-auto-takeover/,`r135 compatibility marker missing in ${dir}`);
  assert.ok(!legacy.includes('for(const delay of [0,180,820,1100])'),`0.99.4 startup takeover still active in ${dir}`);
  assert.ok(!/cinetracker:data-changed[\s\S]{0,180}renderHome994\(true\)/.test(legacy),`0.99.4 data-change Home takeover still active in ${dir}`);
  assert.match(legacy,/window\.__ct0994Navigate=navigate994/,`0.99.4 compatibility navigation missing in ${dir}`);
}

console.log('WEB_0997_R135_OK legacy 0.99.4 cannot auto-render primary routes');
