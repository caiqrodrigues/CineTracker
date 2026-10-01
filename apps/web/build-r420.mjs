import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r419.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v419.js'),'utf8'),readFile(resolve(dist,'app-v419.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r420-standup-f1-profile.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r420 forbidden '+bad);
for(const need of ['window.__ctR420Marker','isStandup420','cinetracker_profile_watchlist_runtime_v420','cinetracker_sport_stats_v420','cinetracker_f1_episode_watch_set_v420'])if(!runtime.includes(need))throw new Error('r420 runtime missing '+need);
const f1Legacy="const watch=target.closest('[data-ct311-f1-watch]');if(watch){void toggleF1Session311(watch);return true}";
if(!js.includes(f1Legacy))throw new Error('r420 missing r311 lexical F1 capture');
js=js.replace(f1Legacy,"const watch=target.closest('[data-ct311-f1-watch]');if(watch){void window.__ctR420?.toggleF1?.(watch);return true}");
const f1Mount="back.__ct311Race=race;document.body.appendChild(back);";
if(!js.includes(f1Mount))throw new Error('r420 missing r311 F1 modal mount');
js=js.replace(f1Mount,f1Mount+"queueMicrotask(()=>{try{window.__ctR420?.scheduleF1Sync?.()}catch{}});");
const fyPools="const id=group+':'+type,name=group==='watch'?'cinetracker_discover_watch_unseen_v396':'cinetracker_discover_fresh_v387';";
if(!js.includes(fyPools))throw new Error('r420 missing r411 pool authority');
js=js.replace(fyPools,"const id=group+':'+type,name=group==='watch'?'cinetracker_discover_watch_unseen_v420':'cinetracker_discover_fresh_v420';");
const profileLimit='rows.slice(0,10).map(mediaCard)';
const profileLimitCount=js.split(profileLimit).length-1;
if(profileLimitCount<1)throw new Error('r420 profile card limit source missing');
js=js.replaceAll(profileLimit,'rows.map(mediaCard)');
js=js.replace("window.__ctWebBuild='1.0.210';window.__ctOfficialVersion='1.0.210';","window.__ctWebBuild='1.0.211';window.__ctOfficialVersion='1.0.211';")
     .replace("const REVISION='r419-official-1.0.210';","const REVISION='r420-official-1.0.211';")
     .replace("const version='1.0.210',revision='r419-official-1.0.210';","const version='1.0.211',revision='r420-official-1.0.211';")
     .replace('boot();',runtime+'\nboot();');
html=html.replaceAll('app-v419.js','app-v420.js').replaceAll('app-v419.css','app-v420.css').replaceAll('v1.0.210','v1.0.211').replaceAll('r419-official-1.0.210','r420-official-1.0.211');
sw=sw.replaceAll('ct-web-1.0.210-r419','ct-web-1.0.211-r420').replaceAll('app-v419.js','app-v420.js').replaceAll('app-v419.css','app-v420.css');
css+='\n/* CineTracker Web 1.0.211 r420 */\n[data-page="profile"] .panel>.row{box-sizing:border-box!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overflow-y:hidden!important;padding-right:16px!important;scroll-padding-right:16px!important}\n[data-page="profile"] .panel>.row>.card{flex:0 0 150px!important;min-width:150px!important;max-width:150px!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.211',revision:'r420-official-1.0.211',base:'r419+r420-standup-f1-profile',scope:'standup-global-discover+f1-pure-series+profile-watchlist-time+full-profile-rails',discover:'stand-up is excluded by v420 pools and client eligibility; shorts/youtube/reality/soap/WWE rules remain',f1:'r311 lexical capture delegates directly to media_id 865 series writer; no generic sports mirror',profile:'watchlist runtime totals are authoritative and profile rails render all returned cards',android:'unchanged-1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v420.js'),js),writeFile(resolve(dist,'app-v420.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v419.js'),{force:true}),rm(resolve(dist,'app-v419.css'),{force:true})]);
console.log('WEB_R420_READY profileLimitPatched='+profileLimitCount);
