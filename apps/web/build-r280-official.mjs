import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r280.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v280.js','app-v280.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r280 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.71';window.__ctOfficialVersion='1.0.71';",
 "const REVISION='r280-official-1.0.71';",
 "window.__ctR279='explicit-watched-buttons+canonical-r6-refresh'",
 "window.__ctR280='minimal-watch-check+green-active'",
 "window.__ctR280Watch='check-only+muted-idle+green-on-click'",
 'function ct280MinimalWatchAction(kind,tmdb,s=0,e=0,title=',
 'async function ct280MarkWatched(action)',
 'ct279ExplicitWatchAction=ct280MinimalWatchAction;',
 'ct279MarkWatched=ct280MarkWatched;'
])must(js,x);
for(const x of[
 '[data-home] button.ct280-watch-button[data-ct279-watch]{position:static!important',
 'width:40px!important;min-width:40px!important;max-width:40px!important',
 'opacity:.64!important',
 'background:rgba(16,185,129,.20)!important',
 '[data-home] .home-tabs{position:fixed!important;top:0!important;left:136px!important;right:0!important',
 '.sidebar{position:fixed!important;left:0!important;top:0!important'
])must(css,x);
must(html,'app-v280.js');must(html,'app-v280.css');if(/app-v279\.(?:js|css)/.test(html))throw new Error('r280 html references r279 assets');
const meta=JSON.parse(release);if(meta.version!=='1.0.71'||meta.revision!=='r280-official-1.0.71'||meta.home_watch_action_control!=='minimal-check'||meta.home_watch_action_text!==false||meta.home_watch_action_size_px!==40||meta.home_watch_action_idle!=='muted'||meta.home_watch_action_click_feedback!=='green'||meta.home_tabs_fixed!==true||meta.sidebar_fixed!==true)throw new Error('r280 release identity');
if(meta.android!=='1.0.20/10062')throw new Error('r280 Android changed');
must(sw,"const CACHE='ct-web-1.0.71-r280';");must(sw,'app-v280.js');must(sw,'app-v280.css');
console.log('WEB_1_0_71_OFFICIAL_OK r280 minimal muted watch check green feedback');
