import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r351.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v351.js'),'utf8'),
 readFile(resolve(dist,'app-v351.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r352-local-card-actions.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r352 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.142';window.__ctOfficialVersion='1.0.142';",
 "const REVISION='r351-official-1.0.142';",
 "const version='1.0.142',revision='r351-official-1.0.142';",
 "window.__ctR351Marker='foryou-first-capture-direct+watchlist-source-restore'",
 "boot();"
])if(!js.includes(x))throw new Error('r352 missing '+x);

js=once(js,"window.__ctWebBuild='1.0.142';window.__ctOfficialVersion='1.0.142';","window.__ctWebBuild='1.0.143';window.__ctOfficialVersion='1.0.143';",'version');
js=once(js,"const REVISION='r351-official-1.0.142';","const REVISION='r352-official-1.0.143';",'revision');
js=once(js,"const version='1.0.142',revision='r351-official-1.0.142';","const version='1.0.143',revision='r352-official-1.0.143';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v351.js','app-v352.js').replaceAll('app-v351.css','app-v352.css').replaceAll('v1.0.142','v1.0.143').replaceAll('r351-official-1.0.142','r352-official-1.0.143');
sw=sw.replaceAll('ct-web-1.0.142-r351','ct-web-1.0.143-r352').replaceAll('app-v351.js','app-v352.js').replaceAll('app-v351.css','app-v352.css');
css+='\n/* CineTracker Web 1.0.143 r352 — local optimistic card actions; no page/section reload. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.143',revision:'r352-official-1.0.143',base:'r351-production',
 scope:'discover-local-card-actions-no-reload',
 discover_card_actions:'local-slot-only+prevent-default+stop-propagation',
 discover_foryou_actions:'optimistic-local-slot-swap+background-persist+silent-rollback',
 discover_foryou_reload:'forbidden-no-paintForYou-no-loadForYou-no-renderDiscover',
 discover_public_watchlist:'instant-saved-state+background-persist+no-card-swap',
 discover_public_seen:'instant-seen-state+background-persist+no-card-swap',
 discover_foryou_transition:'transition-opacity+duration-300+ease-in-out',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r352 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v352.js'),js),writeFile(resolve(dist,'app-v352.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v351.js'),{force:true}),rm(resolve(dist,'app-v351.css'),{force:true})]);
console.log('WEB_R352_READY local card actions only; no global repaint/refetch');
