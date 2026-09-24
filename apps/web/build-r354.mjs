import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r353.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v353.js'),'utf8'),
 readFile(resolve(dist,'app-v353.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r354-foryou-actions-sports-sync.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,a,b,l)=>{const n=count(s,a);if(n!==1)throw new Error('r354 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.144';window.__ctOfficialVersion='1.0.144';",
 "const REVISION='r353-official-1.0.144';",
 "const version='1.0.144',revision='r353-official-1.0.144';",
 "window.__ctR353Marker='watchlist-smart-weighted-random+history-affinity+recent-memory'",
 "const direct=window.__ctR351DirectClick;if(typeof direct==='function'&&direct(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}",
 "await syncSportsWindow340(day340(0),day340(2));",
 "boot();"
])if(!js.includes(x))throw new Error('r354 missing '+x);

/* r354 is the first branch of the already-earliest click capture. */
js=once(js,
 "const direct=window.__ctR351DirectClick;if(typeof direct==='function'&&direct(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}",
 "const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}const direct=window.__ctR351DirectClick;if(typeof direct==='function'&&direct(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();return}",
 'r354 first capture'
);

/* Existing every-open Sports sync now fills the same future window that the payload reads. */
js=once(js,
 "await syncSportsWindow340(day340(0),day340(2));",
 "await syncSportsWindow340(day340(0),day340(2));await syncSportsWindow340(day340(3),day340(5));await syncSportsWindow340(day340(6),day340(9));",
 'r340 future sports window'
);

js=once(js,"window.__ctWebBuild='1.0.144';window.__ctOfficialVersion='1.0.144';","window.__ctWebBuild='1.0.145';window.__ctOfficialVersion='1.0.145';",'version');
js=once(js,"const REVISION='r353-official-1.0.144';","const REVISION='r354-official-1.0.145';",'revision');
js=once(js,"const version='1.0.144',revision='r353-official-1.0.144';","const version='1.0.145',revision='r354-official-1.0.145';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v353.js','app-v354.js').replaceAll('app-v353.css','app-v354.css').replaceAll('v1.0.144','v1.0.145').replaceAll('r353-official-1.0.144','r354-official-1.0.145');
sw=sw.replaceAll('ct-web-1.0.144-r353','ct-web-1.0.145-r354').replaceAll('app-v353.js','app-v354.js').replaceAll('app-v353.css','app-v354.css');
css+='\n/* CineTracker Web 1.0.145 r354 — live Pra Você clicks + Sports manual/future sync. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.145',revision:'r354-official-1.0.145',base:'r353-production',
 scope:'foryou-actions+sports-sync',
 discover_foryou_click_owner:'r354-first-branch-before-r351-r352',
 discover_foryou_actions:'repair-metadata+local-r352-first+safe-fallback',
 discover_foryou_failed_action_capture:'do-not-consume-unhandled-click',
 sports_manual_sync:'header-button-restored',
 sports_every_open_window:'past-3+future-9-days',
 sports_next_games:'provider-sync-0-through-9+forced-payload-reload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r354 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v354.js'),js),writeFile(resolve(dist,'app-v354.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v353.js'),{force:true}),rm(resolve(dist,'app-v353.css'),{force:true})]);
console.log('WEB_R354_READY Pra Você actions + Sports sync');
