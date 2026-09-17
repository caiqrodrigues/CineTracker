import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r306.mjs');

const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v306.js'),'utf8'),
  readFile(resolve(dist,'app-v306.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r307-production-truth.js'),'utf8')
]);

const count=(s,x)=>s.split(x).length-1;
const once=(s,from,to,label=from)=>{
  const n=count(s,from);
  if(n!==1)throw new Error(`r307 expected one ${label}, found ${n}`);
  return s.replace(from,()=>to);
};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r307 missing '+x)};

for(const x of[
  "window.__ctWebBuild='1.0.97';window.__ctOfficialVersion='1.0.97';",
  "const REVISION='r306-official-1.0.97';",
  "const SPORT_TABS255=[['next','Próximos'],['live','Ao vivo'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];",
  "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];",
  '<section class="ct255-f1hub" data-ct255-f1></section>',
  "const active=$('[data-discover-tab].active,[data-discover-tab][aria-selected=\"true\"]')",
  "$$('[data-stat],.stat-card,.profile-stat',root)",
  "const card=relatedCard306(target);if(!card)return",
  '\nboot();'
])must(js,x);

/*
 * r306 registered a generic window-capture listener before every legacy listener.
 * It classified the Home button "Marcar episódio como assistido" as a generic
 * series-level "seen" action. r307 explicitly lets exact-item controls through
 * so r279 owns the write and calls cinetracker_mark_watch_v0994 for one item.
 */
const earlyStart="(()=>{if(window.__ctR306EarlyCapture)return;window.__ctR306EarlyCapture=true;window.addEventListener('click',e=>{";
const earlyWithGuard="(()=>{if(window.__ctR306EarlyCapture)return;window.__ctR306EarlyCapture=true;const bypass307=t=>!!t?.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch]');window.__ctR307EarlyShouldBypass=bypass307;window.addEventListener('click',e=>{";
js=once(js,earlyStart,earlyWithGuard,'r306 early capture start');

const earlyCard="const card=t.closest('[data-media],.poster-card,.media-card,.related-card,.similar-card,.recommendation-card,.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],.ct286-related-card,.ct292-related-card');if(!card)return;";
js=once(js,earlyCard,"if(bypass307(t))return;"+earlyCard,'r306 early generic card action');

js=once(
  js,
  "const card=relatedCard306(target);if(!card)return",
  "if(target.closest?.('[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo],[data-ct275-history-toggle],[data-ct284-watch],[data-ct285-watch]'))return\n  const card=relatedCard306(target);if(!card)return",
  'r306 document generic card action'
);

/* Fix the renderers themselves. No post-render DOM repair. */
js=once(
  js,
  "const SPORT_TABS255=[['next','Próximos'],['live','Ao vivo'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];",
  "const SPORT_TABS255=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];",
  'SPORT_TABS255'
);
js=once(
  js,
  "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];",
  "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes'],['circuits','Circuitos']];",
  'F1_TABS255'
);
js=once(js,'<section class="ct255-f1hub" data-ct255-f1></section>','', 'old F1 Hub position');
js=once(
  js,
  'h.innerHTML=`<div class="ct255-sports-tabs">',
  'h.innerHTML=`<section class="ct255-f1hub" data-ct255-f1></section><div class="ct255-sports-tabs">',
  'Sports renderer first block'
);

/* Use the selectors emitted by the current Discover/Profile renderers. */
js=once(
  js,
  "const active=$('[data-discover-tab].active,[data-discover-tab][aria-selected=\"true\"]')",
  "const active=$('[data-ct263-discover-tab].active,[data-ct263-discover-tab][aria-selected=\"true\"],[data-discover-tab].active,[data-discover-tab][aria-selected=\"true\"]')",
  'Top 10 active tab selector'
);
js=once(
  js,
  "||!!$('.ct288-top10,.ct294-top10,[data-top10],.top10-grid,.top10-row')",
  "||!!$('.ct288-top-shell,.ct288-top-row,.ct288-top10,.ct294-top10,[data-top10],.top10-grid,.top10-row')",
  'Top 10 shell detector'
);
js=once(
  js,
  "$$('[data-stat],.stat-card,.profile-stat',root)",
  "$$('[data-stat],.stat,.stat-card,.profile-stat',root)",
  'Profile stat selector'
);

