import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r358.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v358.js'),'utf8'),
 readFile(resolve(dist,'app-v358.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r359-home-cache-direct-actions.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r359 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.149';window.__ctOfficialVersion='1.0.149';",
 "const REVISION='r358-official-1.0.149';",
 "const version='1.0.149',revision='r358-official-1.0.149';",
 "window.__ctR358Marker='true-first-capture-foryou-actions+home-ready-before-reveal'",
 "boot();"
])if(!js.includes(x))throw new Error('r359 missing '+x);

const bootstrap=`/* r359 absolute first capture: direct target-slot action owner. */
window.addEventListener('click',e=>{try{const h=window.__ctR359Early;if(typeof h==='function'&&h(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();}}catch{}},true);
`;
js=bootstrap+js;
js=once(js,"window.__ctWebBuild='1.0.149';window.__ctOfficialVersion='1.0.149';","window.__ctWebBuild='1.0.150';window.__ctOfficialVersion='1.0.150';",'version');
js=once(js,"const REVISION='r358-official-1.0.149';","const REVISION='r359-official-1.0.150';",'revision');
js=once(js,"const version='1.0.149',revision='r358-official-1.0.149';","const version='1.0.150',revision='r359-official-1.0.150';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v358.js','app-v359.js').replaceAll('app-v358.css','app-v359.css').replaceAll('v1.0.149','v1.0.150').replaceAll('r358-official-1.0.149','r359-official-1.0.150');
sw=sw.replaceAll('ct-web-1.0.149-r358','ct-web-1.0.150-r359').replaceAll('app-v358.js','app-v359.js').replaceAll('app-v358.css','app-v359.css');
css+='\n/* CineTracker Web 1.0.150 r359 — direct Pra Você actions + cached Home episode metadata. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.150',revision:'r359-official-1.0.150',base:'r358-production',
 scope:'direct-foryou-actions+home-episode-cache-first-paint',
 discover_foryou_click_owner:'r359-absolute-first-window-capture',
 discover_foryou_actions:'direct-local-mutation+clicked-slot-render+direct-backend-persist',
 discover_foryou_repaint:'clicked-slot-only-no-global-event',
 home_payload_source:'cinetracker_home_payload_v359',
 home_episode_metadata:'episode-catalog-cache-first',
 home_episode_hydration:'skip-when-cache-complete',
 home_episode_fallback:'tmdb-only-on-cache-miss',
 tv_refresh:'ct-refresh-tv-state-user-v2-episode-cache',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r359 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v359.js'),js),writeFile(resolve(dist,'app-v359.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v358.js'),{force:true}),rm(resolve(dist,'app-v358.css'),{force:true})]);
console.log('WEB_R359_READY direct target-slot actions + cached episode metadata first paint');
