import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r313.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v313.js'),'utf8'),
 readFile(resolve(dist,'app-v313.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r314-video-truth.js'),'utf8')
]);

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error('r314 expected one '+label+', found '+n);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r314 missing '+x)};
function replaceFunction(src,name,replacement){
 const sig='function '+name+'(';const start=src.indexOf(sig);if(start<0)throw new Error('r314 missing function '+name);
 const open=src.indexOf('{',start);let depth=0,quote='',esc=false;
 for(let i=open;i<src.length;i++){const ch=src[i];if(quote){if(esc){esc=false;continue}if(ch==='\\\\'){esc=true;continue}if(ch===quote){quote='';continue}continue}if(ch==="'"||ch==='"'||ch.charCodeAt(0)===96){quote=ch;continue}if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return src.slice(0,start)+replacement+src.slice(i+1)}
 throw new Error('r314 unterminated function '+name);
}
function containingFunction(src,index){
 const prefix=src.slice(0,index),re=/function\\s+([A-Za-z_$][\\w$]*)\\s*\\([^)]*\\)\\s*\\{/g;let m,last=null;
 while((m=re.exec(prefix)))last={name:m[1],start:m.index};if(!last)return null;
 const open=src.indexOf('{',last.start);let depth=0,quote='',esc=false;
 for(let i=open;i<src.length;i++){const ch=src[i];if(quote){if(esc){esc=false;continue}if(ch==='\\\\'){esc=true;continue}if(ch===quote){quote='';continue}continue}if(ch==="'"||ch==='"'||ch.charCodeAt(0)===96){quote=ch;continue}if(ch==='{')depth++;else if(ch==='}'&&--depth===0){if(index<=i)return{...last,end:i};break}}
 return null;
}

for(const x of[
 "window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';",
 "const REVISION='r313-official-1.0.104';",
 "window.__ctR313='discover-approved-card+hidden-filter+sports-producer-filter+profile-single-render'",
 "window.__ctR313EarlyCapture=true",
 "async function loadSports255(",
 "async function toggleFavorite255(",
 "async function toggleSport255(",
 "const version='1.0.104',revision='r313-official-1.0.104';",
 "\\nboot();"
])must(js,x);

{
 const markers=['Seu registro','Fórmula 1 assistida','Formula 1 assistida'];let found=0,names=[];
 for(const marker of markers){for(;;){const i=js.indexOf(marker);if(i<0)break;const fn=containingFunction(js,i);if(!fn)throw new Error('r314 F1 watch-summary marker is not inside a named function: '+marker);names.push(fn.name);const repl='function '+fn.name+'(){return \'\'}';js=js.slice(0,fn.start)+repl+js.slice(fn.end+1);found++}}
 if(!found)throw new Error('r314 could not find F1 watch-summary producer');
 if(js.includes('Seu registro')||js.includes('Fórmula 1 assistida')||js.includes('Formula 1 assistida'))throw new Error('r314 F1 watch-summary text survived');
 console.log('R314_RETIRED_F1_WATCH_SUMMARY', [...new Set(names)].join(','));
}

js=once(js,
 "async function loadSports255(",
 "async function sportsRpc314(name,args){try{return await rpc(name,args)}catch(e){if(!/jwt\\\\s*expired|token\\\\s*expired|invalid\\\\s*jwt/i.test(String(e?.message||e||'')))throw e;await restoreSession();return rpc(name,args)}}\\nasync function loadSports255(",
 'Sports JWT helper'
);
js=replaceFunction(js,'loadSports255',"async function loadSports255(force=false){if(!force&&sport255.payload&&Date.now()-sport255.at<45000)return sport255.payload;const p=await sportsRpc314('cinetracker_sports_payload_v1',{p_from:new Date(Date.now()-4*86400000).toISOString(),p_to:new Date(Date.now()+9*86400000).toISOString()});sport255.payload=p||{};sport255.at=Date.now();return sport255.payload}");
js=replaceFunction(js,'toggleFavorite255',"async function toggleFavorite255(btn){const id=n255(btn.dataset.ct255Fav),enabled=btn.dataset.on!=='1';await sportsRpc314('cinetracker_sport_toggle_favorite_v1',{p_entity_id:id,p_enabled:enabled});sport255.payload=null;sport255.at=0;await loadSports255(true);if(route()==='sports')paintSports255()}");
js=replaceFunction(js,'toggleSport255',"async function toggleSport255(btn){const provider=btn.dataset.provider,id=btn.dataset.ct255Watch,watched=btn.dataset.watched==='1';await sportsRpc314('cinetracker_sport_mark_watched_v1',{p_provider:provider,p_provider_event_id:id,p_watched:!watched,p_watched_at:new Date().toISOString(),p_duration_minutes:null});sport255.payload=null;sport255.at=0;await loadSports255(true);if(route()==='sports')paintSports255();document.dispatchEvent(new CustomEvent('cinetracker:data-changed'))}");

