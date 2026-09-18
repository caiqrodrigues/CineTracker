import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r309.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v309.js'),'utf8'),
 readFile(resolve(dist,'app-v309.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r310-video-truth.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{const n=count(s,from);if(n!==1)throw new Error(`r310 expected one ${label}, found ${n}`);return s.replace(from,()=>to)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r310 missing '+x)};
const replaceBetween=(s,start,end,repl,label)=>{
 const a=s.indexOf(start);if(a<0)throw new Error('r310 missing '+label+' start');
 const b=s.indexOf(end,a);if(b<0)throw new Error('r310 missing '+label+' end');
 return s.slice(0,a)+repl+s.slice(b);
};

for(const x of[
 "window.__ctWebBuild='1.0.100';window.__ctOfficialVersion='1.0.100';",
 "const REVISION='r309-official-1.0.100';",
 "function ensureDiscoverTabs252(){",
 "function guardBrowse300(tab,delay=2200){",
 "function queueRefresh(){",
 "const ct309ProfileBound=",
 "merged.sports_stats=sports||merged.sports_stats||{};",
 "function sportCard255(e,p){",
 "CineTracker • v1.0.57",
 "\nboot();"
])must(js,x);

/* r252 was still appending Top 10 + Lançamentos to whatever .tabs existed after late legacy paints. */
js=replaceBetween(js,
 "function ensureDiscoverTabs252(){",
 "\nlet baseDiscoverRows252=",
 "function ensureDiscoverTabs252(){return false}\n",
 'r252 tab injector'
);

/* r300's 2.2s recovery could finish after r309/r310 and repaint browse with legacy actions. */
js=replaceBetween(js,
 "function guardBrowse300(tab,delay=2200){",
 "\n\nfunction profileStatsRoot()",
 "function guardBrowse300(){return false}",
 'r300 delayed browse recovery'
);

/* r293 still had independent delayed For You repaint paths. Keep its data helpers, retire repaint scheduling. */
js=replaceBetween(js,
 "function queueRefresh(){",
 "\nfunction authorityDrift()",
 "function queueRefresh(){return false}",
 'r293 queued repaint'
);

/* Profile: canonical full payload + exact sports history are resolved before the one visible paint. */
const profile310=String.raw`const ct309ProfileBound=(p,ms,fallback=null)=>Promise.race([Promise.resolve(p),new Promise(r=>setTimeout(()=>r(fallback),ms))]);
renderProfile=async function(seq){
 setApp(shell('Perfil','Estatísticas, biblioteca, favoritos e atividade.','profile','<div class="page" data-profile>'+loading('Carregando Perfil...')+'</div>'));
 const cached=profileCache||ct163Read('profile')||null;
 const fullP=ct309ProfileBound(rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}),9000,null);
 const quickP=ct309ProfileBound(rpc('cinetracker_profile_quick_stats_v1',{}),6000,null);
 const sportsP=ct309ProfileBound(rpc('cinetracker_sport_stats_v1',{}),6000,null);
 const historyP=ct309ProfileBound(rpc('cinetracker_sports_watch_history_v296',{}),7000,null);
 const stadiumP=ct309ProfileBound(rpc('cinetracker_sports_stadium_summary_v296',{}),6000,null);
 const [full,quick,sports,history,stadium]=await Promise.all([fullP,quickP,sportsP,historyP,stadiumP]);
 if(seq!==navSeq||route()!=='profile')return;
 let merged=full?{...full}:(quick?ct168MergeQuick(cached,quick):(cached?{...cached}:{}));
 merged.sports_stats={...(sports||{}),...(merged.sports_stats||{})};
 if(Array.isArray(history))merged.sports_stats.watched_events=history.filter(x=>x?.is_watched!==false).length;
 profileCache=merged;try{ct163Write('profile',merged)}catch{}
 ct168PaintProfile(merged,'');
 const stadiumCount=Number(stadium?.stadium_events??stadium?.[0]?.stadium_events??0);
 try{window.__ctR296Test?.injectStadiumMetric296?.(stadiumCount)}catch{}
 return merged;
};
`;
js=replaceBetween(js,
 "const ct309ProfileBound=",
 "\n\n/* The database already stores sports watch history.",
 profile310,
 'r309 Profile first-paint owner'
);

