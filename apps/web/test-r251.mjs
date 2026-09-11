import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),repo=resolve(root,'../..'),dist=resolve(root,'dist');
const read=p=>readFile(resolve(repo,p),'utf8');
const [rootPkg,pkg,runtime,build,js,css,html,release,readme,changelog,shownMigration,cleanupMigration,hardeningMigration]=await Promise.all([
 read('package.json'),
 readFile(resolve(root,'package.json'),'utf8'),
 readFile(resolve(root,'runtime-r251-ground-truth.js'),'utf8'),
 readFile(resolve(root,'build-r251.mjs'),'utf8'),
 readFile(resolve(dist,'app-v251.js'),'utf8'),
 readFile(resolve(dist,'app-v251.css'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 read('README.md'),
 read('CHANGELOG.md'),
 read('supabase/migrations/20260911175655_r251_shown_recommendations.sql'),
 read('supabase/migrations/20260911185833_r251_drop_unused_recommendation_rpcs.sql'),
 read('supabase/migrations/20260911192843_r251_shown_recommendations_policy_hardening.sql')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('R251 missing '+label)};
must(rootPkg,'"version": "1.0.42"','root package version');
must(pkg,'"version": "1.0.42"','package version');must(pkg,'build-r251-official.mjs','official build');
for(const x of[
 "window.__ctR251='video-ground-truth-direct-renderers'","window.__ctR251Home='frontier-current-release-priority-fast-prime'","window.__ctR251SportsSeries='canonical-f1-super-bowl-direct-home-bridge'","window.__ctR251Discover='strict-three-block-recommendation-authority'","window.__ctR251Sports='four-tabs-direct-renderer'","window.__ctR251F1='single-owned-hub-persistent-collapse'","window.__ctR251Profile='one-collapsible-statistics-block'","shown_recommendations","cinetracker_set_episode_watched","cinetracker_sports_payload_v1","cinetracker_sport_mark_watched_v1","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","['top10','Top 10']","['releases','Lançamentos']","ctR180RenderTop10","ct251OwnLegacyDiscoverTabs","ct251FindWatch(dash,used,shown.keys","Indicação do Dia","Da sua Watchlist","100% Novos","WWE WrestleMania".split(' ')[0]
])must(runtime,x,x);
if(runtime.includes('new MutationObserver'))throw new Error('R251 direct authority may not use MutationObserver');
must(build,'window.__ctR251LegacyR250ReconcileDisabled=true','r250 reconciler disabled');
for(const x of["window.__ctWebBuild='1.0.42';window.__ctOfficialVersion='1.0.42';","const REVISION='r251-official-1.0.42';","window.__ctR251='video-ground-truth-direct-renderers'","window.__ctR251SportsSeries='canonical-f1-super-bowl-direct-home-bridge'","['top10','Top 10']","['releases','Lançamentos']","cinetracker_sports_payload_v1","shown_recommendations"])must(js,x,x);
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('legacy sports RPC survived');
for(const x of['html,body,#app{overflow-x:clip!important}','.ct251-xrail','.ct251-home-row','.ct251-sports-series-icon','.ct251-profile-grid','[data-configs] input','.sidebar'])must(css,x,x);
must(html,'app-v251.js');must(html,'app-v251.css');must(release,'"version": "1.0.42"');must(release,'"revision": "r251-official-1.0.42"');
for(const x of['f1-super-bowl-series-bridge','nine-functional-tabs','seven-day-history-all-blocks'])must(release,x,'release '+x);
for(const x of['Web | **1.0.42**','`r251-official-1.0.42`','## Web 1.0.42 / r251','F1 e Super Bowl','As nove sub-abas','inclusive os vindos da Watchlist','shown_recommendations'])must(readme,x,'README '+x);
for(const x of['## 1.0.42 — 2026-09-11 — Web r251','### Autoridade direta / Home','ponte esportiva direta na Home','### Descobrir / recomendações','As nove sub-abas','janela de 7 dias vale para todos','### Esportes / F1 / Perfil / layout','### Build / validação'])must(changelog,x,'CHANGELOG '+x);
for(const x of['create table if not exists public.shown_recommendations','enable row level security','shown_recommendations_select_own','shown_recommendations_insert_own','shown_recommendations_update_own','to authenticated','(select auth.uid())','revoke all privileges','grant select, insert, update'])must(shownMigration,x,'shown migration '+x);
for(const x of['drop function if exists public.cinetracker_mark_recommendation_shown_v1','drop function if exists public.cinetracker_recent_recommendations_v1'])must(cleanupMigration,x,'cleanup migration '+x);
for(const x of['revoke all privileges on table public.shown_recommendations from anon','grant select, insert, update on table public.shown_recommendations to authenticated','drop policy if exists shown_recommendations_select_own','to authenticated','(select auth.uid()) = user_id'])must(hardeningMigration,x,'hardening migration '+x);
console.log('R251_STATIC_OK direct-renderers filters sports f1 profile local-scroll polish docs migrations');
