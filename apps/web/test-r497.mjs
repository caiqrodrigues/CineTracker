import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r497.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v497.js'),'utf8'),readFile(resolve('dist/app-v497.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r497 '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.24'&&webPkg.version==='0.3.24','version');
ok(release.version==='0.3.24'&&release.revision==='r497-official-0.3.24','release');
ok(html.includes('app-v497.js?ct=r497-official-0.3.24')&&html.includes('app-v497.css?ct=r497-official-0.3.24'),'assets');
for(const bad of ['auth-page','cloud-bar','MENU DIÁRIO','--gold:#d6b55b'])ok(!html.includes(bad),'legacy html '+bad);
ok(html.includes('ct497-boot')&&html.includes('#041017'),'modern boot');
ok(css.includes('--gold:#58afe0!important'),'blue token');
ok(js.includes('window.__ctR497Marker="stable-r495-base+dead-runtimes-physically-pruned+modern-blue+full-browser-gate"'),'marker');
ok(Number(release.dead_runtime_blocks_removed)>=20,'dead blocks removed');
ok(Number(release.dead_runtime_bytes_removed)>10000,'dead bytes removed');
for(const n of [380,381,382,383,384,385,386,389,390,391,392,393,394,395,396,397,398,400,401,402,403,404,405,406,407,408,410,411,412,414,427,429,430,431,432,434,445,449,456,457,458,459,460,461,467,468,469,470,481,482,484,485,486,487,488,489])ok(!js.includes('window.__ctR'+n+'Marker=')&&!js.includes('window.__ctR'+n+'Marker ='),'retired marker r'+n);
for(const need of ['cinetracker_home_series_v492','cinetracker_home_movies_v405','cinetracker_foryou_payload_v490','cinetracker_profile_screen_v495','cinetracker_f1_progress_v426','cinetracker_activity_items_by_day_v426'])ok(js.includes(need),'preserved '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)'])ok(!js.slice(js.lastIndexOf('window.__ctR497Marker')-1000).includes(bad),'forbidden '+bad);
console.log('WEB_R497_REGRESSION_OK');
