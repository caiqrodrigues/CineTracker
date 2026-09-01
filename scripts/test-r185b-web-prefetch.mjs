import {readFile} from 'node:fs/promises';
const [js,build,pkg,gradle]=await Promise.all([
  readFile('apps/web/runtime-r185b-web.js','utf8'),
  readFile('apps/web/build-r185b.mjs','utf8'),
  readFile('apps/web/package.json','utf8'),
  readFile('apps/android/app/build.gradle','utf8')
]);
for(const m of [
  "window.__ctR185B='instant-route-shell-prefetch'",
  "cached-shell-before-legacy-loading",
  "profile-quick-sports-discover-on-idle-and-intent",
  'ct185BShowBeforeBase','ct185BCallWithoutLoader',
  "ct185ARead(c.slot,c.state)",
  "String(markup||'').includes(shown.c.marker)",
  "rpc('cinetracker_profile_quick_stats_v1'",
  'sportsPayload(false)','discoverRows(String(discoverState?.tab',
  "document.addEventListener('pointerover'","document.addEventListener('touchstart'",
  'const ct185BBootBase=boot'
])if(!js.includes(m))throw new Error('r185B runtime missing '+m);
if(js.includes('cinetracker_profile_payload_v0997'))throw new Error('r185B prefetch must not run heavy full Profile RPC');
for(const m of ["await import('./build-r185a.mjs')","const REVISION='r185b-web-prefetch';","app-v185b.js","runtime-r185b-web.js"])if(!build.includes(m))throw new Error('r185B build missing '+m);
if(!pkg.includes('build-r185b.mjs'))throw new Error('package is not building r185B');
if(!gradle.includes("versionName '0.99.7.20'")||!gradle.includes('versionCode 9990'))throw new Error('Android changed in Web-only r185B');
console.log('R185B_WEB_PREFETCH_OK shell-before-loader=true profile=quick-only sports=warm discover=warm android=unchanged');
