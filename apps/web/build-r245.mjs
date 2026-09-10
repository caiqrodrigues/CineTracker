import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r244.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v244.js'),'utf8'),
  readFile(resolve(dist,'app-v244.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r245-horizontal-home-authority.js'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r245 missing '+label)};
for(const marker of [
  "const REVISION='r244-official-1.0.35';",
  "window.__ctR244='series-detail-local-horizontal-overflow'",
  "window.__ctR243='home-interaction-bounded-metadata-canonical-catchup'"
])must(js,marker,marker);
for(const marker of [
  "window.__ctR245='real-horizontal-drag-and-started-series-authority'",
  "window.__ctR245Horizontal='ct169-real-scrollers-pointer-drag'",
  "window.__ctR245SeriesAuthority='all-started-series-through-r176-canonical'",
  "window.__ctR245HomePriority='series-before-secondary-movie-metadata'",
  "const CT245_SERIES_MAX=4",
  "e.preventDefault()",
  "ct176PrimeCanonical(row,true)",
  "row.home_bucket='continue'"
])must(patch,marker,marker);

js=js.replace("const REVISION='r244-official-1.0.35';","const REVISION='r245-official-1.0.36';")
  .replace("window.__ctWebBuild='1.0.35';window.__ctOfficialVersion='1.0.35';","window.__ctWebBuild='1.0.36';window.__ctOfficialVersion='1.0.36';")
  .replaceAll('CineTracker • v1.0.35','CineTracker • v1.0.36')
  .replaceAll("JSON.stringify({version:'1.0.35',revision:REVISION","JSON.stringify({version:'1.0.36',revision:REVISION");
if(!js.includes('\nboot();'))throw new Error('r245 boot insertion point missing');
js=js.replace('\nboot();','\n'+patch+'\nboot();');

css+=`\n/* CineTracker Web 1.0.36 r245 — real local horizontal gesture authority. */
.ct169-season-row,.ct169-related-row,.ct169-season-chart-carousel,.ct169-chart-scroll{width:100%!important;min-width:0!important;max-width:100%!important;overflow-x:auto!important;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y pinch-zoom!important;scrollbar-width:thin}
.ct169-season-row,.ct169-related-row{grid-auto-flow:column!important;justify-content:start!important}
.ct169-season-row{grid-auto-columns:minmax(172px,196px)!important}
.ct169-related-row{grid-auto-columns:minmax(148px,168px)!important}
.ct169-season-chart-carousel{grid-auto-flow:column!important;grid-auto-columns:100%!important}
.ct169-chart-scroll>.ct169-season-chart-svg{max-width:none!important;flex:none!important}
.ct-r245-real-horizontal{cursor:grab}
.ct-r245-real-horizontal.ct-r245-dragging{cursor:grabbing;scroll-behavior:auto!important;user-select:none!important}
`;

html=html.replaceAll('r244-official-1.0.35','r245-official-1.0.36')
  .replace(/app-v\d+\.js/g,'app-v245.js')
  .replace(/app-v\d+\.css/g,'app-v245.css');
must(html,'app-v245.js','generated index app-v245.js');must(html,'app-v245.css','generated index app-v245.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;
if(!swCache.test(sw))throw new Error('r245 SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.36-r245';")
  .replace(/app-v\d+\.js/g,'app-v245.js')
  .replace(/app-v\d+\.css/g,'app-v245.css');

await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v245.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v245.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({
    version:'1.0.36',revision:'r245-official-1.0.36',base:'r244-official-1.0.35',scope:'web-detail-horizontal-and-home-series-authority',
    global_horizontal_scroll:'disabled',vertical_page_scroll:'preserved',
    seasons_horizontal_scroll:'real-pointer-drag',related_titles_horizontal_scroll:'real-pointer-drag',episode_chart_horizontal_scroll:'real-pointer-drag',
    series_continue:'all-started-series-audited-by-canonical-released-unwatched-authority',series_audit_concurrency:4,
    home_priority:'canonical-series-before-secondary-movie-metadata',android:'unchanged-1.0.20',generated_at:new Date().toISOString()
  },null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v244.js'),{force:true}),rm(resolve(dist,'app-v244.css'),{force:true})]);
console.log('WEB_1_0_36_READY r245 local-x=real-drag home=all-started-canonical-priority android=unchanged');
