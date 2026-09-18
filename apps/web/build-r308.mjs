import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r307.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v307.js'),'utf8'),
  readFile(resolve(dist,'app-v307.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r308-discover-f1-profile.js'),'utf8')
]);

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{
  const n=count(s,from);if(n!==1)throw new Error(`r308 expected one ${label}, found ${n}`);
  return s.replace(from,()=>to);
};
const between=(s,start,end,to,label)=>{
  const a=s.indexOf(start);if(a<0)throw new Error('r308 missing '+label+' start');
  if(s.indexOf(start,a+start.length)>=0)throw new Error('r308 ambiguous '+label+' start');
  const b=s.indexOf(end,a+start.length);if(b<0)throw new Error('r308 missing '+label+' end');
  return s.slice(0,a)+to+s.slice(b+end.length);
};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r308 missing '+x)};

for(const x of[
 "window.__ctWebBuild='1.0.98';window.__ctOfficialVersion='1.0.98';",
 "const REVISION='r307-official-1.0.98';",
 "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes'],['circuits','Circuitos']];",
 "function ensureDriversData304(){",
 "function stabilizeProfile304(){",
 "const observer=new MutationObserver(ms=>{",
 "let obsQueued301=false;const app301=q301('#app');",
 "window.__ctR307EarlyShouldBypass=bypass307",
 "\nboot();"
])must(js,x);

/* r293/r301 kept repainting Discover/Profile after the visible render. r308 is the single final owner. */
js=once(js,
 "window.addEventListener('click',e=>{if(e.target?.closest?.('[data-ct263-discover-tab=\"foryou\"]'))setTimeout(()=>void refresh(true),180)},true);",
 "window.__ctR308LegacyForYouClickRefreshDisabled=true;",
 'r293 delayed foryou click refresh'
);
js=between(js,
 "const observer=new MutationObserver(ms=>{",
 "observer.observe(document.documentElement,{subtree:true,childList:true});",
 "const observer={disconnect(){}};",
 'r293 Discover mutation observer'
);
js=once(js,"if(discover.tab==='foryou')queueRefresh();","window.__ctR308LegacyForYouInitialRefreshDisabled=true;",'r293 initial refresh');
js=once(js,
 "void loadRecent296().then(()=>{try{if(discover?.tab==='foryou'&&typeof paintForYou263==='function')paintForYou263()}catch{}});",
 "void loadRecent296();",
 'r296 asynchronous foryou repaint'
);
js=between(js,
 "let obsQueued301=false;const app301=q301('#app');",
 "\ndocument.addEventListener('click',e=>{",
 "let obsQueued301=false;const app301=q301('#app');\n\ndocument.addEventListener('click',e=>{",
 'r301 route mutation observer'
);

/* The F1 model now has only the information that is not already inside Classificações. */
js=once(js,
 "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes'],['circuits','Circuitos']];",
 "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];",
 'F1_TABS255 four tabs'
);

/* Let r308 own its own card actions instead of the generic r306 seen/watchlist classifier. */
js=once(js,
 "const bypass307=t=>!!t?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch]');",
 "const bypass307=t=>!!t?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap]');",
 'r306 early bypass extended'
);
js=once(js,
 "if(target.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch]'))return",
 "if(target.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch],[data-ct308-action],[data-ct308-swap]'))return",
 'r306 document bypass extended'
);

