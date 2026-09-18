import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';

await import('./build-r313.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v313.js'),'utf8'),
  readFile(resolve(dist,'app-v313.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r314-urgent-fixes.js.gz.b64'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r314 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r314 missing '+x)};
for(const x of[
  "window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';",
  "const REVISION='r313-official-1.0.104';",
  "const version='1.0.104',revision='r313-official-1.0.104';",
  "window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'",
  "\nboot();"
])must(js,x);
runtime=gunzipSync(Buffer.from(runtime.trim(),'base64')).toString('utf8');
// The public Discover card must default to the minimal native + action.
// r314's first cut left card314's default watch mode enabled, so the browser
// regression rendered a saved-state check instead of data-ct288-add.
const card314Sig=runtime.match(/function card314\(x,\{([^}]*)\}=\{\}\)\{/);
if(!card314Sig||!/\bwatch\s*=/.test(card314Sig[1]))throw new Error('r314 card314 signature not found');
const card314Opts=card314Sig[1].replace(/\bwatch\s*=\s*[^,}]+/,'watch=false');
runtime=runtime.replace(card314Sig[0],`function card314(x,{${card314Opts}}={}){`);
const minimalPlusHelper=String.raw`
function ct314MinimalPlus(html){
 const src=String(html||''),marker='<div class="ct291-card-footer';
 const start=src.indexOf(marker);if(start<0)return src;
 const attr='data-ct288-add="',at=src.indexOf(attr,start);if(at<0)return src;
 const idStart=at+attr.length,idEnd=src.indexOf('"',idStart);if(idEnd<0)return src;
 const close=src.indexOf('</div>',idEnd);if(close<0)return src;
 const key=src.slice(idStart,idEnd);
 const button='<button type="button" class="ct288-state ct314-minimal-plus" data-ct288-add="'+key+'" aria-label="Adicionar à Watchlist">+</button>';
 return (src.slice(0,start)+button+src.slice(close+6)).replace('ct291-has-footer','ct291-no-footer ct314-minimal-card');
}
`
if(!runtime.includes('ct288Card(x,{rank,watch,add:!watch})'))throw new Error('r314 card call not found');
runtime=minimalPlusHelper+runtime.replace(
 'ct288Card(x,{rank,watch,add:!watch})',
 'ct314MinimalPlus(ct288Card(x,{rank,watch,add:!watch}))'
);
const early314=`(()=>{if(window.__ctR314EarlyCapture)return;window.__ctR314EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR314EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r314 insertion');
js=early314+'\n'+js;
js=once(js,"window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';","window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';",'Web version');
js=once(js,"const REVISION='r313-official-1.0.104';","const REVISION='r314-official-1.0.105';",'revision');
js=once(js,"const version='1.0.104',revision='r313-official-1.0.104';","const version='1.0.105',revision='r314-official-1.0.105';",'footer identity');
html=html.replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css').replaceAll('v1.0.104','v1.0.105').replaceAll('r313-official-1.0.104','r314-official-1.0.105');
sw=sw.replaceAll('ct-web-1.0.104-r313','ct-web-1.0.105-r314').replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css');
css+='\n/* CineTracker Web 1.0.105 r314 — strict nine-tab Discover, stable live Profile, F1 detail drawer. */\n';
const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.105',revision:'r314-official-1.0.105',base:'r313-production',
 scope:'profile-live-static-watchlist+discover-nine-tabs-strict-cache+f1-race-details',
 discover_tabs:9,discover_releases_restored:true,discover_strict_tabs:['trending','popular','new','releases','anticipated','top'],
 discover_public_exclusion:'seen+watchlist+alias-before-markup',discover_card_action:'minimal-plus',discover_cache:'stale-while-revalidate-5m+background-prefetch',
 discover_foryou:'compact-2:3-three-slot',profile_renderer:'r314-live-supabase-only',profile_watchlist_stats:'static-no-chevron-no-modal',
 profile_stats_position:'top-stable',profile_actor_rail:'only-horizontal-overflow-fixed-images',
 f1_detail:'qualifying+final+delta+dnf+fastest-lap',f1_previous_gp_details:true,f1_session_watch_rpc:'cinetracker_f1_session_watch_set_v314',
 android:'1.0.20/10062'
};
for(const x of[
 "window.__ctR314='profile-live-static-watchlist+discover-nine-tabs-strict-cache+f1-race-details'",
 "['releases','Lançamentos']","const STRICT=new Set(['trending','popular','new','releases','anticipated','top'])",
 "stale-while-revalidate","cinetracker_profile_payload_v0997","ct314-static-stat","ct314-actor-rail",
 "Grid de Largada · Classificação","Resultado Final de Chegada","ct314-dnf","ct314-fastest","cinetracker_f1_session_watch_set_v314",
 "window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'",
 "const version='1.0.105',revision='r314-official-1.0.105';"
])must(js,x);
if(js.indexOf('window.__ctR314EarlyCapture=true')>js.indexOf('window.__ctR313EarlyCapture=true'))throw new Error('r314 capture is not first');
if(release.android!=='1.0.20/10062')throw new Error('r314 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v314.js'),js),writeFile(resolve(dist,'app-v314.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v313.js'),{force:true}),rm(resolve(dist,'app-v313.css'),{force:true})]);
console.log('WEB_R314_READY strict Discover + live Profile + F1 race details; Android preserved');
