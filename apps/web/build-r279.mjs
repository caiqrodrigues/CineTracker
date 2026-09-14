import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r278-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v278.js'),'utf8'),
 readFile(resolve(dist,'app-v278.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r279-explicit-watched-buttons.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r279 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r279 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r279 missing '+x)};
for(const x of[
 "window.__ctR279='explicit-watched-buttons+canonical-r6-refresh';",
 "window.__ctR279Watch='real-button+episode+movie+finite-reconcile';",
 "window.__ctR279Tabs='r278-fixed-home-tabs-preserved';",
 'function ct279ExplicitWatchAction(kind,tmdb,s=0,e=0,title=',
 'function ct279Row(x,opts={})',
 'function ct279ReconcileWatchButtons(root=document)',
 'async function ct279MarkWatched(action)',
 'ct266WatchAction=ct279ExplicitWatchAction;',
 'ct274EpisodeWatchAction=ct279EpisodeWatchAction;',
 'ct274MovieWatchAction=ct279MovieWatchAction;',
 'ct274Row=ct279Row;',
 'ct266MarkWatched=ct279MarkWatched;',
 'ct275PaintHome=ct279PaintHome;',
 'paintHome=ct279PaintHome;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.69';window.__ctOfficialVersion='1.0.69';","window.__ctWebBuild='1.0.70';window.__ctOfficialVersion='1.0.70';",'version');
js=once(js,"const REVISION='r278-official-1.0.69';","const REVISION='r279-official-1.0.70';",'revision');
must(js,"window.__ctR278='effective-tmdb-watch-action+fixed-home-tabs'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.70 r279 — explicit watched buttons rendered as real controls in active cards. */
[data-home] .ct274-media-card.ct279-watch-host{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;box-sizing:border-box!important;min-width:0!important;width:100%!important;padding-right:12px!important;overflow:hidden!important}
[data-home] .ct274-media-card.ct279-watch-host>.ct274-row-left{min-width:0!important;flex:1 1 auto!important}
[data-home] .ct274-media-card.ct279-watch-host>.badge{flex:0 0 auto!important}
[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button{position:static!important;inset:auto!important;right:auto!important;left:auto!important;top:auto!important;bottom:auto!important;transform:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important;width:auto!important;min-width:82px!important;max-width:none!important;height:36px!important;min-height:36px!important;max-height:36px!important;flex:0 0 auto!important;margin:0 0 0 10px!important;padding:0 11px!important;border:1px solid rgba(52,211,153,.46)!important;border-radius:11px!important;background:rgba(16,185,129,.16)!important;color:#86efac!important;font:inherit!important;font-size:12px!important;font-weight:800!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;z-index:22!important}
[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button:hover,[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button:focus-visible{background:rgba(16,185,129,.28)!important;border-color:rgba(52,211,153,.72)!important;outline:none!important}
[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button[aria-disabled="true"],[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button:disabled{opacity:.55!important;cursor:wait!important;pointer-events:none!important}
[data-home] .ct279-watch-check{font-size:14px!important;line-height:1!important}
[data-home] .ct279-watch-label{display:inline!important;line-height:1!important}
@media(max-width:700px){[data-home] .ct274-media-card.ct279-watch-host{padding-right:9px!important}[data-home] .ct274-media-card.ct279-watch-host>.ct279-watch-button{min-width:74px!important;height:34px!important;min-height:34px!important;max-height:34px!important;margin-left:7px!important;padding:0 9px!important;font-size:11px!important;border-radius:10px!important}[data-home] .ct279-watch-check{font-size:13px!important}}
`;
html=html.replaceAll('app-v278.js','app-v279.js').replaceAll('app-v278.css','app-v279.css').replaceAll('CineTracker • v1.0.69','CineTracker • v1.0.70');
sw=sw.replaceAll('ct-web-1.0.69-r278','ct-web-1.0.70-r279').replaceAll('app-v278.js','app-v279.js').replaceAll('app-v278.css','app-v279.css');
const release={version:'1.0.70',revision:'r279-official-1.0.70',status:'official',base:'r278-production',home_history_mode:'above-initial-viewport',home_history_toggle:false,home_history_initial_anchor:'continue',home_series_card_parity:['continue','dust','up_to_date'],home_watch_action_visible:['continue','dust','movie_watchlist'],home_watch_action_control:'button',home_watch_action_label:'Marcar',home_watch_action_episode:true,home_watch_action_movie:true,home_watch_action_reconcile:'finite',home_watch_action_refresh:'canonical-r6',home_watch_action_tmdb_source:'effective+data-media',home_tabs_fixed:true,home_tabs_mode:'fixed-top',home_tabs_fixed_items:['series','movies'],sidebar_mode:'fixed-desktop-full-height',sidebar_fixed:true,discover:'r278-preserved',detail:'r278-preserved',sports:'r278-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v279.js'),js,'utf8'),writeFile(resolve(dist,'app-v279.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v278.js'),{force:true}),rm(resolve(dist,'app-v278.css'),{force:true})]);
console.log('WEB_R279_READY watched-buttons=episode+movie explicit-control canonical-r6-refresh');
