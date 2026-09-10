import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r243.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v243.js'),'utf8'),
  readFile(resolve(dist,'app-v243.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r244-series-horizontal-overflow.js'),'utf8')
]);

const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r244 missing '+label)};
must(js,"const REVISION='r243-official-1.0.34';");
must(js,"window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'");
must(js,"window.__ctR243MovieHydration='single-queue-max-3'");
must(js,"window.__ctR243SeriesAuthority='all-up-to-date-through-r176-canonical'");
for(const marker of [
  "window.__ctR244='series-detail-local-horizontal-overflow'",
  "window.__ctR244VerticalScroll='preserved'",
  "window.__ctR244HorizontalScroll='local-seasons-and-charts'",
  "ct-r244-horizontal-scroll",
  "new MutationObserver(ct244Schedule)"
])must(patch,marker,marker);

js=js.replace("const REVISION='r243-official-1.0.34';","const REVISION='r244-official-1.0.35';")
  .replace("window.__ctWebBuild='1.0.34';window.__ctOfficialVersion='1.0.34';","window.__ctWebBuild='1.0.35';window.__ctOfficialVersion='1.0.35';")
  .replaceAll('CineTracker • v1.0.34','CineTracker • v1.0.35')
  .replaceAll("JSON.stringify({version:'1.0.34',revision:REVISION","JSON.stringify({version:'1.0.35',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r244 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.35 r244 — no global horizontal page scroll; local x-scroll only. */
html,body{width:100%;max-width:100%;overflow-x:hidden}
.app,.content,.page,[data-detail],.panel,.series-modal,.modal-panel{min-width:0;max-width:100%;box-sizing:border-box}
.ct-r244-horizontal-scroll{min-width:0;max-width:100%;overflow-x:auto!important;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y!important}
.ct-r244-seasons-scroll{width:100%;}
.ct-r244-chart-scroll{width:100%;}
`;

html=html.replaceAll('r243-official-1.0.34','r244-official-1.0.35')
  .replaceAll('app-v243.js','app-v244.js')
  .replaceAll('app-v243.css','app-v244.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r244 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.35-r244';")
  .replaceAll('app-v243.js','app-v244.js')
  .replaceAll('app-v243.css','app-v244.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v244.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v244.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.35',
    revision:'r244-official-1.0.35',
    base:'r243-official-1.0.34',
    scope:'web-layout-series-detail',
    global_horizontal_scroll:'disabled',
    vertical_page_scroll:'preserved',
    seasons_horizontal_scroll:'local',
    episode_chart_horizontal_scroll:'local',
    touch_gestures:'pan-x-and-pan-y',
    android:'unchanged-1.0.20',
    generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([
  rm(resolve(dist,'app-v243.js'),{force:true}),
  rm(resolve(dist,'app-v243.css'),{force:true})
]);
console.log('WEB_1_0_35_READY r244 global-x=blocked local-x=seasons+charts vertical-scroll=preserved');
