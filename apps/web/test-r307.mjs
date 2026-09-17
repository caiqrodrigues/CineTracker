import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R307_SKIP_BUILD!=='1')await import('./build-r307.mjs');

const [js,css,html,releaseRaw]=await Promise.all([
  readFile(resolve('dist/app-v307.js'),'utf8'),
  readFile(resolve('dist/app-v307.css'),'utf8'),
  readFile(resolve('dist/index.html'),'utf8'),
  readFile(resolve('dist/release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw);
const ok=(v,m)=>{if(!v)throw new Error('R307_STATIC '+m)};

ok(release.version==='1.0.98','release version');
ok(release.revision==='r307-official-1.0.98','release revision');
ok(html.includes('app-v307.js')&&html.includes('app-v307.css'),'r307 assets');
ok(js.includes("window.__ctWebBuild='1.0.98';window.__ctOfficialVersion='1.0.98';"),'runtime version');
ok(js.includes("const REVISION='r307-official-1.0.98';"),'runtime revision');

ok(js.includes("window.__ctR307EarlyShouldBypass=bypass307"),'exact-item early bypass');
ok(js.includes("[data-ct279-watch],[data-ct274-rewatch],[data-ct273-history-undo]"),'guarded exact controls');
const earlyGuard=js.indexOf('if(bypass307(t))return;');
const earlyGeneric=js.indexOf("const card=t.closest('[data-media],.poster-card,.media-card");
ok(earlyGuard>=0&&earlyGeneric>earlyGuard,'early guard runs before generic seen classification');
const docGuard=js.indexOf("if(target.closest?.('[data-ct279-watch]");
const docGeneric=js.indexOf('const card=relatedCard306(target);if(!card)return');
ok(docGuard>=0&&docGeneric>docGuard,'document guard runs before generic seen classification');

ok(!js.includes("const SPORT_TABS255=[['next','Próximos'],['live','Ao vivo'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];"),'legacy Sports tabs removed from renderer');
ok(js.includes("const SPORT_TABS255=[['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']];"),'Sports renderer exact order');
ok(!js.includes("const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['drivers','Pilotos'],['teams','Equipes'],['circuits','Circuitos']];"),'Pilotos removed from F1 renderer');
ok(js.includes("const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes'],['circuits','Circuitos']];"),'F1 renderer exact tabs');

const ps=js.indexOf('function paintSports255()');
const pe=js.indexOf('renderSports=async function',ps);
ok(ps>=0&&pe>ps,'Sports renderer located');
const paint=js.slice(ps,pe);
ok(paint.indexOf('<section class="ct255-f1hub" data-ct255-f1></section>')>=0,'F1 Hub in Sports renderer');
ok(paint.indexOf('<section class="ct255-f1hub" data-ct255-f1></section>')<paint.indexOf('<div class="ct255-sports-tabs">'),'F1 Hub renders before Sports submenu');
ok(!paint.includes("['live','Ao vivo']"),'Ao vivo absent from rendered Sports tabs source');

ok(js.includes('[data-ct263-discover-tab].active'),'Top10 uses current Discover tab selector');
ok(js.includes('.ct288-top-shell,.ct288-top-row'),'Top10 uses current renderer shell');
ok(css.includes('[data-ct288-discover] .ct288-top-shell'),'Top10 direct current-renderer CSS');

ok(js.includes("$$('[data-stat],.stat,.stat-card,.profile-stat',root)"),'Profile cleanup covers real .stat cards');
ok(css.includes('.ct-r238-profile-grid>.stat:nth-child(3)'),'Profile Watchlist real-grid cleanup CSS');

ok(js.includes("window.__ctR307='exact-home-watch+legacy-frontier-production-renderers'"),'r307 runtime embedded');
ok(js.includes('function ct307LegacyPendingCount(row,show)'),'legacy frontier counter');
ok(js.includes('row.history_missing_episodes=pending'),'legacy pending drives missing count');
ok(js.includes("row.home_bucket='up_to_date'"),'caught-up legacy state');
ok(js.includes('row.next_episode_number=null'),'caught-up next episode cleared');

console.log('R307_STATIC_OK exact Home writer isolation + frontier availability + production renderer fixes');
