import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r354.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v354.js'),'utf8'),
 readFile(resolve(dist,'app-v354.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r355-actions-sync-hard-owner.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,a,b,l)=>{const n=count(s,a);if(n!==1)throw new Error('r355 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.145';window.__ctOfficialVersion='1.0.145';",
 "const REVISION='r354-official-1.0.145';",
 "const version='1.0.145',revision='r354-official-1.0.145';",
 "window.__ctR354Marker='foryou-actions-live-first-capture+sports-manual-sync+future-window'",
 "window.addEventListener('click',e=>{try{const t=e.target;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 "boot();"
])if(!js.includes(x))throw new Error('r355 missing '+x);

/* r355 becomes the absolute first action branch in the earliest window click capture. */
js=once(js,
 "window.addEventListener('click',e=>{try{const t=e.target;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 "window.addEventListener('click',e=>{try{const t=e.target;const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(t,e))return;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 'earliest r355 capture'
);

/* Also take first position in the later bridge if execution ever reaches it. */
const later="const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}const direct=window.__ctR351DirectClick;";
if(count(js,later)>=1){
 js=js.replace(later,"const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}"+later);
}

js=once(js,"window.__ctWebBuild='1.0.145';window.__ctOfficialVersion='1.0.145';","window.__ctWebBuild='1.0.146';window.__ctOfficialVersion='1.0.146';",'version');
js=once(js,"const REVISION='r354-official-1.0.145';","const REVISION='r355-official-1.0.146';",'revision');
js=once(js,"const version='1.0.145',revision='r354-official-1.0.145';","const version='1.0.146',revision='r355-official-1.0.146';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v354.js','app-v355.js').replaceAll('app-v354.css','app-v355.css').replaceAll('v1.0.145','v1.0.146').replaceAll('r354-official-1.0.145','r355-official-1.0.146');
sw=sw.replaceAll('ct-web-1.0.145-r354','ct-web-1.0.146-r355').replaceAll('app-v354.js','app-v355.js').replaceAll('app-v354.css','app-v355.css');
css+='\n/* CineTracker Web 1.0.146 r355 — hard Pra Você action owner + always-visible Sports sync. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.146',revision:'r355-official-1.0.146',base:'r354-production',
 scope:'foryou-hard-actions+sports-sync-visible',
 discover_foryou_click_owner:'r355-absolute-first-window-capture',
 discover_foryou_actions:'local-slot-only+optimistic-immediate+background-persist+rollback-same-slot',
 discover_foryou_repaint:'clicked-slot-only',
 sports_manual_sync:'dedicated-toolbar-always-visible',
 sports_sync_engine:'r354-force-future-window+reload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r355 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v355.js'),js),writeFile(resolve(dist,'app-v355.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v354.js'),{force:true}),rm(resolve(dist,'app-v354.css'),{force:true})]);
console.log('WEB_R355_READY local-only Pra Você actions + visible Sports sync');