js=once(
  js,
  "window.__ctWebBuild='1.0.97';window.__ctOfficialVersion='1.0.97';",
  "window.__ctWebBuild='1.0.98';window.__ctOfficialVersion='1.0.98';",
  'Web version'
);
js=once(
  js,
  "const REVISION='r306-official-1.0.97';",
  "const REVISION='r307-official-1.0.98';",
  'revision'
);
js=once(js,'\nboot();','\n'+runtime+'\nboot();','boot insertion');

css+=String.raw`
/* CineTracker Web 1.0.98 r307 — current-renderer selectors, no post-render dependency. */
[data-ct288-discover] .ct288-top-shell{margin-top:0!important;padding-top:0!important}
[data-ct288-discover] .ct288-top-title{margin:0 0 4px!important;padding:0!important}
[data-ct288-discover] .ct288-top-title h2{margin:0!important;line-height:1.1!important;font-size:18px!important}
[data-ct288-discover] .ct288-provider-row{margin:0 0 6px!important;padding:0 0 4px!important}
[data-ct288-discover] .ct288-top-section{margin:0 0 8px!important;padding:8px 10px!important}
[data-ct288-discover] .ct288-top-section .panel-head{margin:0 0 4px!important;padding:0!important;min-height:0!important}
[data-profile] .ct-r238-profile-grid>.stat:nth-child(3),
[data-profile] .ct-r238-profile-grid>.stat:nth-child(4){cursor:default!important}
[data-profile] .ct-r238-profile-grid>.stat:nth-child(3)::before,
[data-profile] .ct-r238-profile-grid>.stat:nth-child(3)::after,
[data-profile] .ct-r238-profile-grid>.stat:nth-child(4)::before,
[data-profile] .ct-r238-profile-grid>.stat:nth-child(4)::after{content:none!important;display:none!important}
[data-profile] .ct-r238-profile-grid>.stat:nth-child(3) :is(.stat-link-icon,.stat-arrow,.open-arrow,[data-open-arrow]),
[data-profile] .ct-r238-profile-grid>.stat:nth-child(4) :is(.stat-link-icon,.stat-arrow,.open-arrow,[data-open-arrow]){display:none!important}
`;

html=html
  .replaceAll('app-v306.js','app-v307.js')
  .replaceAll('app-v306.css','app-v307.css')
  .replaceAll('CineTracker • v1.0.97','CineTracker • v1.0.98');
sw=sw
  .replaceAll('ct-web-1.0.97-r306','ct-web-1.0.98-r307')
  .replaceAll('app-v306.js','app-v307.js')
  .replaceAll('app-v306.css','app-v307.css');

const prev=JSON.parse(releaseRaw);
const release={
  ...prev,
  version:'1.0.98',
  revision:'r307-official-1.0.98',
  base:'r306-production',
  scope:'exact-home-watch+legacy-frontier+production-renderer-fixes-web-only',
  exact_home_watch:true,
  raw_smackdown_frontier:true,
  legacy_backlog_as_pending:false,
  f1_drivers_tab:false,
  sports_tabs:'next+previous+favorites+watched',
  sports_menu_below_f1:true,
  top10_current_renderer_compact:true,
  profile_watchlist_chevrons:false,
  data_repair_note:'Raw false bulk mark repaired 2026-09-17',
  android:'1.0.20/10062'
};

for(const x of[
  "window.__ctR307='exact-home-watch+legacy-frontier-production-renderers'",
  "window.__ctR307EarlyShouldBypass=bypass307",
  "const SPORT_TABS255=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];",
  "const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes'],['circuits','Circuitos']];",
  '[data-ct263-discover-tab].active',
  "$$('[data-stat],.stat,.stat-card,.profile-stat',root)"
])must(js,x);

await Promise.all([
  writeFile(resolve(dist,'app-v307.js'),js),
  writeFile(resolve(dist,'app-v307.css'),css),
  writeFile(resolve(dist,'index.html'),html),
  writeFile(resolve(dist,'service-worker.js'),sw),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
  rm(resolve(dist,'app-v306.js'),{force:true}),
  rm(resolve(dist,'app-v306.css'),{force:true})
]);

console.log('WEB_R307_READY exact Home watch + Raw/SmackDown frontier + production renderer fixes');
