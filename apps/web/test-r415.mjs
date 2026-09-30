import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R415_SKIP_BUILD!=='1')await import('./build-r415.mjs');
const [runtime,app,css,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 readFile(resolve('runtime-r415-home-foryou-profile-stability.js'),'utf8'),readFile(resolve('dist/app-v415.js'),'utf8'),readFile(resolve('dist/app-v415.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ["window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile'",'stableSamples>=6','data-ct415-swap','↻ Trocar',"rpc('cinetracker_profile_v380'",'profilePaint(cached)'])ok(runtime.includes(need),'runtime '+need);
ok(!runtime.includes("rpc('cinetracker_profile_payload_v0997'")&&!runtime.includes("rpc('cinetracker_profile_media_dashboard_v0991'")&&!runtime.includes("rpc('cinetracker_profile_quick_stats_v1'"),'legacy profile fan-out reintroduced');
ok(app.includes("window.__ctR415Marker='stable-series-entry+visible-functional-7-swap+single-v380-profile'"),'built marker');
ok(css.includes('html[data-ct415-home-entering="series"]')&&css.includes('[data-ct415-cols="3"]')&&css.includes('[data-ct415-cols="2"]'),'css');
ok(html.includes('app-v415.js')&&!html.includes('app-v414.js'),'html');
ok(sw.includes('ct-web-1.0.206-r415'),'sw');
ok(JSON.parse(pkg).version==='1.0.206'&&JSON.parse(rootPkg).version==='1.0.206','packages');
const rel=JSON.parse(releaseRaw);ok(rel.scope==='home-series-entry+discover-foryou-swap+profile-loading','release scope');
console.log('R415_STATIC_OK Home stable entry + visible swap + single v380 Profile');