/* A provider can leave an old result as live. Never render multi-hour-old scored events as AO VIVO. */
js=once(js,
 "match=e?.home_name||e?.away_name,live=String(e?.status||'').toLowerCase()==='live',finished=['finished','ended','final'].includes(String(e?.status||'').toLowerCase()),time=startMs255(e)?",
 "match=e?.home_name||e?.away_name,staleLive=String(e?.status||'').toLowerCase()==='live'&&startMs255(e)>0&&startMs255(e)<Date.now()-8*3600000,live=String(e?.status||'').toLowerCase()==='live'&&!staleLive,finished=['finished','ended','final'].includes(String(e?.status||'').toLowerCase())||staleLive,time=startMs255(e)?",
 'stale live status'
);

/* Footer text was frozen by the r266 rebuild and never followed later JS release identities. */
js=js.replaceAll('CineTracker • v1.0.57','CineTracker • v1.0.101')
     .replaceAll('CineTracker • v1.0.100','CineTracker • v1.0.101');
html=html.replaceAll('CineTracker • v1.0.57','CineTracker • v1.0.101')
         .replaceAll('CineTracker • v1.0.100','CineTracker • v1.0.101');

/* r306 capture must treat r310 actions as exact controls. */
js=js.replaceAll('[data-ct309-action],[data-ct309-swap]', '[data-ct309-action],[data-ct309-swap],[data-ct310-action]');

/* r310 final runtime owns Browse action state and the guaranteed bottom actor scrollbar. */
js=once(js,'\nboot();','\n'+runtime+'\nboot();','r310 insertion');
js=once(js,
 "window.__ctWebBuild='1.0.100';window.__ctOfficialVersion='1.0.100';",
 "window.__ctWebBuild='1.0.101';window.__ctOfficialVersion='1.0.101';",
 'Web version'
);
js=once(js,"const REVISION='r309-official-1.0.100';","const REVISION='r310-official-1.0.101';",'revision');

html=html.replaceAll('app-v309.js','app-v310.js').replaceAll('app-v309.css','app-v310.css').replaceAll('v1.0.100','v1.0.101').replaceAll('r309-official-1.0.100','r310-official-1.0.101');
sw=sw.replaceAll('ct-web-1.0.100-r309','ct-web-1.0.101-r310').replaceAll('app-v309.js','app-v310.js').replaceAll('app-v309.css','app-v310.css');
css+='\n/* CineTracker Web 1.0.101 r310 — delayed authorities retired; actor scrollbar is bottom proxy only. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,version:'1.0.101',revision:'r310-official-1.0.101',base:'r309-production',
 scope:'new-video-delayed-authorities-profile-truth-web-only',
 discover_r252_tab_injector:false,
 discover_r300_delayed_recovery:false,
 discover_r293_delayed_repaint:false,
 discover_canonical_watchlist_rpc:'cinetracker_watchlist_full_v119',
 discover_watchlist_excluded_before_paint:true,
 discover_actions:'state-aware-watchlist+seen',
 discover_legacy_action_takeover:false,
 profile_sports_count:'cinetracker_sports_watch_history_v296',
 profile_sports_legacy_overwrite:false,
 profile_actor_scroll:'bottom-proxy-only',
 sports_stale_live_normalized:true,
 footer_version:'1.0.101',
 android:'1.0.20/10062'
};

for(const x of[
 "function ensureDiscoverTabs252(){return false}",
 "function guardBrowse300(){return false}",
 "function queueRefresh(){return false}",
 "cinetracker_sports_watch_history_v296",
 "history.filter(x=>x?.is_watched!==false).length",
 "staleLive=String(e?.status||'').toLowerCase()==='live'",
 "window.__ctR310='delayed-authorities-retired+canonical-watchlist+profile-sports-truth+actor-bottom-scroll'",
 "cinetracker_watchlist_full_v119",
 "ct310-actor-scroll",
 "CineTracker • v1.0.101"
])must(js,x);
if(js.includes("add('releases','Lançamentos','anticipated')"))throw new Error('r310 r252 Lançamentos injector survived');
if(js.includes("function guardBrowse300(tab,delay=2200)"))throw new Error('r310 r300 delayed recovery survived');
if(js.includes("setTimeout(()=>void refresh(true),180)"))throw new Error('r310 r293 delayed repaint survived');
if(js.includes("merged.sports_stats=sports||merged.sports_stats||{}"))throw new Error('r310 stale sports overwrite survived');
if(js.includes('CineTracker • v1.0.57'))throw new Error('r310 stale footer survived');

await Promise.all([
 writeFile(resolve(dist,'app-v310.js'),js),
 writeFile(resolve(dist,'app-v310.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v309.js'),{force:true}),rm(resolve(dist,'app-v309.css'),{force:true})]);
console.log('WEB_R310_READY delayed Discover owners retired + canonical Watchlist/Profile sports + bottom actor scrollbar');
