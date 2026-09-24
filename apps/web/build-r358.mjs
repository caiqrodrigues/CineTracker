import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r357.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v357.js'),'utf8'),
 readFile(resolve(dist,'app-v357.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r358-home-actions-first.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r358 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.148';window.__ctOfficialVersion='1.0.148';",
 "const REVISION='r357-official-1.0.148';",
 "const version='1.0.148',revision='r357-official-1.0.148';",
 "window.__ctR357Marker='media-kind-badge+full-meta+foryou-final-click-owner+national-team-ready'",
 "boot();"
])if(!js.includes(x))throw new Error('r358 missing '+x);

const bootstrap=`/* r358 true first capture: registered before every legacy click listener. */
window.addEventListener('click',e=>{try{const h=window.__ctR358Early;if(typeof h==='function'&&h(e.target,e)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();}}catch{}},true);
`;
js=bootstrap+js;

js=once(js,"window.__ctWebBuild='1.0.148';window.__ctOfficialVersion='1.0.148';","window.__ctWebBuild='1.0.149';window.__ctOfficialVersion='1.0.149';",'version');
js=once(js,"const REVISION='r357-official-1.0.148';","const REVISION='r358-official-1.0.149';",'revision');
js=once(js,"const version='1.0.148',revision='r357-official-1.0.148';","const version='1.0.149',revision='r358-official-1.0.149';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v357.js','app-v358.js').replaceAll('app-v357.css','app-v358.css').replaceAll('v1.0.148','v1.0.149').replaceAll('r357-official-1.0.148','r358-official-1.0.149');
sw=sw.replaceAll('ct-web-1.0.148-r357','ct-web-1.0.149-r358').replaceAll('app-v357.js','app-v358.js').replaceAll('app-v357.css','app-v358.css');
css+='\n/* CineTracker Web 1.0.149 r358 — first-capture Pra Você actions + Home episode-ready gate. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.149',revision:'r358-official-1.0.149',base:'r357-production',
 scope:'foryou-true-first-capture+home-ready-before-reveal',
 discover_foryou_click_owner:'r358-physical-first-window-capture',
 discover_foryou_actions:'local-slot-immediate+direct-backend-persist+no-global-repaint',
 discover_foryou_repaint:'clicked-slot-only',
 home_startup:'tv-refresh-before-first-paint+episode-meta-gate',
 home_episode_reveal:'wait-until-visible-episode-title-rating-date-ready',
 home_late_refresh:'r325-session-guard-prearmed-before-render',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r358 Android baseline changed');

await Promise.all([
 writeFile(resolve(dist,'app-v358.js'),js),writeFile(resolve(dist,'app-v358.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v357.js'),{force:true}),rm(resolve(dist,'app-v357.css'),{force:true})]);
console.log('WEB_R358_READY true first-capture Pra Você actions + Home metadata ready before reveal');
