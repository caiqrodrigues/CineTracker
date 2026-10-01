import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R417_SKIP_BUILD!=='1')await import('./build-r417.mjs');
const [js,html,css,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v417.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v417.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r417-home-foryou-profile-f1.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R417_STATIC '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.208'")&&js.includes("const REVISION='r417-official-1.0.208'"),'identity');
ok(runtime.includes('ct417HomeEntering')&&runtime.includes('view.scrollHeight')&&runtime.includes('homeStable>=12'),'Home final-geometry gate');
ok(runtime.includes('data-ct417-swap')&&runtime.includes("['daily','watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime']"),'seven visible swap slots');
ok(runtime.includes("window.__ctR411?.swap?.(name)")&&runtime.includes("window.__ctR368.handle"),'functional swap delegation');
ok(runtime.includes("rpc('cinetracker_sport_stats_v1'")&&runtime.includes("label==='tempo assistido'")&&runtime.includes("label==='eventos assistidos'"),'Profile sports metrics repair');
ok(runtime.includes('const F1_MEDIA_ID=865')&&runtime.includes("rpc('cinetracker_mark_watch_v0994'")&&runtime.includes('p_media_id:F1_MEDIA_ID'),'F1 series authority persistence');
ok(runtime.includes('optimisticF1417(btn,true)')&&runtime.includes('rollbackF1417(snap)'),'F1 optimistic UI/rollback');
ok(css.includes('html[data-ct417-home-entering="series"]')&&css.includes('.ct417-swap'),'r417 CSS');
ok(html.includes('app-v417.js')&&!html.includes('app-v416.js'),'html asset');
ok(sw.includes('ct-web-1.0.208-r417')&&sw.includes('app-v417.js'),'service worker');
ok(JSON.parse(pkgRaw).version==='1.0.208'&&JSON.parse(rootPkgRaw).version==='1.0.208','package versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.208'&&rel.revision==='r417-official-1.0.208','release identity');
ok(rel.android==='unchanged-1.0.20/10062'||rel.android==='1.0.20/10062','Android changed');
console.log('R417_STATIC_OK Home series stable + 7 Trocar + Profile sports metrics + F1 series');
