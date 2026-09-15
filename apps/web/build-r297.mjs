import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r296-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v296.js'),'utf8'),
  readFile(resolve(dist,'app-v296.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r297 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r297 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r297 missing '+x)};
for(const x of[
  "window.__ctR295='discover-personal-authority-calendar-daily-actions';",
  "window.__ctR296='strict-foryou-four-sports-stadium-web-polish'",
  "window.__ctWebBuild='1.0.87';window.__ctOfficialVersion='1.0.87';",
  "const REVISION='r296-official-1.0.87';"
])must(js,x);
const unsafe="if(window.__ctR295)return;";
const safe="if(window.__ctR295&&window.__ctR295Test&&typeof window.__ctR295Test.mediaKey==='function'&&typeof window.__ctR295Test.alreadyKnown==='function'&&typeof window.__ctR295Test.suppressBrowseCards==='function'&&typeof window.__ctR295Test.browseCard==='function'&&typeof window.__ctR295Test.decorateBrowseActions==='function')return;";
js=once(js,unsafe,safe,'inherited r295 stale-marker guard');
js=once(js,"window.__ctWebBuild='1.0.87';window.__ctOfficialVersion='1.0.87';","window.__ctWebBuild='1.0.88';window.__ctOfficialVersion='1.0.88';",'version');
js=once(js,"const REVISION='r296-official-1.0.87';","const REVISION='r297-official-1.0.88';",'revision');
js=once(js,'\nboot();','\nboot();\nwindow.__ctR297=\'r295-boot-authority-hotfix-full-bundle\';','post-boot marker');
css+=String.raw`\n/* CineTracker Web 1.0.88 r297 — inherited r295 stale-marker boot authority hotfix; no layout changes. */\n`;
html=html.replaceAll('app-v296.js','app-v297.js').replaceAll('app-v296.css','app-v297.css').replaceAll('CineTracker • v1.0.87','CineTracker • v1.0.88');
sw=sw.replaceAll('ct-web-1.0.87-r296','ct-web-1.0.88-r297').replaceAll('app-v296.js','app-v297.js').replaceAll('app-v296.css','app-v297.css');
const prev=JSON.parse(releaseRaw),release={
  ...prev,
  version:'1.0.88',
  revision:'r297-official-1.0.88',
  base:'r296-production',
  scope:'r295-stale-marker-boot-authority-hotfix-web-only',
  boot_hotfix:'r295-marker-requires-complete-authority-before-early-return',
  full_bundle_boot:'required-before-production-smoke',
  android:'1.0.20/10062'
};
await Promise.all([
  writeFile(resolve(dist,'app-v297.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v297.css'),css,'utf8'),
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v296.js'),{force:true}),rm(resolve(dist,'app-v296.css'),{force:true})]);
console.log('WEB_R297_READY inherited r295 boot authority hardened; full r296 scope preserved; Android preserved');
