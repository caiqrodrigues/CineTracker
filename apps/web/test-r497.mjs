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
ok(js.includes('window.__ctR497Marker="stable-r495-exact-runtime+broken-release-sources-removed+modern-blue+full-browser-gate"'),'marker');
for(const need of ['cinetracker_home_series_v492','cinetracker_home_movies_v405','cinetracker_foryou_payload_v490','cinetracker_profile_screen_v495','cinetracker_f1_progress_v426','cinetracker_activity_items_by_day_v426'])ok(js.includes(need),'preserved '+need);
ok(js.includes("window.__ctR495Marker='modern-runtime+old-owners-retired+progressive-home+fast-profile+strict-12'"),'r495 proven runtime retained');
ok(js.includes("async function renderProfile(seq){return renderProfile491(seq)}"),'Profile dispatcher delegates fast renderer');
ok(js.includes(".some(isForYouControl)"),'Pra Você accepts active owner without first-active ambiguity');
ok(js.includes("classList.toggle('active',on)"),'Pra Você exclusively toggles active discover tab');
ok(!js.includes("document.documentElement;\n\nsw=sw.replaceAll"),'builder browser-global residue absent');
ok(!js.includes("async function renderProfile(seq){setApp(shell('Perfil'"),'legacy Profile renderer removed');
console.log('WEB_R497_REGRESSION_OK');
