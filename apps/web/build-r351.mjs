import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r350.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v350.js'),'utf8'),
 readFile(resolve(dist,'app-v350.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r351-foryou-click-watchlist.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r351 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.141';window.__ctOfficialVersion='1.0.141';",
 "const REVISION='r350-official-1.0.141';",
 "const version='1.0.141',revision='r350-official-1.0.141';",
 "window.__ctR350Marker='foryou-direct-actions+optimistic-first+backend-second'",
 "const fn=window.__ctR336EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}",
 "boot();"
])if(!js.includes(x))throw new Error('r351 missing '+x);

/* Make r351 the first decision inside the already-earliest global capture. */
js=once(js,
 "const fn=window.__ctR336EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}",
 "const direct=window.__ctR351DirectClick;if(typeof direct==='function'&&direct(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}const fn=window.__ctR336EarlyHandle;if(typeof fn==='function'&&fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation()}",
 'first capture direct hook'
);

js=once(js,"window.__ctWebBuild='1.0.141';window.__ctOfficialVersion='1.0.141';","window.__ctWebBuild='1.0.142';window.__ctOfficialVersion='1.0.142';",'version');
js=once(js,"const REVISION='r350-official-1.0.141';","const REVISION='r351-official-1.0.142';",'revision');
js=once(js,"const version='1.0.141',revision='r350-official-1.0.141';","const version='1.0.142',revision='r351-official-1.0.142';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v350.js','app-v351.js').replaceAll('app-v350.css','app-v351.css').replaceAll('v1.0.141','v1.0.142').replaceAll('r350-official-1.0.141','r351-official-1.0.142');
sw=sw.replaceAll('ct-web-1.0.141-r350','ct-web-1.0.142-r351').replaceAll('app-v350.js','app-v351.js').replaceAll('app-v350.css','app-v351.css');
css+='\n/* CineTracker Web 1.0.142 r351 — Pra Você first-capture actions + Watchlist section restore. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.142',revision:'r351-official-1.0.142',base:'r350-production',
 scope:'discover-foryou-click+watchlist-section-only',
 discover_foryou_click_owner:'r351-direct-first-branch-inside-r336-earliest-capture',
 discover_foryou_actions:'immediate-state-change+single-backend-call',
 discover_foryou_watch_section:'restore-from-authoritative-watchlist-when-missing',
 discover_foryou_spacing:'slot-width-equals-poster+6px-gap',
 discover_foryou_heart:'inside-poster-top-right',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r351 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v351.js'),js),
 writeFile(resolve(dist,'app-v351.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v350.js'),{force:true}),rm(resolve(dist,'app-v350.css'),{force:true})]);
console.log('WEB_R351_READY direct first-capture Pra Você actions + Watchlist restore');
