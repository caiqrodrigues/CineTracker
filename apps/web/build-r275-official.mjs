import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r275.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v275.js','app-v275.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r275 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.66';window.__ctOfficialVersion='1.0.66';",
 "const REVISION='r275-official-1.0.66';",
 "window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe'",
 "window.__ctR275History='collapsed-above-continue'",
 "window.__ctR275Series='fresh-tmdb-first-unseen+effective-tmdb-dedupe'",
 "window.__ctR275DetailBadge='delegated-post-action+direct-global-wrapper'",
 "rpc('cinetracker_home_series_watch_state_v1'",
 'function ct275DedupSeries(rows)',
 'async function ct275FirstReleasedUnseen(row,show)',
 'function ct275HistorySection(kind,rows,authoritative,payload)',
 'function ct275DecorateDetailButton(btn)',
 "document.addEventListener('click',e=>{const btn=e.target?.closest?.('[data-ct171-rewatch-media],[data-ct171-rewatch-episode],.ct199-rewatch')",
 'data-ct275-history-toggle',
 'ct275-plays-badge',
 'paintHome=ct275PaintHome;renderHome=ct275RenderHome;',
 'ct274ReloadHome=ct275ReloadHome',
 'ct274Rewatch=ct275Rewatch'
])must(js,x);
for(const x of[
 '.ct275-history-shell{display:grid!important;grid-template-rows:0fr!important;',
 '.ct275-history.is-open>.ct275-history-shell{grid-template-rows:1fr!important;',
 '.ct275-plays-badge,.ct275-detail-plays-badge{display:inline-flex!important;',
 '@keyframes ct275MultiplierPop',
 '[data-home] [data-home-view="series"]>.ct275-history,[data-home] [data-home-view="movies"]>.ct275-history{order:-100!important}'
])must(css,x);
must(html,'app-v275.js');must(html,'app-v275.css');if(/app-v274\.(?:js|css)/.test(html))throw new Error('r275 html references r274 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.66'||meta.revision!=='r275-official-1.0.66')throw new Error('r275 release identity');
if(meta.home_history_collapsible!==true||meta.home_history_default_collapsed!==true||meta.home_history_position!=='above-continue'||meta.home_rewatch_multiplier!==true||meta.home_strict_dedupe!=='effective-tmdb'||meta.home_fresh_episode_reconciliation!==true||meta.home_up_to_date_next_episode!==true||meta.home_series_watch_state!=='cinetracker_home_series_watch_state_v1')throw new Error('r275 Home release flags');
if(meta.discover!=='r274-preserved'||meta.sports!=='r274-preserved'||meta.android!=='1.0.20/10062')throw new Error('r275 frozen surfaces');
must(sw,"const CACHE='ct-web-1.0.66-r275';");must(sw,'app-v275.js');must(sw,'app-v275.css');
console.log('WEB_1_0_66_OFFICIAL_OK r275 collapsible-history multiplier fresh-episodes dedupe');
