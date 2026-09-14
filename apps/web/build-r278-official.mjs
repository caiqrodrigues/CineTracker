import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r278.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v278.js','app-v278.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r278 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.69';window.__ctOfficialVersion='1.0.69';",
 "const REVISION='r278-official-1.0.69';",
 "window.__ctR277='watch-action-host+fixed-sidebar'",
 "window.__ctR278='effective-tmdb-watch-action+sticky-home-tabs'",
 "window.__ctR278Tabs='series-movies-sticky-top'",
 'function ct278EffectiveTmdb(x)',
 'function ct278EpisodeWatchAction(x)',
 'function ct278EnsureWatchActions(root=document)',
 'ct274EpisodeWatchAction=ct278EpisodeWatchAction;',
 'ct274EpisodeAttrs=ct278EpisodeAttrs;',
 'ct275PaintHome=ct278PaintHome;',
 'paintHome=ct278PaintHome;'
])must(js,x);
for(const x of['[data-home] .home-tabs{position:sticky!important;top:0!important;z-index:40!important','visibility:visible!important;opacity:1!important','.sidebar{position:fixed!important;left:0!important;top:0!important'])must(css,x);
must(html,'app-v278.js');must(html,'app-v278.css');if(/app-v277\.(?:js|css)/.test(html))throw new Error('r278 html references r277 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.69'||meta.revision!=='r278-official-1.0.69'||meta.home_watch_action_tmdb_source!=='effective'||meta.home_watch_action_data_media_fallback!==true||meta.home_tabs_sticky!==true||meta.sidebar_fixed!==true)throw new Error('r278 release identity');
if(meta.android!=='1.0.20/10062')throw new Error('r278 Android changed');
must(sw,"const CACHE='ct-web-1.0.69-r278';");must(sw,'app-v278.js');must(sw,'app-v278.css');
console.log('WEB_1_0_69_OFFICIAL_OK r278 effective-tmdb sticky-home-tabs');
