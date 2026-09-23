import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r340.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v340.js'),'utf8'),
 readFile(resolve(dist,'app-v340.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r341-discover-poster-lock.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r341 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r341 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.131';window.__ctOfficialVersion='1.0.131';",
 "const REVISION='r340-official-1.0.131';",
 "const version='1.0.131',revision='r340-official-1.0.131';",
 "window.__ctR340Marker='sports-every-open-auth-retry+discover-all-tabs-exact-card-width'",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR341Marker='discover-poster-lock+explicit-button-pixels+legacy-layout-writers-retired'",
 "'.ct288-poster'",
 "imp(b,'flex','0 0 '+bp)",
 "ResizeObserver",
 "__ctR339Base",
 "__ctR338Base"
])must(runtime,x);

js=once(js,"window.__ctWebBuild='1.0.131';window.__ctOfficialVersion='1.0.131';","window.__ctWebBuild='1.0.132';window.__ctOfficialVersion='1.0.132';",'web version');
js=once(js,"const REVISION='r340-official-1.0.131';","const REVISION='r341-official-1.0.132';",'revision');
js=once(js,"const version='1.0.131',revision='r340-official-1.0.131';","const version='1.0.132',revision='r341-official-1.0.132';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v340.js','app-v341.js').replaceAll('app-v340.css','app-v341.css').replaceAll('v1.0.131','v1.0.132').replaceAll('r340-official-1.0.131','r341-official-1.0.132');
sw=sw.replaceAll('ct-web-1.0.131-r340','ct-web-1.0.132-r341').replaceAll('app-v340.js','app-v341.js').replaceAll('app-v340.css','app-v341.css');
css+='\n/* CineTracker Web 1.0.132 r341 — Discover buttons locked to rendered poster geometry with explicit pixel widths. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.132',revision:'r341-official-1.0.132',base:'r340-production',
 scope:'discover-action-poster-lock+retire-legacy-layout-writers',
 discover_all_tabs_actions:'rendered-poster-width+explicit-equal-pixel-buttons+late-settle+resize-observer',
 discover_action_authority:'r341-poster-rect-only',
 discover_action_conflicts:'r338+r339-method-layout-wrappers-retired',
 discover_action_validation:'desktop-1680x900+mobile-412x915',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r341 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v341.js'),js),writeFile(resolve(dist,'app-v341.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v340.js'),{force:true}),rm(resolve(dist,'app-v340.css'),{force:true})]);
console.log('WEB_R341_READY Discover action rows use poster width and explicit equal pixel buttons');
