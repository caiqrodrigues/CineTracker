import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,sw,releaseRaw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v244.js'),'utf8'),
  readFile(resolve(dist,'app-v244.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8')
]);
const release=JSON.parse(releaseRaw);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r244 invariant missing '+label)};
for(const marker of [
  "const REVISION='r244-official-1.0.35';",
  "window.__ctWebBuild='1.0.35';window.__ctOfficialVersion='1.0.35';",
  "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'",
  "window.__ctR243MovieHydration='single-queue-max-3'",
  "window.__ctR243SeriesAuthority='all-up-to-date-through-r176-canonical'",
  "window.__ctR244='series-detail-local-horizontal-overflow'",
  "window.__ctR244VerticalScroll='preserved'",
  "window.__ctR244HorizontalScroll='local-seasons-and-charts'"
])must(js,marker,marker);
for(const marker of [
  'html,body{width:100%;max-width:100%;overflow-x:hidden}',
  '.ct-r244-horizontal-scroll{min-width:0;max-width:100%;overflow-x:auto!important;',
  'touch-action:pan-x pan-y!important',
  '.ct-r244-seasons-scroll{width:100%;}',
  '.ct-r244-chart-scroll{width:100%;}'
])must(css,marker,marker);
must(html,'app-v244.js');must(html,'app-v244.css');
if(html.includes('app-v243.js')||html.includes('app-v243.css'))throw new Error('r244 index still references r243 assets');
must(sw,"const CACHE='ct-web-1.0.35-r244';");must(sw,'app-v244.js');must(sw,'app-v244.css');
if(release.version!=='1.0.35'||release.revision!=='r244-official-1.0.35')throw new Error('r244 release identity invalid');
if(release.vertical_page_scroll!=='preserved'||release.global_horizontal_scroll!=='disabled')throw new Error('r244 scroll contract invalid');
if(release.android!=='unchanged-1.0.20')throw new Error('r244 Android baseline changed');
console.log('R244_STATIC_OK global-x=disabled vertical=preserved seasons-x=local chart-x=local r243=preserved');
