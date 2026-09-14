import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r274-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v274.js'),'utf8'),
 readFile(resolve(dist,'app-v274.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r275-history-rewatch-episode-dedupe.js'),'utf8')
]);
const once=(source,from,to,label)=>{const i=source.indexOf(from);if(i<0)throw new Error('r275 missing '+label);if(source.indexOf(from,i+from.length)>=0)throw new Error('r275 ambiguous '+label);return source.slice(0,i)+to+source.slice(i+from.length)};
const must=(source,needle,label=needle)=>{if(!source.includes(needle))throw new Error('r275 missing '+label)};
for(const x of[
 "window.__ctR275='collapsible-history+rewatch-multiplier+fresh-next+strict-dedupe';",
 "window.__ctR275History='collapsed-above-continue';",
 "window.__ctR275Series='fresh-tmdb-first-unseen+effective-tmdb-dedupe';",
 "rpc('cinetracker_home_series_watch_state_v1'",
 'function ct275DedupSeries(rows)',
 'function ct275HistorySection(kind,rows,authoritative,payload)',
 'function ct275NextText(x)',
 'async function ct275FirstReleasedUnseen(row,show)',
 'data-ct275-history-toggle',
 'ct275-plays-badge'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.65';window.__ctOfficialVersion='1.0.65';","window.__ctWebBuild='1.0.66';window.__ctOfficialVersion='1.0.66';",'web version');
js=once(js,"const REVISION='r274-official-1.0.65';","const REVISION='r275-official-1.0.66';",'revision');
must(js,"window.__ctR274='home-r6-fast+ascending-history+rich-meta+rewatch'",'r274 baseline');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.66 r275 — collapsible History, rewatch multipliers, fresh next episode and strict dedupe. */
[data-home] .ct275-history{overflow:hidden!important}
[data-home] .ct275-history-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}
[data-home] .ct275-history-head>div{display:flex!important;align-items:baseline!important;gap:8px!important;min-width:0!important}
[data-home] .ct275-history-toggle{appearance:none!important;border:1px solid rgba(148,163,184,.24)!important;background:rgba(15,23,42,.38)!important;color:var(--text,#e5edf5)!important;border-radius:999px!important;padding:7px 11px!important;font-size:12px!important;font-weight:700!important;white-space:nowrap!important;cursor:pointer!important;flex:0 0 auto!important;transition:background .18s ease,border-color .18s ease,transform .18s ease!important}
[data-home] .ct275-history-toggle:hover{background:rgba(51,65,85,.52)!important;border-color:rgba(148,163,184,.44)!important}
[data-home] .ct275-history-shell{display:grid!important;grid-template-rows:0fr!important;opacity:0!important;transform:translateY(-4px)!important;transition:grid-template-rows .28s ease,opacity .20s ease,transform .28s ease!important;overflow:hidden!important;min-height:0!important}
[data-home] .ct275-history-shell>.ct274-history-stack{min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important}
[data-home] .ct275-history.is-open>.ct275-history-shell{grid-template-rows:1fr!important;opacity:1!important;transform:translateY(0)!important}
[data-home] .ct275-history.is-collapsed>.ct275-history-shell{pointer-events:none!important}
[data-home] .ct275-plays-badge,.ct275-detail-plays-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:30px!important;height:24px!important;padding:0 7px!important;border-radius:999px!important;background:rgba(16,185,129,.16)!important;border:1px solid rgba(52,211,153,.35)!important;color:#6ee7b7!important;font-size:11px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;flex:0 0 auto!important}
.ct275-detail-plays-badge{margin-left:6px!important;vertical-align:middle!important}
.ct275-bump{animation:ct275MultiplierPop .46s cubic-bezier(.2,.8,.2,1)}
@keyframes ct275MultiplierPop{0%{transform:scale(.72);opacity:.45}55%{transform:scale(1.22);opacity:1}100%{transform:scale(1);opacity:1}}
[data-home] [data-home-view="series"]>.ct275-history,[data-home] [data-home-view="movies"]>.ct275-history{order:-100!important}
@media(max-width:640px){[data-home] .ct275-history-head{align-items:center!important}[data-home] .ct275-history-toggle{padding:6px 9px!important;font-size:11px!important}[data-home] .ct274-history-actions{gap:4px!important}[data-home] .ct275-plays-badge{min-width:27px!important;padding:0 5px!important}}
`;
html=html.replaceAll('app-v274.js','app-v275.js').replaceAll('app-v274.css','app-v275.css').replaceAll('CineTracker • v1.0.65','CineTracker • v1.0.66');
sw=sw.replaceAll('ct-web-1.0.65-r274','ct-web-1.0.66-r275').replaceAll('app-v274.js','app-v275.js').replaceAll('app-v274.css','app-v275.css');
const release={version:'1.0.66',revision:'r275-official-1.0.66',status:'official',base:'r274-production',home_payload_source:'cinetracker_profile_home_payload_v0997_r6',home_series_watch_state:'cinetracker_home_series_watch_state_v1',home_history_collapsible:true,home_history_default_collapsed:true,home_history_position:'above-continue',home_rewatch_multiplier:true,home_strict_dedupe:'effective-tmdb',home_fresh_episode_reconciliation:true,home_up_to_date_next_episode:true,home_watch_action_px:40,discover:'r274-preserved',detail:'r274-preserved+rewatch-badge',sports:'r274-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v275.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v275.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v274.js'),{force:true}),rm(resolve(dist,'app-v274.css'),{force:true})]);
console.log('WEB_R275_READY history=collapsed-above-continue rewatch=multiplier series=fresh-first-unseen dedupe=effective-tmdb');
