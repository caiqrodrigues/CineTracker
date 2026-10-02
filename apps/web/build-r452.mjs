import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r451.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v451.js'),'utf8'),
 readFile(resolve(dist,'app-v451.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

if(!js.includes('cinetracker_home_series_v425'))throw new Error('r452 missing F1 Home RPC source');
js=js.replaceAll('cinetracker_home_series_v425','cinetracker_home_series_v452');

const f1Start=js.indexOf('function normalizeF1Home425(){');
const f1End=js.indexOf('\nfunction revealHome425(){',f1Start);
if(f1Start<0||f1End<0)throw new Error('r452 missing r425 hardcoded F1 normalizer');
js=js.slice(0,f1Start)+"function normalizeF1Home425(){return false}"+js.slice(f1End);

const runtime=`
/* CineTracker Web 1.0.242 r452 — Formula 1 canonical current-season Home authority. */
(()=>{'use strict';
if(window.__ctR452?.version==='1.0.242')return;
window.__ctR452={
 version:'1.0.242',
 scope:'f1-current-season-series+dual-sports-sync',
 mediaId:865,
 homeRpc:'cinetracker_home_series_v452',
 legacyTotal1280Disabled:true,
 dualSyncTrigger:'trg_f1_series_to_sports_v452'
};
window.__ctR452Marker='f1-current-season-home+series-to-sports-database-sync';
})();
`;
js+='\n'+runtime+'\n';

html=html.replaceAll('app-v451.js','app-v452.js').replaceAll('app-v451.css','app-v452.css');
sw=sw.replaceAll('app-v451.js','app-v452.js').replaceAll('app-v451.css','app-v452.css').replaceAll('ct-web-1.0.241-r451','ct-web-1.0.242-r452');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.242',
 revision:'r452-official-1.0.242',
 base:'r451+f1-current-season-series-sync',
 scope:'f1-only',
 f1:'Formula 1 media_id 865 uses current-season mapped/released episodes in Home; hardcoded 1280 backlog is disabled; Series episode writes mirror to Sports at database level',
 home:'F1 only: cinetracker_home_series_v452; all non-F1 rows inherit r424 unchanged',
 profile:'unchanged-r451',
 discover:'unchanged-r451',
 sports:'F1 mirror hardened; other sports unchanged',
 android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v452.js'),js),
 writeFile(resolve(dist,'app-v452.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v451.js'),{force:true}),rm(resolve(dist,'app-v451.css'),{force:true})]);

for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r452 forbidden '+bad);
for(const need of ['cinetracker_home_series_v452','function normalizeF1Home425(){return false}','window.__ctR452Marker'])if(!js.includes(need))throw new Error('r452 missing '+need);
console.log('WEB_R452_READY');
