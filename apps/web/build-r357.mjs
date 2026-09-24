import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r356.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v356.js'),'utf8'),
 readFile(resolve(dist,'app-v356.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r357-card-meta-actions.js'),'utf8')
]);
const count=(s,x)=>s.split(x).length-1;
const once=(s,a,b,l)=>{const n=count(s,a);if(n!==1)throw new Error('r357 expected one '+l+', found '+n);return s.replace(a,b)};
for(const x of[
 "window.__ctWebBuild='1.0.147';window.__ctOfficialVersion='1.0.147';",
 "const REVISION='r356-official-1.0.147';",
 "const version='1.0.147',revision='r356-official-1.0.147';",
 "window.__ctR356Marker='foryou-actions-dom-key-fallback+sports-authoritative-payload-repaint'",
 "window.addEventListener('click',e=>{try{const t=e.target;const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(t,e))return;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 "boot();"
])if(!js.includes(x))throw new Error('r357 missing '+x);

/* r357 is the first and final decision for Descobrir > Pra você clicks. */
js=once(js,
 "window.addEventListener('click',e=>{try{const t=e.target;const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(t,e))return;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 "window.addEventListener('click',e=>{try{const t=e.target;const direct357=window.__ctR357DirectClick;if(typeof direct357==='function'&&direct357(t,e))return;const direct355=window.__ctR355DirectClick;if(typeof direct355==='function'&&direct355(t,e))return;const direct354=window.__ctR354DirectClick;if(typeof direct354==='function'&&direct354(t,e))return;const api=window.__ctR306;if(!api||!t?.closest)return;",
 'true earliest r357 click hook'
);

js=once(js,"window.__ctWebBuild='1.0.147';window.__ctOfficialVersion='1.0.147';","window.__ctWebBuild='1.0.148';window.__ctOfficialVersion='1.0.148';",'version');
js=once(js,"const REVISION='r356-official-1.0.147';","const REVISION='r357-official-1.0.148';",'revision');
js=once(js,"const version='1.0.147',revision='r356-official-1.0.147';","const version='1.0.148',revision='r357-official-1.0.148';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v356.js','app-v357.js').replaceAll('app-v356.css','app-v357.css').replaceAll('v1.0.147','v1.0.148').replaceAll('r356-official-1.0.147','r357-official-1.0.148');
sw=sw.replaceAll('ct-web-1.0.147-r356','ct-web-1.0.148-r357').replaceAll('app-v356.js','app-v357.js').replaceAll('app-v356.css','app-v357.css');
css+='\n/* CineTracker Web 1.0.148 r357 — media type badge + complete metadata + final Pra Você click owner. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.148',revision:'r357-official-1.0.148',base:'r356-production',
 scope:'media-card-badge-meta+foryou-final-actions+sports-national-teams',
 media_kind:'badge-on-poster-no-kind-in-meta',
 media_metadata:'year+rating+primary-genre+tmdb-detail-fallback',
 discover_foryou_click_owner:'r357-first-branch-before-r354-r355-r356',
 discover_foryou_actions:'r352-local-slot-only+background-persist',
 discover_foryou_repaint:'clicked-slot-only',
 sports_national_teams:'espn-international-routes-v5',
 sports_payload:'r255-authoritative-bridge+forced-reload-after-sync',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r357 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v357.js'),js),writeFile(resolve(dist,'app-v357.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v356.js'),{force:true}),rm(resolve(dist,'app-v356.css'),{force:true})]);
console.log('WEB_R357_READY universal media badge/meta + final Pra Você actions + national-team Sports routes');
