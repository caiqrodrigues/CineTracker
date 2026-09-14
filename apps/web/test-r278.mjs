import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r278-official.mjs');
const dist=resolve('dist');
const [js,css,release]=await Promise.all([readFile(resolve(dist,'app-v278.js'),'utf8'),readFile(resolve(dist,'app-v278.css'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('R278_STATIC missing '+x)};
for(const x of[
 "window.__ctR278='effective-tmdb-watch-action+fixed-home-tabs'",
 "window.__ctR278Watch='effective-tmdb+data-media-fallback+continue+dust+movie-watchlist'",
 "window.__ctR278Tabs='series-movies-fixed-top'",
 'function ct278EffectiveTmdb(x)',
 'function ct278EpisodeWatchAction(x)',
 'function ct278EpisodeAttrs(x,context)',
 'function ct278TmdbFromCard(card)',
 "raw.match(/^(?:tv|movie):(\\d+)$/)",
 'ct274EpisodeWatchAction=ct278EpisodeWatchAction;',
 'ct274EpisodeAttrs=ct278EpisodeAttrs;',
 'ct275PaintHome=ct278PaintHome;',
 "window.__ctR277='watch-action-host+fixed-sidebar'"
])must(js,x);
for(const x of['[data-home] .home-tabs{position:fixed!important;top:0!important;left:136px!important;right:0!important','@media(max-width:700px){[data-home]{padding-top:56px!important}[data-home] .home-tabs{position:fixed!important;top:0!important;left:0!important;right:0!important','visibility:visible!important;opacity:1!important','z-index:20!important'])must(css,x);
const meta=JSON.parse(release);if(meta.version!=='1.0.69'||meta.revision!=='r278-official-1.0.69'||meta.home_watch_action_tmdb_source!=='effective'||meta.home_watch_action_data_media_fallback!==true||meta.home_tabs_fixed!==true||meta.home_tabs_mode!=='fixed-top'||meta.android!=='1.0.20/10062')throw new Error('R278_STATIC release flags');
console.log('R278_STATIC_OK effective-tmdb watched-actions fixed-home-tabs');
