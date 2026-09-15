import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r285-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v285.js'),'utf8'),
  readFile(resolve(dist,'app-v285.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(dist,'release.json'),'utf8'),
  readFile(resolve(root,'runtime-r286-related-actions.js'),'utf8')
]);
const once=(s,a,b,label)=>{const i=s.indexOf(a);if(i<0)throw new Error('r286 missing '+label);if(s.indexOf(a,i+a.length)>=0)throw new Error('r286 ambiguous '+label);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r286 missing '+x)};
for(const x of[
  "window.__ctR286='related-open-watchlist-seen-window-capture';",
  "window.__ctR286Detail='related-open+watchlist+seen-r286-owned';",
  "window.__ctR286Scope='detail-related-only';",
  "window.addEventListener('pointerup'",
  "window.addEventListener('click'",
  "window.addEventListener('keydown'",
  'await addWatchlist(spec.type,spec.id)',
  'await markSeen(spec.type,spec.id)',
  "go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`)"
])must(patch,x);
if(patch.includes('MutationObserver')||patch.includes('setInterval('))throw new Error('r286 may not add persistent observers/polling');
must(js,"window.__ctR285='atomic-home+real-photo-covers+reliable-imported-actions'");
js=once(js,"window.__ctWebBuild='1.0.76';window.__ctOfficialVersion='1.0.76';","window.__ctWebBuild='1.0.77';window.__ctOfficialVersion='1.0.77';",'version');
js=once(js,"const REVISION='r285-official-1.0.76';","const REVISION='r286-official-1.0.77';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.77 r286 — related-title controls are explicit interactive targets. */
.ct169-related-card .ct169-related-open,.ct170-related-card .ct169-related-open,.ct169-related-card [data-ct169-related-watch],.ct169-related-card [data-ct169-related-seen],.ct170-related-card [data-ct169-related-watch],.ct170-related-card [data-ct169-related-seen]{touch-action:manipulation;cursor:pointer}
.ct169-related-card [aria-busy="true"],.ct170-related-card [aria-busy="true"]{opacity:.62;cursor:wait}
`;
html=html.replaceAll('app-v285.js','app-v286.js').replaceAll('app-v285.css','app-v286.css').replaceAll('CineTracker • v1.0.76','CineTracker • v1.0.77');
sw=sw.replaceAll('ct-web-1.0.76-r285','ct-web-1.0.77-r286').replaceAll('app-v285.js','app-v286.js').replaceAll('app-v285.css','app-v286.css');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.77',revision:'r286-official-1.0.77',base:'r285-production',scope:'detail-related-interactions-only',related_titles_open:'r286-window-capture',related_titles_watchlist:'r286-window-capture',related_titles_seen:'r286-window-capture',related_titles_pointer_click_dedup:true,related_titles_movie_and_series:true,android:'1.0.20/10062'};
await Promise.all([
  writeFile(resolve(dist,'app-v286.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v286.css'),css,'utf8'),
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v285.js'),{force:true}),rm(resolve(dist,'app-v285.css'),{force:true})]);
console.log('WEB_R286_READY related open+watchlist+seen window-capture');