/* The calendar button stores the real identifier in data-event-id, not in the empty marker attribute. */
const raceStart="const race=t.closest('[data-ct301-f1-event],.ct301-f1-event[data-season]');";
const raceEnd="const detail=t.closest('[data-detail-watchlist],[data-detail-seen]');";
const raceAt=js.indexOf(raceStart),detailAt=js.indexOf(raceEnd,raceAt);
if(raceAt<0||detailAt<0)throw new Error('r308 early F1 capture markers missing');
const raceBlock=`const race=t.closest('[data-ct301-f1-event],.ct301-f1-event[data-season]');if(race&&!race.disabled){handled();if(window.__ctR308?.openRaceFromElement){window.__ctR308.openRaceFromElement(race);return}const eventId=String(race.dataset?.eventId||race.dataset?.ct301F1Event||race.getAttribute('data-event-id')||race.getAttribute('data-ct301-f1-event')||'').trim(),season=Number(race.dataset?.season||(eventId.match(/^(\\d{4})-/)||[])[1]||new Date().getFullYear()),round=Number(race.dataset?.round||(eventId.match(/-(\\d+)$/)||[])[1]||1),title=String(race.dataset?.title||race.querySelector?.('b,strong,h3,h4')?.textContent||race.textContent||('GP '+round)).trim().split('\\n')[0];api.openRace({season,round,eventId,title});return}`;
js=js.slice(0,raceAt)+raceBlock+js.slice(detailAt);

/* r308 runs before boot and wraps the actual live owners after all inherited runtimes exist. */
js=once(js,"\nboot();","\n"+runtime+"\nboot();",'r308 runtime insertion');

js=once(js,
 "window.__ctWebBuild='1.0.98';window.__ctOfficialVersion='1.0.98';",
 "window.__ctWebBuild='1.0.99';window.__ctOfficialVersion='1.0.99';",
 'Web version'
);
js=once(js,"const REVISION='r307-official-1.0.98';","const REVISION='r308-official-1.0.99';",'revision');

css+=String.raw`
/* CineTracker Web 1.0.99 r308 — the runtime owns Discover/F1/Profile before first paint. */
`;
html=html.replaceAll('app-v307.js','app-v308.js').replaceAll('app-v307.css','app-v308.css').replaceAll('CineTracker • v1.0.98','CineTracker • v1.0.99');
sw=sw.replaceAll('ct-web-1.0.98-r307','ct-web-1.0.99-r308').replaceAll('app-v307.js','app-v308.js').replaceAll('app-v307.css','app-v308.css');

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.99',
 revision:'r308-official-1.0.99',
 base:'r307-production',
 scope:'discover-exact-recommendations+personal-browse-filter+f1-calendar+profile-first-paint-web-only',
 discover_foryou_structure:'daily+watchlist(movie+series+anime)+fresh(movie+series+anime)',
 discover_foryou_exact_3_plus_3:true,
 discover_daily_swap:true,
 discover_parallel_loading:true,
 discover_cached_revisit_ms:180000,
 discover_standard_actions:'chip-watchlist+chip-seen',
 discover_exclusions:'trending+popular+new+anticipated+top => seen+watchlist',
 discover_exclusion_exempt:'calendar+foryou+top10',
 discover_legacy_async_repaint:false,
 f1_tabs:'overview+calendar+standings+circuits',
 f1_drivers_tab:false,
 f1_teams_tab:false,
 f1_calendar_data_event_id:true,
 f1_calendar_grid_and_result:true,
 profile_single_final_owner:true,
 profile_delayed_r304_reconcile:false,
 profile_watchlist_open_signal:false,
 profile_watchlist_click_indicator:'invisible',
 android:'1.0.20/10062'
};

for(const x of[
 "window.__ctR308='discover-exact-3+3+personal-filter+f1-four-tabs+calendar-click+profile-first-paint'",
 "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];",
 "window.__ctR308LegacyForYouClickRefreshDisabled=true",
 "window.__ctR308LegacyForYouInitialRefreshDisabled=true",
 "data-event-id",
 "[data-ct308-action]",
 "ct308-watchlist-stat"
])must(js,x);

await Promise.all([
 writeFile(resolve(dist,'app-v308.js'),js),
 writeFile(resolve(dist,'app-v308.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v307.js'),{force:true}),rm(resolve(dist,'app-v307.css'),{force:true})]);
console.log('WEB_R308_READY exact Discover 3+3 + filtered browse + four-tab F1 + clickable calendar + stable Profile');
