import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r263-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v263.js'),'utf8'),readFile(resolve(dist,'app-v263.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r264-home-watched-discover-sports-detail-scroll.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r264 missing '+label)};
for(const x of["window.__ctR263='approved-home-list-discover-intelligence-f1-watched'","const REVISION='r263-official-1.0.54';","function personal263(force=false)","function enhanceF1Watch263(force=false)","window.__ctR263Test={"])must(js,x,x);
for(const x of["window.__ctR264='home-watched-stable-discover-single-sports-order-detail-rails'","window.__ctR264Home='stable-tab+side-watched-episode-movie+canonical-mark-watch'","window.__ctR264Discover='single-nine-tabs+canonical-exclusions+local-rails+top10-streaming'","window.__ctR264Sports='f1-first-synchronous-order+watched-panel-persistent'","window.__ctR264Detail='generic-season-episode-chart-related-similar-cast-local-x'","cinetracker_mark_watch_v0994","function reorderSports264()","function semanticRails264(root=document)"])must(runtime,x,x);

/* Strengthen r263 personal exclusions at the data authority itself. Public browse excludes the
   complete personal library/watchlist, while recommendation freshness remains specific to Pra Você. */
const personalRx=/async function personal263\(force=false\)\{[\s\S]*?\n\}\nfunction strictEligible263/;
if(!personalRx.test(js))throw new Error('r264 cannot locate r263 personal authority');
const personal264=`async function personal263(force=false){
 if(!force&&discover263.personal&&Date.now()-discover263.personalAt<120000)return discover263.personal;
 const bad=Symbol.for('ct264-personal-fail');
 let state=await timeout263(rpc('cinetracker_recommendation_state_v108',{}),4200,bad);
 if(state===bad){const old=await timeout263(rpc('cinetracker_recommendation_state_v107',{}),4200,bad);state=old===bad?{hard_excluded:[],fresh_excluded:[],watchlist:[]}:{hard_excluded:old?.fresh_excluded||[],fresh_excluded:old?.fresh_excluded||[],watchlist:[]}}
 const [dash,full]=await Promise.all([
  timeout263(rpc('cinetracker_profile_media_dashboard_v0991',{}),5000,[]),
  timeout263(rpc('cinetracker_watchlist_full_v119',{}),5000,{rows:[]})
 ]);
 const hard=rowsSet263(state?.hard_excluded),fresh=rowsSet263(state?.fresh_excluded),watch=union263(rowsSet263(state?.watchlist),rowsSet263(full?.rows));
 for(const x of Array.isArray(dash)?dash:[]){const k=key263(x);if(!k||/:0$/.test(k))continue;const st=norm263(x?.user_state||x?.state||'');if(x?.is_seen||x?.is_completed||x?.is_in_progress||x?.is_up_to_date||n263(x?.watched_episodes)>0||x?.is_not_interested||/not interested|nao interessado/.test(st))hard.add(k);if(x?.is_watchlist||x?.is_added_to_watchlist||x?.is_watch_later)watch.add(k)}
 const watchlist=[...(Array.isArray(state?.watchlist)?state.watchlist:[]),...(Array.isArray(full?.rows)?full.rows:[])];
 const p={raw:state,hard,fresh,watch,excluded:union263(hard,watch),watchlist};discover263.personal=p;discover263.personalAt=Date.now();return p;
}
function strictEligible263`;
js=js.replace(personalRx,personal264);

/* Expose only the already-existing r263 F1 panel enhancer so r264 can immediately restore it
   after the inherited Sports painter rebuilds the hub. */
js=js.replace('window.__ctR263Test={','window.__ctR263EnhanceF1Watch=enhanceF1Watch263;window.__ctR263Test={');
if(!js.includes('window.__ctR263EnhanceF1Watch=enhanceF1Watch263'))throw new Error('r264 F1 bridge missing');
if(!js.includes('\nboot();'))throw new Error('r264 boot insertion point missing');
js=js.replace('\nboot();','\n'+runtime+'\nboot();');
js=js.replace("const REVISION='r263-official-1.0.54';","const REVISION='r264-official-1.0.55';")
 .replace("window.__ctWebBuild='1.0.54';window.__ctOfficialVersion='1.0.54';","window.__ctWebBuild='1.0.55';window.__ctOfficialVersion='1.0.55';")
 .replaceAll('CineTracker • v1.0.54','CineTracker • v1.0.55')
 .replaceAll("JSON.stringify({version:'1.0.54',revision:REVISION","JSON.stringify({version:'1.0.55',revision:REVISION");

css+=`\n/* CineTracker Web 1.0.55 r264 — stable Home actions + generic component-owned horizontal rails. */
html,body,#app{width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#app,.app,.content,.page,[data-home],[data-discover],[data-sports],[data-series-detail],[data-movie-detail]{min-width:0!important;max-width:100%!important}
.ct264-home-action-row{box-sizing:border-box!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:9px!important;align-items:center!important;width:100%!important;max-width:100%!important;min-width:0!important}
.ct264-home-action-row>.media-row,.ct264-home-action-row>.ct255-home-movie-card{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important}
.ct264-watch-btn{box-sizing:border-box!important;display:block!important;flex:0 0 auto!important;align-self:center!important;border:1px solid #316b8a!important;background:#0b2939!important;color:#c8ecfb!important;border-radius:10px!important;padding:8px 10px!important;font:inherit!important;font-size:11px!important;font-weight:700!important;line-height:1.2!important;white-space:nowrap!important;cursor:pointer!important}
.ct264-watch-btn:disabled{opacity:.58!important;cursor:default!important}
.ct264-local-x{box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:auto!important;overflow-y:hidden!important;overscroll-behavior-x:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-x pan-y!important;scrollbar-width:thin!important;scrollbar-gutter:stable!important}
.ct264-local-x::-webkit-scrollbar{height:9px!important}.ct264-local-x::-webkit-scrollbar-thumb{background:rgba(92,184,232,.68)!important;border-radius:999px!important}.ct264-local-x::-webkit-scrollbar-track{background:rgba(5,22,31,.8)!important;border-radius:999px!important}
[data-ct264-sports-order="f1-tabs-filters-feed"]{display:block!important;min-width:0!important}
@media(max-width:700px){.ct264-home-action-row{grid-template-columns:minmax(0,1fr) auto!important;gap:6px!important}.ct264-watch-btn{padding:7px 8px!important;font-size:9px!important;max-width:132px!important;white-space:normal!important}}
`;

html=html.replaceAll('r263-official-1.0.54','r264-official-1.0.55').replace(/app-v263\.js/g,'app-v264.js').replace(/app-v263\.css/g,'app-v264.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('r264 service-worker CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.55-r264';").replace(/app-v263\.js/g,'app-v264.js').replace(/app-v263\.css/g,'app-v264.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v264.js'),js,'utf8'),writeFile(resolve(dist,'app-v264.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.55',revision:'r264-official-1.0.55',base:'r263-official-1.0.54',scope:'stable-home-watched-single-discover-f1-first-sports-generic-detail-rails',home:'stable-selected-tab+side-watched-episode-movie+canonical-mark-watch',discover:'single-nine-tabs+dashboard-watchlist-exclusions+top10-streaming+local-rails',sports:'f1-first-synchronous-order+canonical-watched-panel',detail:'generic-season-episode-chart-related-similar-cast-local-x',horizontal:'document-fixed+persistent-semantic-component-x',android:'unchanged-1.0.20',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v263.js'),{force:true}),rm(resolve(dist,'app-v263.css'),{force:true})]);
console.log('WEB_1_0_55_READY r264 stable-home-watched discover-single sports-f1-first generic-detail-rails');
