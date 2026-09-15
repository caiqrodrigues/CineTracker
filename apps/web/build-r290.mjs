import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r289-official.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v289.js'),'utf8'),
 readFile(resolve(dist,'app-v289.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r290-universal-media-card-lock.js'),'utf8')
]);
const once=(s,a,b,l)=>{const i=s.indexOf(a);if(i<0)throw new Error('r290 missing '+l);if(s.indexOf(a,i+a.length)>=0)throw new Error('r290 ambiguous '+l);return s.slice(0,i)+b+s.slice(i+a.length)};
const must=(s,x)=>{if(!s.includes(x))throw new Error('r290 missing '+x)};
for(const x of[
 "window.__ctR290='universal-media-card-lock';",
 "window.__ctR290Cards='indication-of-day-exact-154x231-mobile-176x264-desktop';",
 "window.__ctR290Structure='fixed-poster+fixed-copy+clamped-text';",
 "window.__ctR290Discover='all-nine-tabs-vertical-uniform-cards';",
 "--ct-media-card-w:176px",
 "--ct-media-poster-h:264px",
 "--ct-media-copy-h:80px",
 "--ct-media-card-w:154px",
 "--ct-media-poster-h:231px",
 "--ct-media-copy-h:75px",
 "window.ct171TopCard=standardTopCard",
 "-webkit-line-clamp:2!important",
 "white-space:nowrap!important"
])must(patch,x);
for(const x of[
 "window.__ctR288='discover-android-parity-web-only';",
 "window.__ctR289='discover-standard-card-size';",
 "window.__ctR289Cards='standard-154-mobile-176-desktop-2x3';"
])must(js,x);
js=once(js,"window.__ctWebBuild='1.0.80';window.__ctOfficialVersion='1.0.80';","window.__ctWebBuild='1.0.81';window.__ctOfficialVersion='1.0.81';",'version');
js=once(js,"const REVISION='r289-official-1.0.80';","const REVISION='r290-official-1.0.81';",'revision');
js=once(js,'\nboot();','\n'+patch+'\nboot();','runtime insertion');
css+=String.raw`
/* CineTracker Web 1.0.81 r290 — universal media cards locked to Indicação do Dia geometry. */
html,body,#app{max-width:100%;overflow-x:hidden}
`;
html=html.replaceAll('app-v289.js','app-v290.js').replaceAll('app-v289.css','app-v290.css').replaceAll('CineTracker • v1.0.80','CineTracker • v1.0.81');
sw=sw.replaceAll('ct-web-1.0.80-r289','ct-web-1.0.81-r290').replaceAll('app-v289.js','app-v290.js').replaceAll('app-v289.css','app-v290.css');
const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.81',
 revision:'r290-official-1.0.81',
 base:'r289-production',
 scope:'universal-media-card-standardization-web-only',
 media_card_reference:'indicacao-do-dia',
 media_card_mobile_poster:'154x231',
 media_card_desktop_poster:'176x264',
 media_card_ratio:'2:3',
 media_card_mobile_container:'154x308',
 media_card_desktop_container:'176x346',
 media_card_copy:'fixed-75-mobile-80-desktop',
 media_card_title:'line-clamp-2',
 media_card_metadata:'single-line-truncate',
 discover_cards:'all-nine-tabs-vertical-uniform',
 discover_top10:'vertical-standard-card-no-banner-fallback',
 android:'1.0.20/10062'
};
await Promise.all([
 writeFile(resolve(dist,'app-v290.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v290.css'),css,'utf8'),
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v289.js'),{force:true}),rm(resolve(dist,'app-v289.css'),{force:true})]);
console.log('WEB_R290_READY universal-media-cards indication-reference desktop=176x264 mobile=154x231 android=preserved');
