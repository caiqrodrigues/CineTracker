import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r290.mjs');
const dist=resolve('dist');
const [html,js,css,release,sw]=await Promise.all(['index.html','app-v290.js','app-v290.css','release.json','service-worker.js'].map(f=>readFile(resolve(dist,f),'utf8')));
const must=(s,x)=>{if(!s.includes(x))throw new Error('r290 official missing '+x)};
for(const x of[
 "window.__ctWebBuild='1.0.81';window.__ctOfficialVersion='1.0.81';",
 "const REVISION='r290-official-1.0.81';",
 "window.__ctR288='discover-android-parity-web-only'",
 "window.__ctR289='discover-standard-card-size'",
 "window.__ctR290='universal-media-card-lock'",
 "window.__ctR290Cards='indication-of-day-exact-154x231-mobile-176x264-desktop'",
 "window.__ctR290Structure='fixed-poster+fixed-copy+clamped-text'",
 "window.__ctR290Discover='all-nine-tabs-vertical-uniform-cards'",
 "--ct-media-card-w:176px",
 "--ct-media-poster-h:264px",
 "--ct-media-copy-h:80px",
 "--ct-media-card-w:154px",
 "--ct-media-poster-h:231px",
 "--ct-media-copy-h:75px",
 "window.ct171TopCard=standardTopCard",
 "-webkit-line-clamp:2!important",
 "white-space:nowrap!important",
 "grid-template-columns:repeat(auto-fill,var(--ct-media-card-w))!important"
])must(js,x);
must(html,'app-v290.js');must(html,'app-v290.css');must(css,'overflow-x:hidden');
const m=JSON.parse(release);
if(m.version!=='1.0.81'||m.revision!=='r290-official-1.0.81'||m.media_card_reference!=='indicacao-do-dia'||m.media_card_mobile_poster!=='154x231'||m.media_card_desktop_poster!=='176x264'||m.media_card_ratio!=='2:3'||m.media_card_title!=='line-clamp-2'||m.media_card_metadata!=='single-line-truncate'||m.discover_top10!=='vertical-standard-card-no-banner-fallback'||m.android!=='1.0.20/10062')throw new Error('r290 release identity');
must(sw,"const CACHE='ct-web-1.0.81-r290';");
console.log('WEB_1_0_81_OFFICIAL_OK r290 universal media cards locked to Indicação do Dia; Android preserved');
