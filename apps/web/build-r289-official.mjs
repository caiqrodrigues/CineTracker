import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r289.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v289.js','app-v289.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r289 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.80';window.__ctOfficialVersion='1.0.80';",
 "const REVISION='r289-official-1.0.80';",
 "window.__ctR287='home-interaction-liveness+available-episode-priority'",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR288Discover='nine-tabs+stable-shell+provider-top10+three-slot-foryou'",
 "window.__ctR288Top10='provider-specific-series+movies-real-rails'",
 "window.__ctR288ForYou='movie-series-anime-independent-swap'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR289Cards='legacy-standard-128-152px-2x3'",
 '--ct289-card-w:clamp(128px,14vw,152px)',
 'grid-auto-columns:var(--ct289-card-w)!important',
 'grid-template-columns:repeat(auto-fill,var(--ct289-card-w))!important',
 'aspect-ratio:2/3!important'
])must(js,x);
must(html,'app-v289.js');must(html,'app-v289.css');must(css,'overflow-x:hidden');
const m=JSON.parse(release);
if(m.version!=='1.0.80'||m.revision!=='r289-official-1.0.80'||m.discover_owner!=='r288-live-r263-bridge'||m.discover_tabs!==9||m.discover_tab_switch!=='content-only-no-shell-rebuild'||m.discover_card_size!=='legacy-standard-128-152px'||m.discover_card_ratio!=='2:3'||m.discover_card_layout!=='fixed-local-rail-no-stretch'||m.android!=='1.0.20/10062')throw new Error('r289 release identity');
must(sw,"const CACHE='ct-web-1.0.80-r289';");
console.log('WEB_1_0_80_OFFICIAL_OK r289 Discover standard card size Web-only');
