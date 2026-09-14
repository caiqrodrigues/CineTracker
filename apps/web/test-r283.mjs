import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r283-official.mjs');
const dist=resolve('dist');
const [js,release,runtime]=await Promise.all([readFile(resolve(dist,'app-v283.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve('runtime-r283-history-actions-availability.js'),'utf8')]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R283_STATIC missing '+x)};
for(const x of[
 "window.__ctR283='history-action-isolation+fresh-availability+legacy-frontier-next'",
 "window.__ctR283History='window-capture-rewatch+undo-no-navigation'",
 "window.__ctR283Availability='fresh-released-minus-canonical-watched'",
 "window.__ctR283Legacy='raw+smackdown-frontier-next+backlog-count'",
 'function ct283FreshReleasedCount(show)',
 'function ct283WatchedReleasedCount(row,show)',
 'function ct283ApplyFreshAvailability(row,show)',
 'async function ct283FirstAfterFrontier(row,show)',
 "target?.closest?.('[data-ct274-rewatch],[data-ct273-history-undo]')",
 "window.addEventListener('click',ct283CaptureHistoryClick,true);",
 'e.stopImmediatePropagation();e.stopPropagation()',
 'ct274AvailableText=ct283AvailableText;',
 'ct275ReloadHome=ct283ReloadHome;'
])must(js,x);
if(runtime.includes('MutationObserver')||runtime.includes('setInterval('))throw new Error('R283_STATIC persistent reconciler introduced');
const meta=JSON.parse(release);if(meta.version!=='1.0.74'||meta.revision!=='r283-official-1.0.74'||meta.home_history_action_navigation_blocked!==true||meta.home_fresh_available_episodes!==true||meta.home_legacy_next_episode!=='watched-frontier-only'||meta.home_legacy_backlog_count_preserved!==true||meta.home_series_latest_watch_first!==true||meta.android!=='1.0.20/10062')throw new Error('R283_STATIC release flags');
console.log('R283_STATIC_OK History actions window-captured; fresh availability; Raw/SmackDown frontier next; r282 preserved');