const early314="(()=>{if(window.__ctR314EarlyCapture)return;window.__ctR314EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR314EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();";
js=once(js,"const version='1.0.104',revision='r313-official-1.0.104';","const version='1.0.105',revision='r314-official-1.0.105';",'footer identity');
js=once(js,'\\nboot();','\\n'+runtime+'\\nboot();','r314 insertion');
js=early314+'\\n'+js;
js=once(js,"window.__ctWebBuild='1.0.104';window.__ctOfficialVersion='1.0.104';","window.__ctWebBuild='1.0.105';window.__ctOfficialVersion='1.0.105';",'Web version');
js=once(js,"const REVISION='r313-official-1.0.104';","const REVISION='r314-official-1.0.105';",'revision');

html=html.replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css').replaceAll('v1.0.104','v1.0.105').replaceAll('r313-official-1.0.104','r314-official-1.0.105');
sw=sw.replaceAll('ct-web-1.0.104-r313','ct-web-1.0.105-r314').replaceAll('app-v313.js','app-v314.js').replaceAll('app-v313.css','app-v314.css');
css+='\\n/* CineTracker Web 1.0.105 r314 — final Discover, no F1 watched-summary, stable Profile sports collapse. */\\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,version:'1.0.105',revision:'r314-official-1.0.105',base:'r313-production',
 scope:'video-truth-discover-f1-profile-collapse-web-only',
 discover_renderer:'r314-final-all-except-top10',
 discover_public_tabs:'trending+popular+new+anticipated+top',
 discover_public_exclusion:'seen+watchlist+alias-before-markup',
 discover_calendar_renderer:'r314-date-groups-fixed-card-width',
 discover_calendar_narrow_slivers:false,
 discover_foryou_renderer:'r314-compact-single-panel',
 discover_foryou_legacy_buttons:false,
 discover_actions:'compact-static-watchlist+seen',
 discover_metadata_unclipped:true,
 discover_tabs_persistent_during_load:true,
 f1_watch_summary_in_hub:false,
 f1_watch_history_location:'sports-watched-only',
 f1_calendar_renderer:'r311-clickable-race-buttons-preserved',
 f1_session_watch:true,
 profile_renderer:'r314-over-r313-canonical',
 profile_stat_single_version:true,
 profile_stat_reference:'Eventos assistidos',
 profile_stadium_click_preserved:true,
 profile_watchlist_click_preserved:true,
 profile_sports_collapse:true,
 profile_live_actors:true,
 sports_inline_filter_tabs:'next+previous',
 sports_inline_filter_source:'payload.sports',
 sports_jwt_refresh_retry:true,
 android:'1.0.20/10062'
};

for(const x of[
 "window.__ctR314='discover-calendar-foryou-final+f1-no-watch-summary+profile-stats-collapse'",
 "window.__ctR314EarlyCapture=true",
 "function shellHtml314",
 "function paintCalendar314",
 "function paintForYou314",
 "function filterPublic314",
 "data-ct314-action=\\\"watchlist\\\"",
 "data-ct314-action=\\\"seen\\\"",
 "data-ct314-sports-collapse",
 "function sportsRpc314",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "const version='1.0.105',revision='r314-official-1.0.105';"
])must(js,x);
if(!js.startsWith(early314+'\\n'))throw new Error('r314 capture is not first');
if(js.includes('Seu registro')||js.includes('Fórmula 1 assistida')||js.includes('Formula 1 assistida'))throw new Error('r314 F1 watched-summary survived final bundle');
if(release.android!=='1.0.20/10062')throw new Error('r314 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v314.js'),js),
 writeFile(resolve(dist,'app-v314.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v313.js'),{force:true}),rm(resolve(dist,'app-v313.css'),{force:true})]);
console.log('WEB_R314_READY final Discover + no F1 watch summary + stable Profile collapse + Sports JWT retry');
