import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r297-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v297.js'),'utf8'),readFile(resolve(dist,'app-v297.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r298-stadium-foryou-completion.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r298 missing '+x)};
for(const x of["window.__ctR297='r288-live-owner-hotfix-full-bundle'","window.__ctR297DiscoverBridge='r288-live-owners+r295-personal+r296-strict'","window.__ctR296='strict-foryou-four-sports-stadium-web-polish'","window.__ctWebBuild='1.0.88';window.__ctOfficialVersion='1.0.88';","const REVISION='r297-official-1.0.88';"])must(js,x);
for(const x of["window.__ctR298='stadium-real-controls+exact-foryou-live-pipeline'","window.__ctR298Sports='ct255-real-watch-button+tv-or-stadium+watched-badge'","window.__ctR298Profile='stadium-stat-inside-sports-assisted-only'","window.__ctR298ForYou='1-daily+3-watchlist+3-new+bounded-no-spinner'","[data-ct255-watch]",'buildForYou298','placeStadiumStat'])must(runtime,x);
if(!js.includes('\nboot();'))throw new Error('r298 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.88';window.__ctOfficialVersion='1.0.88';","window.__ctWebBuild='1.0.89';window.__ctOfficialVersion='1.0.89';")
 .replace("const REVISION='r297-official-1.0.88';","const REVISION='r298-official-1.0.89';")
 .replace('\nboot();','\n'+runtime+'\nboot();');
css+=String.raw`
/* CineTracker Web 1.0.89 r298 — stadium choice, stadium profile metric in Sports, completed Pra Você. */
.ct298-watch-popover{position:relative;display:grid;gap:7px;margin-top:8px;padding:10px;border:1px solid rgba(225,173,63,.55);border-radius:12px;background:rgba(16,27,32,.97);box-shadow:0 12px 30px rgba(0,0,0,.32);z-index:12}.ct298-watch-popover>button,.ct298-stadium-form button{border:1px solid #3a677e;background:#0b2b3d;color:#eaf7fd;border-radius:9px;padding:8px 10px;cursor:pointer;text-align:left}.ct298-stadium-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.ct298-stadium-form[hidden]{display:none!important}.ct298-stadium-form input{min-width:0;border:1px solid #3a677e;background:#071923;color:#fff;border-radius:9px;padding:8px 9px}.ct298-pop-close{position:absolute;right:7px;top:7px;width:28px!important;height:28px!important;padding:0!important;text-align:center!important}.ct298-stadium-badge{display:inline-flex;width:max-content;align-items:center;gap:4px;margin-top:2px;padding:4px 8px;border:1px solid rgba(222,172,52,.52);border-radius:999px;background:rgba(120,84,12,.24);color:#f2cf6a;font-size:9px;font-weight:800}.ct298-fy-note{margin:0 0 10px;padding:8px 10px;border:1px solid rgba(83,151,187,.35);border-radius:10px;background:rgba(8,33,45,.7);color:#9ec8dc;font-size:10px}.ct298-profile-stat{border:1px solid rgba(211,166,59,.38)!important;background:rgba(104,77,14,.14)!important}
`;
html=html.replaceAll('app-v297.js','app-v298.js').replaceAll('app-v297.css','app-v298.css').replaceAll('CineTracker • v1.0.88','CineTracker • v1.0.89');
sw=sw.replaceAll('ct-web-1.0.88-r297','ct-web-1.0.89-r298').replaceAll('app-v297.js','app-v298.js').replaceAll('app-v297.css','app-v298.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.89',revision:'r298-official-1.0.89',base:'r297-production',scope:'stadium-real-controls-profile-sports-exact-foryou-web-only',sports_stadium_ui:'real-ct255-watch-button-tv-or-stadium',profile_stadium_metric:'inside-esportes-assistidos',discover_foryou:'daily1+watchlist3+new3-bounded-complete',discover_foryou_no_infinite_loading:true,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v298.js'),js),writeFile(resolve(dist,'app-v298.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v297.js'),{force:true}),rm(resolve(dist,'app-v297.css'),{force:true})]);
console.log('WEB_R298_READY stadium real controls + Sports profile metric + exact Pra Você; Android preserved');