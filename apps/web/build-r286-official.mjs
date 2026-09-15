import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r286.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v286.js','app-v286.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r286 official missing '+x)};
for(const x of[
  "window.__ctWebBuild='1.0.77';window.__ctOfficialVersion='1.0.77';",
  "const REVISION='r286-official-1.0.77';",
  "window.__ctR285='atomic-home+real-photo-covers+reliable-imported-actions'",
  "window.__ctR286='related-open-watchlist-seen-window-capture'",
  "window.__ctR286Detail='related-open+watchlist+seen-r286-owned'",
  "window.addEventListener('pointerup'",
  'await addWatchlist(spec.type,spec.id)',
  'await markSeen(spec.type,spec.id)'
])must(js,x);
for(const x of['.ct169-related-card .ct169-related-open','touch-action:manipulation','[aria-busy="true"]'])must(css,x);
must(html,'app-v286.js');must(html,'app-v286.css');
const m=JSON.parse(release);
if(m.version!=='1.0.77'||m.revision!=='r286-official-1.0.77'||m.related_titles_open!=='r286-window-capture'||m.related_titles_watchlist!=='r286-window-capture'||m.related_titles_seen!=='r286-window-capture'||m.related_titles_pointer_click_dedup!==true||m.related_titles_movie_and_series!==true||m.android!=='1.0.20/10062')throw new Error('r286 release identity');
must(sw,"const CACHE='ct-web-1.0.77-r286';");
console.log('WEB_1_0_77_OFFICIAL_OK r286 related title interactions');
