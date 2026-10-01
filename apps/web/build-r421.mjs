import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r420.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v420.js'),'utf8'),readFile(resolve(dist,'app-v420.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r421-standup-f1-profile.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r421 forbidden '+bad);
for(const need of ['window.__ctR421Marker','filterRecommendations421','cinetracker_profile_watchlist_runtime_v421','cinetracker_sport_stats_v421','cinetracker_f1_episode_watch_set_v421'])if(!runtime.includes(need))throw new Error('r421 runtime missing '+need);

const f1Delegate="const watch=target.closest('[data-ct311-f1-watch]');if(watch){void window.__ctR420?.toggleF1?.(watch);return true}";
if(!js.includes(f1Delegate))throw new Error('r421 missing r420 F1 delegate');
js=js.replace(f1Delegate,"const watch=target.closest('[data-ct311-f1-watch]');if(watch){void window.__ctR421?.toggleF1?.(watch);return true}");

const f1Sync="queueMicrotask(()=>{try{window.__ctR420?.scheduleF1Sync?.()}catch{}});";
if(!js.includes(f1Sync))throw new Error('r421 missing r420 F1 modal sync');
js=js.replace(f1Sync,"queueMicrotask(()=>{try{window.__ctR421?.scheduleF1Sync?.()}catch{}});");

const f1LegacyHistory="const hist=await loadF1History311(false);";
if(!js.includes(f1LegacyHistory))throw new Error('r421 missing legacy F1 history read');
js=js.replace(f1LegacyHistory,"const hist=[];");

for(const pool of ['cinetracker_discover_watch_unseen_v420','cinetracker_discover_fresh_v420'])if(!js.includes(pool))throw new Error('r421 missing '+pool);
js=js.replaceAll('cinetracker_discover_watch_unseen_v420','cinetracker_discover_watch_unseen_v421')
     .replaceAll('cinetracker_discover_fresh_v420','cinetracker_discover_fresh_v421');

js=js.replace("window.__ctWebBuild='1.0.211';window.__ctOfficialVersion='1.0.211';","window.__ctWebBuild='1.0.212';window.__ctOfficialVersion='1.0.212';")
     .replace("const REVISION='r420-official-1.0.211';","const REVISION='r421-official-1.0.212';")
     .replace("const version='1.0.211',revision='r420-official-1.0.211';","const version='1.0.212',revision='r421-official-1.0.212';")
     .replace('boot();',runtime+'\nboot();');
html=html.replaceAll('app-v420.js','app-v421.js').replaceAll('app-v420.css','app-v421.css').replaceAll('v1.0.211','v1.0.212').replaceAll('r420-official-1.0.211','r421-official-1.0.212');
sw=sw.replaceAll('ct-web-1.0.211-r420','ct-web-1.0.212-r421').replaceAll('app-v420.js','app-v421.js').replaceAll('app-v420.css','app-v421.css');
css+='\n/* CineTracker Web 1.0.212 r421 — Profile rails, no layout redesign */\n[data-page="profile"] [data-profile] .panel>.row{box-sizing:border-box!important;display:flex!important;flex-flow:row nowrap!important;align-items:flex-start!important;width:100%!important;max-width:none!important;min-width:0!important;overflow-x:auto!important;overflow-y:visible!important;padding:2px 16px 12px 2px!important;scroll-padding-right:16px!important}\n[data-page="profile"] [data-profile] .panel>.row>.card{box-sizing:border-box!important;flex:0 0 150px!important;width:150px!important;min-width:150px!important;max-width:150px!important}\n[data-page="profile"] [data-profile] .panel>.row>.card:last-child{margin-right:16px!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.212',revision:'r421-official-1.0.212',base:'r420+r421-standup-f1-profile',scope:'standup-hard-block+f1-series-only+profile-watchlist-truth+full-profile-rails',discover:'stand-up blocked after TMDB detail validation in Pra Voce, public tabs and Top 10; prior short/youtube/reality/soap/WWE/personal filters preserved',f1:'F1 Hub reads and writes only series media_id 865 episode state; legacy generic-sports history is not used to paint session status',profile:'watchlist times patched by semantic labels from v421 nonzero authority; all returned Series/Movie cards remain reachable to rail end',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v421.js'),js),writeFile(resolve(dist,'app-v421.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v420.js'),{force:true}),rm(resolve(dist,'app-v420.css'),{force:true})]);
console.log('WEB_R421_READY');
