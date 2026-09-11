import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),repo=resolve(root,'../..'),dist=resolve(root,'dist');
const read=p=>readFile(resolve(repo,p),'utf8');
const [rootPkg,pkg,runtime,build,official,js,css,html,release,readme,changelog,r248]=await Promise.all([
 read('package.json'),readFile(resolve(root,'package.json'),'utf8'),readFile(resolve(root,'runtime-r252-source-ui-recovery.js'),'utf8'),readFile(resolve(root,'build-r252.mjs'),'utf8'),readFile(resolve(root,'build-r252-official.mjs'),'utf8'),readFile(resolve(dist,'app-v252.js'),'utf8'),readFile(resolve(dist,'app-v252.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),read('README.md'),read('CHANGELOG.md'),readFile(resolve(root,'runtime-r248-current-following-ui.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('R252 missing '+label)};
must(rootPkg,'"version": "1.0.43"','root package version');must(pkg,'"version": "1.0.43"','web package version');must(pkg,'build-r252-official.mjs','official build');
must(build,"await import('./build-r248-official.mjs')",'r248 source baseline');
for(const forbidden of["build-r249.mjs","build-r250.mjs","build-r251.mjs"])if(build.includes(`import('./${forbidden}')`)||build.includes(`import \"./${forbidden}\"`))throw new Error('R252 must not import '+forbidden);
for(const x of[
 "window.__ctR252='source-ui-recovery-logic-only'","window.__ctR252UI='r248-native-structure-preserved'","RECENT_DAYS=30","function classifySeries","function isLegacySeries","window.__ctR252Discover='native-cards+strict-three-block-rules+seven-day-history'","shown_recommendations","Indicação do Dia","Da sua Watchlist","100% Novos","data-ct252-refresh","window.__ctR252Configs='immediate-shell-background-profile'","cinetracker_sports_payload_v1"
])must(runtime,x,x);
for(const forbidden of['renderHome=async','renderSports=async','renderProfile=async','ct251-home-row','ct251-discover-card','ct251-f1hub','ct251-profile-grid'])if(runtime.includes(forbidden))throw new Error('R252 logic runtime may not replace approved UI: '+forbidden);
for(const x of[
 "window.__ctR248='current-following-complete-ui-authority'","window.__ctR248F1='jolpica-six-tabs-persistent-collapse'","window.__ctR248Profile='one-stable-statistics-group'","window.__ctR252='source-ui-recovery-logic-only'","window.__ctR252LegacyCurrentObserverDisabled=true","window.__ctR252LegacyBindingObserverDisabled=true","window.__ctWebBuild='1.0.43';window.__ctOfficialVersion='1.0.43';","const REVISION='r252-official-1.0.43';","cinetracker_sports_payload_v1"
])must(js,x,x);
if(js.includes("window.__ctR251='video-ground-truth-direct-renderers'"))throw new Error('r251 renderer authority survived');
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('retired sports RPC survived');
for(const x of['.ct248-f1hub','.ct248-profile-grid','overflow-x:clip!important','.ct248-xrail'])must(css,x,x);
for(const forbidden of['.ct251-f1hub','.ct251-profile-grid','.ct251-home-row','.ct251-discover-card'])if(css.includes(forbidden))throw new Error('r251 redesigned CSS survived: '+forbidden);
must(js,'data-home-tab','native Home tabs');must(js,'Histórico','Home history source');must(js,"['s-filmes','s-series','s-docs','s-shows','s-anime','s-sports','s-telej','s-novela','s-follow','s-watchlist']",'established Profile order');
must(r248,"window.__ctR248F1='jolpica-six-tabs-persistent-collapse'",'r248 F1 authority');
must(html,'app-v252.js');must(html,'app-v252.css');must(release,'"version": "1.0.43"');must(release,'"revision": "r252-official-1.0.43"');must(release,'"direct_renderer_replacement": false');
for(const x of['Web | **1.0.43**','`r252-official-1.0.43`','source UI','30 dias','Histórico','F1 Hub','Configurações'])must(readme,x,'README '+x);
for(const x of['## 1.0.43 — 2026-09-11 — Web r252','### Recuperação da interface','### Home / séries','### Descobrir','### Navegação / Esportes / F1 / Perfil / Configurações','### Build / validação'])must(changelog,x,'CHANGELOG '+x);
console.log('R252_STATIC_OK source-ui=r248 home=30d+legacy discover=native-cards sports=four-tabs f1=r248 profile=established configs=immediate');
