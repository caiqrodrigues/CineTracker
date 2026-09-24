import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r362.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v362.js'),'utf8'),
 readFile(resolve(dist,'app-v362.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r363-foryou-pool-refill.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r363 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.153';window.__ctOfficialVersion='1.0.153';",
 "const REVISION='r362-official-1.0.153';",
 "const version='1.0.153',revision='r362-official-1.0.153';",
 "window.__ctR362Marker='foryou-real-click-owner+dom-key-fallback+clicked-slot-only'",
 "boot();"
])if(!js.includes(x))throw new Error('r363 missing '+x);
for(const x of[
 "window.__ctR363Marker='foryou-pool-refill+actions-never-die+persist-even-at-last-item'",
 "function refill(name",
 "function handle(m)",
 "window.__ctR358Early=early"
])if(!runtime.includes(x))throw new Error('r363 runtime missing '+x);

js=once(js,"window.__ctWebBuild='1.0.153';window.__ctOfficialVersion='1.0.153';","window.__ctWebBuild='1.0.154';window.__ctOfficialVersion='1.0.154';",'version');
js=once(js,"const REVISION='r362-official-1.0.153';","const REVISION='r363-official-1.0.154';",'revision');
js=once(js,"const version='1.0.153',revision='r362-official-1.0.153';","const version='1.0.154',revision='r363-official-1.0.154';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v362.js','app-v363.js').replaceAll('app-v362.css','app-v363.css').replaceAll('v1.0.153','v1.0.154').replaceAll('r362-official-1.0.153','r363-official-1.0.154');
sw=sw.replaceAll('ct-web-1.0.153-r362','ct-web-1.0.154-r363').replaceAll('app-v362.js','app-v363.js').replaceAll('app-v362.css','app-v363.css');
css+='\n/* CineTracker Web 1.0.154 r363 — Pra Você targeted pool refill keeps repeated actions alive. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.154',revision:'r363-official-1.0.154',base:'r362-production',
 scope:'discover-foryou-pool-liveness-only',
 discover_foryou_click_owner:'r363-all-historical-pointers+pool-aware',
 discover_foryou_actions:'real-click+clicked-slot-only+background-persist+targeted-refill',
 discover_foryou_pool_liveness:'targeted-background-refill+no-exhaustion-deadlock',
 discover_foryou_last_item:'persist-action+same-slot-refill+no-global-repaint',
 discover_foryou_refill:'fresh-tmdb-next-pages+watchlist-authoritative+session-blocklist',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r363 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v363.js'),js),writeFile(resolve(dist,'app-v363.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v362.js'),{force:true}),rm(resolve(dist,'app-v362.css'),{force:true})]);
console.log('WEB_R363_READY Pra Você pools refill before exhaustion and actions never deadlock');
