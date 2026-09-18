import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r310.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v310.js'),'utf8'),
 readFile(resolve(dist,'app-v310.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r311-profile-f1-discover.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error(`r311 expected one ${label}, found ${n}`);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r311 missing '+x)};
const replaceBetween=(s,start,end,repl,label)=>{
 const a=s.indexOf(start);if(a<0)throw new Error('r311 missing '+label+' start');
 const b=s.indexOf(end,a);if(b<0)throw new Error('r311 missing '+label+' end');
 return s.slice(0,a)+repl+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.101';window.__ctOfficialVersion='1.0.101';",
 "const REVISION='r310-official-1.0.101';",
 "function styleWatchlistStats300(){",
 "function stabilizeProfile301(){",
 "function guardBrowse300(){return false}",
 "window.__ctR310='delayed-authorities-retired+canonical-watchlist+profile-sports-truth+actor-bottom-scroll'",
 "const version='1.0.101',revision='r310-official-1.0.101';",
 "\nboot();"
])must(js,x);

/* Register r311 exact-control capture before the inherited r306 early capture. */
const early311=String.raw`(()=>{if(window.__ctR311EarlyCapture)return;window.__ctR311EarlyCapture=true;window.addEventListener('click',e=>{try{const fn=window.__ctR311EarlyHandle;if(typeof fn!=='function')return;if(fn(e.target,e)){e.preventDefault();e.stopImmediatePropagation()}}catch{}},true)})();`;

/* Profile visual versions must never race after first paint. */
js=replaceBetween(js,
 "function styleWatchlistStats300(){",
 "\n\nconst SPORTS_ORDER=",
 "function styleWatchlistStats300(){return false}",
 'r300 delayed Watchlist stat styler'
);
js=replaceBetween(js,
 "function stabilizeProfile301(){",
 "\n\ntry{if(typeof paintSports255==='function'",
 "function stabilizeProfile301(){return false}",
 'r301 Profile mutation authority'
);

/* r311 exact controls are not candidates for the generic legacy click classifier. */
js=js.replaceAll('[data-ct310-action]', '[data-ct310-action],[data-ct311-action],[data-ct311-f1-race],[data-ct311-f1-watch]');

/* Footer must follow the actual production identity, not r310. */
js=once(js,
 "const version='1.0.101',revision='r310-official-1.0.101';",
 "const version='1.0.102',revision='r311-official-1.0.102';",
 'footer identity'
);

/* Final runtime is evaluated after every inherited owner and before boot. */
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r311 insertion');
js=early311+'\n'+js;
js=once(js,
 "window.__ctWebBuild='1.0.101';window.__ctOfficialVersion='1.0.101';",
 "window.__ctWebBuild='1.0.102';window.__ctOfficialVersion='1.0.102';",
 'Web version'
);
js=once(js,"const REVISION='r310-official-1.0.101';","const REVISION='r311-official-1.0.102';",'revision');

html=html.replaceAll('app-v310.js','app-v311.js').replaceAll('app-v310.css','app-v311.css').replaceAll('v1.0.101','v1.0.102').replaceAll('r310-official-1.0.101','r311-official-1.0.102');
sw=sw.replaceAll('ct-web-1.0.101-r310','ct-web-1.0.102-r311').replaceAll('app-v310.js','app-v311.js').replaceAll('app-v310.css','app-v311.css');
css+='\n/* CineTracker Web 1.0.102 r311 — one Profile stat version, clickable F1 weekends, stable public Discover actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,version:'1.0.102',revision:'r311-official-1.0.102',base:'r310-green-head',
 scope:'latest-video-profile-f1-discover-stability-web-only',
 profile_stat_reference:'Eventos assistidos',
 profile_unified_stats:'Eventos assistidos+Jogos no Estádio+Séries Watchlist+Filmes Watchlist',
 profile_r300_delayed_style:false,
 profile_r301_mutation_style:false,
 profile_stat_single_version:true,
 f1_calendar_renderer:'r311-clickable-race-buttons',
 f1_race_detail:'weekend-sessions+grid+result',
 f1_session_watch:true,
 f1_session_watch_rpc:'cinetracker_sports_watch_set_v296',
 discover_public_tabs:'trending+popular+new+anticipated+top',
 discover_public_exclusion:'seen+watchlist-before-markup',
 discover_public_renderer:'r311-single-owner',
 discover_public_watchlist_button:true,
 discover_public_seen_button:true,
 discover_actions_outside_media_card:true,
 android:'1.0.20/10062'
};

for(const x of[
 "function styleWatchlistStats300(){return false}",
 "function stabilizeProfile301(){return false}",
 "window.__ctR311='profile-stat-single-version+f1-clickable-weekend+discover-public-single-renderer'",
 "window.__ctR311EarlyCapture=true",
 "profile-stat-single-version",
 "data-ct311-action=\"watchlist\"",
 "data-ct311-f1-race",
 "cinetracker_sports_watch_set_v296",
 "function filterPublic311",
 "const PUBLIC_TABS=new Set(['trending','popular','new','anticipated','top'])",
 "const version='1.0.102',revision='r311-official-1.0.102';"
])must(js,x);
if(js.includes("function styleWatchlistStats300(){const"))throw new Error('r311 r300 Profile styler survived');
if(js.includes("function stabilizeProfile301(){\n const root="))throw new Error('r311 r301 Profile visual authority survived');
if(js.includes("window.__ctWebBuild='1.0.101';window.__ctOfficialVersion='1.0.101';"))throw new Error('r311 stale web identity survived');

await Promise.all([
 writeFile(resolve(dist,'app-v311.js'),js),
 writeFile(resolve(dist,'app-v311.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v310.js'),{force:true}),rm(resolve(dist,'app-v310.css'),{force:true})]);
console.log('WEB_R311_READY Profile stats single-version + clickable F1 weekends + stable filtered Discover');
