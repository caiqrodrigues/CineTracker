import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r301-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime,uiRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v301.js'),'utf8'),readFile(resolve(dist,'app-v301.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r302-discover-personal-stability.js'),'utf8'),readFile(resolve(root,'runtime-r302-ui-final.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r302 missing '+x)};
for(const x of["window.__ctWebBuild='1.0.92';window.__ctOfficialVersion='1.0.92';","const REVISION='r301-official-1.0.92';","window.__ctR301='f1-calendar-interactive+sports-next-wide+discover-fast-1-3-3+profile-stable'",'buildForYou301','ensureWatchButtons301','window.__ctR286'])must(js,x);
for(const x of["window.__ctR302='discover-watched-watchlist-block+foryou-authority+finite-sports-profile'","window.__ctR302Discover='watched+watchlist-excluded+canonical-add'","window.__ctR302Sports='filters-restored+365d-coverage+finite-repair'","window.__ctR302F1='no-drivers+clickable-calendar+complete-detail-modal'",'blocked302','watchKeys302','ensureSportsFilters302','applySportFilter302','enrichF1Modal302','365*86400000','cinetracker:data-changed'])must(runtime,x);
for(const x of["window.__ctR302UIFinal='detail-actions+top10-fit+f1-calendar+sports-sync-order+profile-preserved'","window.__ctR302Detail='related-open-watch-seen+cast-open'","window.__ctR302SportsFinal='f1-first+tabs-below+filters+manual-sync'",'relatedFallback','actorFallback','data-ct302-sports-sync','syncSports','preserveProfile','fitTop10'])must(uiRuntime,x);

/* r301 used an app-wide MutationObserver whose callback rewrote the same DOM. r302 ships no such observer. */
const obsStart=js.indexOf("let obsQueued301=false;const app301=q301('#app');");
const obsEnd=obsStart>=0?js.indexOf("\ndocument.addEventListener('click',e=>{",obsStart):-1;
if(obsStart<0||obsEnd<0)throw new Error('r302 could not locate r301 global observer');
js=js.slice(0,obsStart)+js.slice(obsEnd+1);
if(js.includes('obsQueued301')||js.includes('.observe(app301,{subtree:true,childList:true})'))throw new Error('r302 r301 observer survived removal');

/* Preserve the pre-r301 Statistics appearance. r301 copied Stadium card classes/icons into Watchlist counters. */
const profileStart=js.indexOf('function stabilizeProfile301(){');
const profileEnd=profileStart>=0?js.indexOf("\n\ntry{if(typeof paintSports255",profileStart):-1;
if(profileStart<0||profileEnd<0)throw new Error('r302 could not locate r301 profile visual mutation');
js=js.slice(0,profileStart)+"function stabilizeProfile301(){const root=q301('[data-profile]');if(!root)return false;root.dataset.ct301StatsStable='1';return true;}"+js.slice(profileEnd);

if(!js.includes('\nboot();'))throw new Error('r302 boot insertion missing');
js=js.replace("window.__ctWebBuild='1.0.92';window.__ctOfficialVersion='1.0.92';","window.__ctWebBuild='1.0.93';window.__ctOfficialVersion='1.0.93';")
 .replace("const REVISION='r301-official-1.0.92';","const REVISION='r302-official-1.0.93';")
 .replace('\nboot();','\n'+runtime+'\n'+uiRuntime+'\nboot();');
css+=String.raw`
/* CineTracker Web 1.0.93 r302 — finite lifecycle, restored Sports filters, F1/detail actions and compact Top 10. */
.ct302-sport-filters{display:flex!important;align-items:center;gap:8px;overflow-x:auto;max-width:100%;padding-block:4px;scrollbar-width:thin}
.ct302-sport-filters .chip{flex:0 0 auto}
.ct302-sports-sync{margin-left:auto!important;display:inline-flex!important;align-items:center;gap:6px;white-space:nowrap;flex:0 0 auto}
.ct302-sports-sync.loading span:first-child{animation:ct302spin .8s linear infinite}@keyframes ct302spin{to{transform:rotate(360deg)}}
.ct302-f1-extra{display:grid;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border,#303030)}
.ct302-f1-extra p{margin:0}
[data-ct301-f1-event],.ct301-f1-event{pointer-events:auto!important;cursor:pointer!important}
.ct169-related-card,.ct170-related-card,.ct169-related-open,.ct169-cast-card,.cast-card,.actor-card{cursor:pointer}
[data-discover] .ct171-top-row,[data-discover] [data-ct171-top-row],[data-discover] .ct170-top-row,[data-discover] [data-top10]{margin-top:0!important}
[data-discover] .ct171-top-row:first-child,[data-discover] [data-ct171-top-row]:first-child{transform:translateY(-8px)}
[data-discover] .panel:has(.ct171-top-row),[data-discover] .panel:has([data-top10]){margin-top:4px!important;padding-top:10px!important}
`;
html=html.replaceAll('app-v301.js','app-v302.js').replaceAll('app-v301.css','app-v302.css').replaceAll('CineTracker • v1.0.92','CineTracker • v1.0.93');
sw=sw.replaceAll('ct-web-1.0.92-r301','ct-web-1.0.93-r302').replaceAll('app-v301.js','app-v302.js').replaceAll('app-v301.css','app-v302.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.93',revision:'r302-official-1.0.93',base:'r301-production',scope:'discover-personal-detail-actions-top10-sports-filters-sync-f1-detail-profile-preserved-web-only',discover_seen_excluded:true,discover_watchlist_excluded:true,discover_add_watchlist:true,discover_for_you_fixed:true,detail_related_open:true,detail_related_watchlist:true,detail_related_seen:true,detail_cast_open:true,top10_viewport_fit:true,sports_profile_global_observer:false,sports_filters_restored:true,sports_manual_sync:true,sports_menu_below_f1:true,sports_next_days:365,f1_drivers_tab:false,f1_calendar_interactive:true,f1_calendar_detail_complete:true,profile_statistics_visual:'pre-r301-preserved',profile_watchlist_open_label:false,android:'1.0.20/10062'};
await Promise.all([writeFile(resolve(dist,'app-v302.js'),js),writeFile(resolve(dist,'app-v302.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v301.js'),{force:true}),rm(resolve(dist,'app-v301.css'),{force:true})]);
console.log('WEB_R302_READY Discover + detail interactions + Top10 fit + Sports filters/sync/order/365d + F1 detail/no Pilotos + preserved Profile; Android preserved');
