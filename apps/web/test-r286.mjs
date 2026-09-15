import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r286-official.mjs');
const [js,css,meta,runtime]=await Promise.all([
  readFile(resolve('dist/app-v286.js'),'utf8'),
  readFile(resolve('dist/app-v286.css'),'utf8'),
  readFile(resolve('dist/release.json'),'utf8'),
  readFile(resolve('runtime-r286-related-actions.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R286_STATIC missing '+x)};
for(const x of[
  "window.__ctR285='atomic-home+real-photo-covers+reliable-imported-actions'",
  "window.__ctR286='related-open-watchlist-seen-window-capture'",
  "window.__ctR286Detail='related-open+watchlist+seen-r286-owned'",
  "window.__ctR286Scope='detail-related-only'",
  ".ct169-related-open[data-media]",
  '[data-ct169-related-watch]',
  '[data-ct169-related-seen]',
  "window.addEventListener('pointerup'",
  "window.addEventListener('click'",
  "window.addEventListener('keydown'",
  'await addWatchlist(spec.type,spec.id)',
  'await markSeen(spec.type,spec.id)',
  "go(`/${spec.type==='movie'?'movie':'series'}/${spec.id}`)"
])must(js,x);
for(const x of['touch-action:manipulation','[aria-busy="true"]'])must(css,x);
if(runtime.includes('MutationObserver')||runtime.includes('setInterval('))throw new Error('R286_STATIC persistent observer/poll forbidden');
const m=JSON.parse(meta);
if(m.related_titles_open!=='r286-window-capture'||m.related_titles_watchlist!=='r286-window-capture'||m.related_titles_seen!=='r286-window-capture'||m.related_titles_pointer_click_dedup!==true||m.related_titles_movie_and_series!==true||m.android!=='1.0.20/10062')throw new Error('R286_STATIC release flags');
console.log('R286_STATIC_OK related open+watchlist+seen window-capture');
