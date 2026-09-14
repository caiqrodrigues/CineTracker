import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r277-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v277.js'),'utf8'),
 readFile(resolve(dist,'app-v277.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(root,'runtime-r278-effective-tmdb-sticky-home-tabs.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r278 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r278 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r278 missing '+x)};
for(const x of[
 "window.__ctR278='effective-tmdb-watch-action+sticky-home-tabs';",
 "window.__ctR278Watch='effective-tmdb+data-media-fallback+continue+dust+movie-watchlist';",
 "window.__ctR278Tabs='series-movies-sticky-top';",
 'function ct278EffectiveTmdb(x)',
 'function ct278EpisodeWatchAction(x)',
 'function ct278EpisodeAttrs(x,context)',
 'function ct278EnsureWatchActions(root=document)',
 'ct274EpisodeWatchAction=ct278EpisodeWatchAction;',
 'ct274EpisodeAttrs=ct278EpisodeAttrs;',
 'ct275PaintHome=ct278PaintHome;',
 'paintHome=ct278PaintHome;'
])must(patch,x);
js=once(js,"window.__ctWebBuild='1.0.68';window.__ctOfficialVersion='1.0.68';","window.__ctWebBuild='1.0.69';window.__ctOfficialVersion='1.0.69';",'version');
js=once(js,"const REVISION='r277-official-1.0.68';","const REVISION='r278-official-1.0.69';",'revision');
must(js,"window.__ctR277='watch-action-host+fixed-sidebar'");
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.69 r278 — effective TMDB watch action; Séries/Filmes always visible while Home scrolls. */
[data-home] .home-tabs{position:sticky!important;top:0!important;z-index:40!important;box-sizing:border-box!important;background:var(--bg,#06131b)!important;padding-top:8px!important;padding-bottom:8px!important;margin-top:-8px!important}
[data-home] .ct274-media-card.ct266-home-watch-host{position:relative!important;padding-right:48px!important}
[data-home] .ct274-media-card.ct266-home-watch-host>[data-ct266-watch]{position:absolute!important;right:8px!important;top:50%!important;transform:translateY(-50%)!important;display:grid!important;place-items:center!important;visibility:visible!important;opacity:1!important;z-index:20!important;width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important}
@media(max-width:700px){[data-home] .home-tabs{top:0!important;z-index:50!important}[data-home] .ct274-media-card.ct266-home-watch-host{padding-right:44px!important}[data-home] .ct274-media-card.ct266-home-watch-host>[data-ct266-watch]{right:6px!important;width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important}}
`;
html=html.replaceAll('app-v277.js','app-v278.js').replaceAll('app-v277.css','app-v278.css').replaceAll('CineTracker • v1.0.68','CineTracker • v1.0.69');
sw=sw.replaceAll('ct-web-1.0.68-r277','ct-web-1.0.69-r278').replaceAll('app-v277.js','app-v278.js').replaceAll('app-v277.css','app-v278.css');
const release={version:'1.0.69',revision:'r278-official-1.0.69',status:'official',base:'r277-production',home_history_mode:'above-initial-viewport',home_history_toggle:false,home_history_initial_anchor:'continue',home_series_card_parity:['continue','dust','up_to_date'],home_watch_action_visible:['continue','dust','movie_watchlist'],home_watch_action_tmdb_source:'effective',home_watch_action_data_media_fallback:true,home_tabs_sticky:true,home_tabs_sticky_items:['series','movies'],sidebar_mode:'fixed-desktop-full-height',sidebar_fixed:true,discover:'r277-preserved',detail:'r277-preserved',sports:'r277-preserved',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v278.js'),js,'utf8'),writeFile(resolve(dist,'app-v278.css'),css,'utf8'),writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v277.js'),{force:true}),rm(resolve(dist,'app-v277.css'),{force:true})]);
console.log('WEB_R278_READY watch-action=effective-tmdb home-tabs=sticky');
