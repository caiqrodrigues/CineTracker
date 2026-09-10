import {readFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [runtime,build,pkg,js,css,html,release]=await Promise.all([
  readFile(resolve(root,'runtime-r246-complete-ui-authority.js'),'utf8'),
  readFile(resolve(root,'build-r246.mjs'),'utf8'),
  readFile(resolve(root,'package.json'),'utf8'),
  readFile(resolve(dist,'app-v246.js'),'utf8'),
  readFile(resolve(dist,'app-v246.css'),'utf8'),
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);
const need=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r246 invariant missing '+label)};
for(const x of [
  "window.__ctR246='complete-ui-authority'",
  "window.__ctR246Home='eager-canonical-series-refresh'",
  "window.__ctR246Discover='stable-canonical-r239-r240'",
  "window.__ctR246Sports='four-tabs-no-events-animated-watched'",
  "window.__ctR246F1='persistent-collapse-six-tabs'",
  "window.__ctR246Profile='single-statistics-group'",
  "window.__ctR246Horizontal='local-scrollbars-no-page-x'",
  "window.__ctR239SetF1Open=setF1Open246",
  "SPORT_TABS_246=new Map([['next','Próximos'],['previous','Anteriores'],['favorites','Favoritos'],['watched','Assistidos']])",
  "cinetracker:web:f1-hub-open",
  "ct246-watch-pop",
  "ct246-local-track"
])need(runtime,x);
for(const forbidden of ['Lioness','Stuart'])if(runtime.includes(forbidden))throw new Error('r246 must remain title agnostic: '+forbidden);
for(const x of [
  "const CT245_SERIES_MAX=6;",
  "const CT245_PRIORITY_BATCH=24;",
  "setTimeout(ct245ReleaseMovies,500)",
  "const REVISION='r246-official-1.0.37';",
  "window.__ctR246='complete-ui-authority'",
  "window.__ctR240='sports-four-data-authority'",
  "window.__ctR239='production-video-ground-truth'"
])need(js,x);
for(const x of [
  'html,body,#app{max-width:100%!important;overflow-x:clip!important}',
  '.ct246-local-track{',
  'overflow-x:auto!important',
  'touch-action:pan-x pan-y!important',
  'scrollbar-width:auto!important',
  '@keyframes ct246WatchPop',
  '.ct246-profile-grid{display:grid!important'
])need(css,x);
need(html,'app-v246.js');need(html,'app-v246.css');
const p=JSON.parse(pkg);if(p.version!=='1.0.37'||p.scripts?.build!=='node build-r246.mjs'||p.scripts?.verify!=='node build-r246.mjs && node test-r246.mjs')throw new Error('r246 package identity wrong');
const r=JSON.parse(release);if(r.version!=='1.0.37'||r.revision!=='r246-official-1.0.37'||r.sports_tabs?.join('|')!=='Próximos|Anteriores|Favoritos|Assistidos')throw new Error('r246 release identity wrong');
await access(resolve(dist,'service-worker.js'));
console.log('R246_STATIC_OK home+discover+sports+f1+profile+local-scrollbars');
