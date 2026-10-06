import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r489.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v489.js'),'utf8'),readFile(resolve(dist,'app-v489.css'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r490-final-authority.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r490 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r490 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r490 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r490 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function disableRuntime(source,anchor,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),needle="'use strict';",at=region.indexOf(needle);if(at<0)throw new Error('r490 missing strict '+label);const cut=at+needle.length;return source.slice(0,b.start)+region.slice(0,cut)+'\nreturn;\n'+region.slice(cut)+source.slice(b.end)}
const patch=(anchor,label,defs)=>{for(const [name,body] of defs)js=replaceNamed(js,anchor,name,body,label)};
patch("window.__ctR399Marker='startup-auth-current-rpc+home+direct-foryou';",'r399',[
 ['settleRoute399',"function settleRoute399(){return false}"],['bootProbe399',"function bootProbe399(){return false}"]
]);
patch("if(window.__ctR413?.version==='1.0.204')return;",'r413',[
 ['beginHomeEntry',"function beginHomeEntry(){return false}"],['scheduleForYou',"function scheduleForYou(){return false}"],['probe',"function probe(){return false}"]
]);
patch("if(window.__ctR415?.version==='1.0.206')return;",'r415',[
 ['homeProbe',"function homeProbe(){return false}"],['beginSeriesEntry',"function beginSeriesEntry(){return false}"],['repairForYou',"function repairForYou(){return false}"],['scheduleForYouRepair',"function scheduleForYouRepair(){return false}"],['updateSportsProfile',"async function updateSportsProfile(){return false}"],['renderProfile415',"async function renderProfile415(){return false}"],['bootProbe',"function bootProbe(){return false}"]
]);
patch("window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'",'r416',[
 ['ownFY',"function ownFY(){return false}"],['scheduleFY',"function scheduleFY(){return false}"],['pEnrich',"async function pEnrich(){return false}"],['renderProfile416',"async function renderProfile416(){return false}"],['probe',"function probe(){return false}"]
]);
patch("if(window.__ctR417?.version==='1.0.208')return;",'r417',[
 ['beginHome417',"function beginHome417(){return false}"],['repairForYou417',"function repairForYou417(){return false}"],['scheduleForYou417',"function scheduleForYou417(){return false}"],['loadProfileSports417',"async function loadProfileSports417(){return false}"]
]);
patch("if(window.__ctR418?.version==='1.0.209')return;",'r418',[
 ['startHome418',"function startHome418(){return false}"],['repairFY418',"function repairFY418(){return false}"],['scheduleFY418',"function scheduleFY418(){return false}"],['loadProfile418',"async function loadProfile418(){return false}"]
]);
patch("if(window.__ctR420?.version==='1.0.211')return;",'r420',[
 ['scheduleDiscover420',"function scheduleDiscover420(){return false}"],['loadProfile420',"async function loadProfile420(){return false}"]
]);
patch("if(window.__ctR421?.version==='1.0.212')return;",'r421',[
 ['scheduleForYouSanitize421',"function scheduleForYouSanitize421(){return false}"],['loadProfile421',"async function loadProfile421(){return false}"]
]);
patch("if(window.__ctR424?.version==='1.0.215')return;",'r424',[
 ['normalizeProfileLists424',"function normalizeProfileLists424(){return false}"],['loadProfile424',"async function loadProfile424(){return false}"],['gateHomeSeries424',"async function gateHomeSeries424(){return false}"]
]);
patch("if(window.__ctR425?.version==='1.0.216')return;",'r425',[
 ['homeEntry425',"function homeEntry425(){return false}"],['profileCanonical425',"function profileCanonical425(){return false}"]
]);
patch("if(window.__ctR426?.version==='1.0.217')return;",'r426',[
 ['scheduleFY',"function scheduleFY(){return false}"],['stabilizeProfile',"async function stabilizeProfile(){return false}"]
]);
js=disableRuntime(js,"window.__ctR427Marker='discover-foryou-visible-owner-v421';",'r427');
js=disableRuntime(js,"window.__ctR429Marker='discover-foryou-single-owner-v421';",'r429');
patch("if(window.__ctR467?.version==='1.0.257')return;",'r467',[
 ['applyProfile467',"function applyProfile467(){return false}"],['scheduleProfile467',"function scheduleProfile467(){return false}"]
]);
patch("if(window.__ctR468?.version==='1.0.258')return;",'r468',[
 ['wake468',"function wake468(){installBridge468();return route468()}"],['authWake468',"async function authWake468(){installBridge468();return !!session468()?.access_token}"]
]);
patch("if(window.__ctR469?.version==='1.0.259')return;",'r469',[
 ['wake469',"function wake469(){install469();return route469()}"],['authWake469',"async function authWake469(){install469();return !!session469()?.access_token}"]
]);
patch("if(window.__ctR471?.version==='1.0.261')return;",'r471',[
 ['wakeHome',"function wakeHome(){releaseHomeGate();return true}"],['scheduleHome',"function scheduleHome(){releaseHomeGate();return true}"],
 ['loadMediaLists',"async function loadMediaLists(){return null}"],['loadActors',"async function loadActors(){return[]}"],
 ['applyProfile',"function applyProfile(){bindDailyAuthority();return false}"],['scheduleProfile',"function scheduleProfile(){bindDailyAuthority();return false}"]
]);
patch("if(window.__ctR472?.version==='1.0.262')return;",'r472',[
 ['repairHome',"function repairHome(){return false}"],['scheduleHome',"function scheduleHome(){return false}"],['activateForYou',"function activateForYou(){return false}"],['scheduleForYou',"function scheduleForYou(){return false}"],
 ['loadMedia',"async function loadMedia(){return null}"],['loadActors',"async function loadActors(){return[]}"],['loadStadium',"async function loadStadium(){return null}"],
 ['applyProfile',"function applyProfile(){return false}"],['scheduleProfile',"function scheduleProfile(){return false}"]
]);
patch("if(window.__ctR476?.version==='1.0.266')return;",'r476',[
 ['primeHome',"function primeHome(){return false}"],['paintProfile',"function paintProfile(){return false}"],['loadProfile',"async function loadProfile(){return null}"],['scheduleProfile',"function scheduleProfile(){return false}"]
]);
patch("if(window.__ctR477?.version==='1.0.267')return;",'r477',[
 ['bootHome',"function bootHome(){return false}"],['loadSports',"async function loadSports(){return null}"],['settleProfile',"function settleProfile(){return false}"]
]);
patch("if(window.__ctR481?.version==='0.3.8')return;",'r481',[['prime',"function prime(){return false}"]]);
const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
patch(A464,'r464',[
 ['load',"async function load(force=false){\n setForYouState();if(routeNow()!=='discover')return false;if(loadTask)return loadTask;\n if(force&&document.documentElement.dataset.ct490ForYouReady==='1'){render();return true}\n const token=++loadToken;if(!q('[data-ct464-foryou]',root464()))renderLoading();\n loadTask=(async()=>{try{\n  const raw=unwrap(await timeout(rpcCall('cinetracker_foryou_payload_v490',{p_watch_limit:30,p_fresh_limit:48}),9000))||{},next=emptyState(),kinds=['movie','series','anime'];\n  for(const k of kinds){next.watch[k]=rows(raw?.watch?.[k]);next.fresh[k]=rows(raw?.fresh?.[k])}\n  if(!kinds.every(k=>next.watch[k].length&&next.fresh[k].length))throw new Error('v490 incomplete pools');\n  if(token!==loadToken||routeNow()!=='discover')return false;state=next;chooseDaily();\n  let cycle=1;try{cycle=(Number(sessionStorage.getItem('ct490:foryou-cycle')||0)+1)%100000;sessionStorage.setItem('ct490:foryou-cycle',String(cycle))}catch{cycle=Date.now()%100000}\n  kinds.forEach((k,i)=>{state.idx.watch[k]=(cycle+i*3)%state.watch[k].length;state.idx.fresh[k]=(cycle+i*5+1)%state.fresh[k].length});\n  render();document.documentElement.dataset.ct490ForYouReady='1';document.documentElement.dataset.ct490ForYou='compact-v490';\n  document.documentElement.dataset.ct464PoolCounts=JSON.stringify({watch:Object.fromEntries(kinds.map(k=>[k,state.watch[k].length])),fresh:Object.fromEntries(kinds.map(k=>[k,state.fresh[k].length]))});return true;\n }catch(e){if(token===loadToken){delete document.documentElement.dataset.ct490ForYouReady;document.documentElement.dataset.ct490ForYouError=String(e?.message||e);const root=root464();if(root)root.innerHTML='<div data-ct464-foryou><div class=\"panel\"><div class=\"empty\">Não foi possível carregar as indicações. <button type=\"button\" class=\"chip\" data-ct490-foryou-retry>Tentar novamente</button></div></div></div>'}return false}\n finally{if(token===loadToken)loadTask=null}})();return loadTask;\n}"],
 ['activate',"function activate(){\n setForYouState();qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]').forEach(b=>{if(isForYouControl(b))b.classList.add('active')});\n if(document.documentElement.dataset.ct490ForYouReady==='1'){render();return true}\n if(!q('[data-ct464-foryou]',root464()))renderLoading();void load(false);return true;\n}"]
]);
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r490-official-0.3.17';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.17 • ${REVISION}');
js=js.replace("navigator.serviceWorker.register('/service-worker.js')","navigator.serviceWorker.register('/service-worker.js',{updateViaCache:'none'})");
new Function(runtime);js+='\n'+runtime+'\n';
html=html.replaceAll('app-v489.js','app-v490.js').replaceAll('app-v489.css','app-v490.css').replaceAll('v0.3.16','v0.3.17').replaceAll('r489-official-0.3.16','r490-official-0.3.17');
css+='\n/* CineTracker Web 0.3.17 r490 — final requested-screen authority. */\n';
const sw=String.raw`const CT_MEDIA_CACHE='ct-media-r490';
self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CT_MEDIA_CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;let url;try{url=new URL(req.url)}catch{return}if(!/image\.tmdb\.org$/.test(url.hostname))return;event.respondWith((async()=>{const cache=await caches.open(CT_MEDIA_CACHE),hit=await cache.match(req);const net=fetch(req).then(r=>{if(r&&r.ok)cache.put(req,r.clone());return r}).catch(()=>null);return hit||await net||Response.error()})())});
`;
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.17',revision:'r490-official-0.3.17',base:'r489+r490-real-video-authority',
 scope:'retire-legacy-visible-writers+compact-foryou+single-profile-paint+service-worker-shell-network',
 home_series:'r388 is the only visible Home data owner; r399/r413/r415/r417/r418/r424/r425/r468/r469/r471/r472/r476/r477/r481 wake/repaint paths are retired',
 home_movies:'native v405 2:3 grid remains the only movie Watchlist renderer; legacy Home wake paths are retired',
 discover_foryou:'cinetracker_foryou_payload_v490 is compact (about 49 KB vs 628 KB v489 in production verification) and r464 is the only visible Pra Você owner',
 profile_lists:'single final paint uses profile v380 + summary v489; exactly 12 cards per list and full counts 249/962/17/45/21 verified for the active profile',
 profile_sports:'single final paint uses sport_stats_v421 + stadium v296; verified 171 events and 1 stadium event; legacy 81/0 writers retired',
 service_worker:'app shell and JS/CSS are network-owned; SW only caches TMDB images and deletes legacy caches on activation',
 top10:'strict 2:3 geometry enforced',f1:'preserved',sports:'sports route preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v490.js'),js),writeFile(resolve(dist,'app-v490.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v489.js'),{force:true}),rm(resolve(dist,'app-v489.css'),{force:true})]);
for(const need of ["window.__ctR490Marker='real-video-authority+legacy-writers-retired+compact-foryou+profile-single-paint+sw-network-shell'",'cinetracker_foryou_payload_v490','cinetracker_profile_summary_v489','cinetracker_sport_stats_v421','cinetracker_sports_stadium_summary_v296','r490-official-0.3.17'])if(!js.includes(need))throw new Error('r490 missing '+need);
console.log('WEB_R490_READY real-video-authority');