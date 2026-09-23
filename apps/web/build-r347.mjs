import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r346.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v346.js'),'utf8'),
 readFile(resolve(dist,'app-v346.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r347-production-layout-buttons.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r347 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r347 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.137';window.__ctOfficialVersion='1.0.137';",
 "const REVISION='r346-official-1.0.137';",
 "const version='1.0.137',revision='r346-official-1.0.137';",
 "window.__ctR346Marker='restore-content-layout+dedicated-search-row+filters-source-removed'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR347Marker='remove-r338-zero-width-css+full-home-width+stable-foryou-buttons'",
 "ct-web-r338",
 "repairForYou347",
 "restorePage347"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.137';window.__ctOfficialVersion='1.0.137';","window.__ctWebBuild='1.0.138';window.__ctOfficialVersion='1.0.138';",'web version');
js=once(js,"const REVISION='r346-official-1.0.137';","const REVISION='r347-official-1.0.138';",'revision');
js=once(js,"const version='1.0.137',revision='r346-official-1.0.137';","const version='1.0.138',revision='r347-official-1.0.138';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v346.js','app-v347.js').replaceAll('app-v346.css','app-v347.css').replaceAll('v1.0.137','v1.0.138').replaceAll('r346-official-1.0.137','r347-official-1.0.138');
sw=sw.replaceAll('ct-web-1.0.137-r346','ct-web-1.0.138-r347').replaceAll('app-v346.js','app-v347.js').replaceAll('app-v346.css','app-v347.css');
css+='\n/* CineTracker Web 1.0.138 r347 — remove r338 zero-width Pra Você CSS and restore full-width Home/content. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.138',revision:'r347-official-1.0.138',base:'r346-production',
 scope:'production-layout+foryou-button-root-fix',
 page_layout:'content-normal-flow+home-full-inner-width',
 discover_foryou_legacy_css:'r338+r339-removed-at-runtime',
 discover_foryou_buttons:'nonzero-grid-buttons+swap-visible+poster-width-row',
 discover_filters:'r318+r336-source-removed',
 navigation_back:'dedicated-search-row-icon-only',
 discover_top10_geometry:'desktop-ten-equal-columns-visible-in-viewport',
 home_startup:'fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r347 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v347.js'),js),writeFile(resolve(dist,'app-v347.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v346.js'),{force:true}),rm(resolve(dist,'app-v346.css'),{force:true})]);
console.log('WEB_R347_READY full-width Home/content + nonzero Pra Você buttons');
