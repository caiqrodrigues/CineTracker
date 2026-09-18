import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

if(process.env.CT_R308_SKIP_BUILD!=='1')await import('./build-r308.mjs');

const [js,css,html,releaseRaw]=await Promise.all([
 readFile(resolve('dist/app-v308.js'),'utf8'),
 readFile(resolve('dist/app-v308.css'),'utf8'),
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw);
const ok=(v,m)=>{if(!v)throw new Error('R308_STATIC '+m)};

ok(release.version==='1.0.99','release version');
ok(release.revision==='r308-official-1.0.99','release revision');
ok(html.includes('app-v308.js')&&html.includes('app-v308.css'),'r308 assets');
ok(js.includes("window.__ctWebBuild='1.0.99';window.__ctOfficialVersion='1.0.99';"),'runtime version');
ok(js.includes("const REVISION='r308-official-1.0.99';"),'runtime revision');

ok(js.includes("window.__ctR308='discover-exact-3+3+personal-filter+f1-four-tabs+calendar-click+profile-first-paint'"),'r308 runtime');
ok(js.includes("discover_foryou_structure")===false,'release metadata must not leak into JS');
ok(js.includes("const FILTERED_TABS=new Set(['trending','popular','new','anticipated','top'])"),'five filtered Discover tabs');
ok(js.includes("if(!FILTERED_TABS.has(String(tab||'')))return list"),'Calendar/Pra Você/Top10 excluded from personal browse filter');
ok(js.includes("slot('Filme','movie'")&&js.includes("slot('Série','series'")&&js.includes("slot('Anime','anime'"),'exact category renderer');
ok(js.includes("data-ct308-swap=\"daily\"")||js.includes("swap:'daily'"),'daily swap');
ok(js.includes('class="chip ct308-action'),'system chip actions');
ok(!js.includes("setTimeout(()=>void refresh(true),180"),'legacy r293 delayed refresh retired');
ok(js.includes("const observer={disconnect(){}};"),'legacy r293 observer retired');
ok(js.includes("window.__ctR308LegacyForYouInitialRefreshDisabled=true"),'legacy initial foryou repaint retired');

ok(js.includes("const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['circuits','Circuitos']];"),'F1 exact four tabs');
ok(!js.includes("const F1_TABS255=[['overview','Visão geral'],['calendar','Calendário'],['standings','Classificações'],['teams','Equipes']"),'Equipes removed from active renderer');
ok(js.includes("race.dataset?.eventId||race.dataset?.ct301F1Event"),'early F1 capture reads real data-event-id');
ok(js.includes("window.__ctR308?.openRaceFromElement"),'early F1 capture delegates to r308');

ok(js.includes("ct308-watchlist-stat::before,.ct308-watchlist-stat::after"),'semantic Watchlist click indicator hidden');
ok(js.includes("cleanWatchStat(statByLabel(root,'Séries Watchlist'))"),'Series Watchlist semantic cleanup');
ok(js.includes("cleanWatchStat(statByLabel(root,'Filmes Watchlist'))"),'Movies Watchlist semantic cleanup');

ok(release.discover_foryou_exact_3_plus_3===true,'release exact 3+3');
ok(release.discover_exclusions==='trending+popular+new+anticipated+top => seen+watchlist','release browse exclusion');
ok(release.f1_teams_tab===false&&release.f1_drivers_tab===false,'release F1 redundant tabs off');
ok(release.profile_semantic_first_paint===true,'release Profile semantic first paint');
ok(release.android==='1.0.20/10062','Android preserved');

console.log('R308_STATIC_OK exact Discover composition/filter/actions + F1 four tabs/calendar + stable Profile');
