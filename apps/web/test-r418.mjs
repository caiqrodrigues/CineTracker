import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R418_SKIP_BUILD!=='1')await import('./build-r418.mjs');
const [js,html,css,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v418.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v418.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r418-home-foryou-profile-f1.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R418 '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.209'")&&js.includes("const REVISION='r418-official-1.0.209'"),'identity');
ok(runtime.includes("document.documentElement.dataset.ct418HomeEntering='series'")&&runtime.includes('seriesTarget()'),'preboot Home gate');
ok(runtime.includes('data-ct418-swap')&&runtime.includes("['watch','fresh']"),'Trocar semantic repair');
ok(runtime.includes("rpc('cinetracker_sport_stats_v418'")&&runtime.includes("l==='tempo assistido'")&&runtime.includes("l==='eventos assistidos'"),'Profile sports authority');
ok(runtime.includes("data-ct311-f1-watch")&&runtime.includes("rpc('cinetracker_f1_episode_watch_set_v418'")&&runtime.includes('const F1=865'),'F1 Hub as series');
ok(css.includes('html[data-ct418-home-entering="series"]')&&css.includes('.ct418-swap'),'css');
ok(html.includes('app-v418.js')&&!html.includes('app-v417.js'),'html asset');
ok(sw.includes('ct-web-1.0.209-r418')&&sw.includes('app-v418.js'),'service worker');
ok(JSON.parse(pkgRaw).version==='1.0.209'&&JSON.parse(rootPkgRaw).version==='1.0.209','versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.209'&&rel.revision==='r418-official-1.0.209','release');
console.log('R418_STATIC_OK');
