import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r495.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v495.js'),'utf8'),
 readFile(resolve(dist,'app-v495.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r497-official-0.3.24';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.24 • ${REVISION}');
js+='\nwindow.__ctR497Marker="stable-r495-exact-runtime+broken-release-sources-removed+modern-blue+full-browser-gate";\n';
js+='window.__ctR497={version:"0.3.24",base:"r495-exact-runtime"};\n';

html='<!doctype html><html lang="pt-BR"><head><meta name="ct-revision" content="r497-official-0.3.24"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><meta name="theme-color" content="#041017"><meta name="color-scheme" content="dark"><title>CineTracker</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/app-v497.css?ct=r497-official-0.3.24"></head><body><div id="app"><div class="ct497-boot" aria-live="polite"><div class="ct497-boot-mark">CT</div><div><b>CineTracker</b><small>Carregando sua biblioteca…</small></div></div></div><script defer src="/app-v497.js?ct=r497-official-0.3.24"></script></body></html>';

css+='\n/* CineTracker Web 0.3.24 r497 — exact green r495 runtime, clean release path. */\n'+
'.ct497-boot{min-height:100vh;display:flex;align-items:center;justify-content:center;gap:12px;background:#041017;color:#d8edf8;font:14px/1.35 Inter,system-ui,sans-serif}.ct497-boot-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;border:1px solid rgba(88,175,224,.42);background:rgba(88,175,224,.12);color:#7bc7f2;font-weight:800;animation:ct497Pulse 1.1s ease-in-out infinite}.ct497-boot b,.ct497-boot small{display:block}.ct497-boot small{margin-top:2px;color:#8ca9b8}@keyframes ct497Pulse{0%,100%{opacity:.55}50%{opacity:1}}\n'+
':root{--gold:#58afe0!important}\n';

sw=sw.replaceAll('ct-media-r495','ct-media-r497');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.24',
 revision:'r497-official-0.3.24',
 base:'r495-green-exact-runtime',
 scope:'modern-blue-r495-functional-base+broken-release-source-removal+full-browser-gate',
 boot:'clean modern boot placeholder; no legacy yellow/gold bootstrap and no r496 early global owner',
 home:'r495 progressive Home preserved byte-for-byte except release identity',
 discover:'r495 Discover/Pra Você runtime preserved',
 profile:'r495 fast profile contract preserved; exactly 12 cards per summary',
 removed_release_sources:['r493','r494','r496'],
 legacy_runtime_policy:'r492 retirement guards preserved exactly because aggressive physical pruning changed movie rendering',
 f1:'preserved',sports:'preserved',history:'daily/undo preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v497.js'),js),
 writeFile(resolve(dist,'app-v497.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v495.js'),{force:true}),rm(resolve(dist,'app-v495.css'),{force:true})]);
console.log('WEB_R497_READY exact-green-r495-runtime');
