import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r275-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v275.js'),'utf8'),
 readFile(resolve(dist,'app-v275.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r276-home-history-card-parity.js'),'utf8')
]);
const once=(source,from,to,label)=>{const i=source.indexOf(from);if(i<0)throw new Error('r276 missing '+label);if(source.indexOf(from,i+from.length)>=0)throw new Error('r276 ambiguous '+label);return source.slice(0,i)+to+source.slice(i+from.length)};
const must=(source,needle,label=needle)=>{if(!source.includes(needle))throw new Error('r276 missing '+label)};
for(const x of[
 "window.__ctR276='history-above-initial-viewport+episode-card-parity';",
 "window.__ctR276History='rendered-above-continue+no-toggle+initial-anchor';",
 "window.__ctR276Series='continue+dust+up-to-date-shared-episode-meta';",
 'function ct276HistorySection(kind,rows,authoritative,payload)',
 'function ct276EpisodeCard(x)',
 'async function ct276HydrateLastWatched(x)',
 'function ct276AnchorHome()',
 'ct275HistorySection=ct276HistorySection;',
 'ct275SeriesSection=ct276SeriesSection;',
 'paintHome=ct276PaintHome;renderHome=ct276RenderHome;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.66';window.__ctOfficialVersion='1.0.66';","window.__ctWebBuild='1.0.67';window.__ctOfficialVersion='1.0.67';",'web version');
js=once(js,"const REVISION='r275-official-1.0.66';","const REVISION='r276-official-1.0.67';",'revision');
must(js,"window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe'",'r275 baseline');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.67 r276 — history above initial viewport; active series share episode metadata. */
[data-home] .ct276-history{overflow:visible!important}
[data-home] .ct276-history>.ct274-history-stack{max-height:none!important;height:auto!important;overflow:visible!important}
[data-home] .ct276-history .ct275-history-toggle,[data-home] .ct276-history-shell{display:none!important}
[data-home] [data-ct276-series-section]{scroll-margin-top:10px!important}
`;
html=html.replaceAll('app-v275.js','app-v276.js').replaceAll('app-v275.css','app-v276.css').replaceAll('CineTracker • v1.0.66','CineTracker • v1.0.67');
sw=sw.replaceAll('ct-web-1.0.66-r275','ct-web-1.0.67-r276').replaceAll('app-v275.js','app-v276.js').replaceAll('app-v275.css','app-v276.css');
const release={version:'1.0.67',revision:'r276-official-1.0.67',status:'official',base:'r275-production',home_payload_source:'cinetracker_profile_home_payload_v0997_r6',home_series_watch_state:'cinetracker_home_series_watch_state_v1',home_history_mode:'above-initial-viewport',home_history_toggle:false,home_history_position:'above-continue',home_history_initial_anchor:'continue',home_rewatch_multiplier:true,home_strict_dedupe:'effective-tmdb',home_fresh_episode_reconciliation:true,home_up_to_date_next_episode:true,home_series_card_parity:['continue','dust','up_to_date'],home_up_to_date_last_watched_meta:true,home_watch_action_px:40,discover:'r275-preserved',detail:'r275-preserved',sports:'r275-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v276.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v276.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v275.js'),{force:true}),rm(resolve(dist,'app-v275.css'),{force:true})]);
console.log('WEB_R276_READY history=above-initial-viewport toggle=none cards=continue+dust+up-to-date');
