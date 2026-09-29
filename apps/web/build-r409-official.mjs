import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r409.mjs');
const [app,html,sw,pkg,rootPkg,releaseRaw,runtime]=await Promise.all([
 readFile(resolve('dist/app-v409.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),Promise.all(['01','02','03','04c1','04c2','04c3','04c4','04c5','04c6','04c7','04c8'].map(i=>readFile(resolve('runtime-r409-part'+i+'.txt'),'utf8'))).then(x=>x.join(''))
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(app.includes("window.__ctWebBuild='1.0.200'")&&app.includes("const REVISION='r409-official-1.0.200'"),'identity');
ok(app.includes('if(window.__ctR409?.markWatched)return void window.__ctR409.markWatched(action)'),'watch action owner');
ok(app.includes('getSeries:()=>series')&&app.includes("window.__ctR409?.onHomePaint?.('series')"),'Home optimistic bridge');
ok(runtime.includes("[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]"),'three actions');
ok(runtime.includes('Promise.any')&&runtime.includes('cinetracker_discover_watch_unseen_v396')&&runtime.includes('cinetracker_discover_fresh_v387'),'resilient sources');
ok(html.includes('app-v409.js')&&!html.includes('app-v408.js'),'html');
ok(sw.includes('ct-web-1.0.200-r409'),'sw');
ok(JSON.parse(pkg).version==='1.0.200'&&JSON.parse(rootPkg).version==='1.0.200','packages');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.200'&&rel.revision==='r409-official-1.0.200','release');
console.log('WEB_R409_OFFICIAL_OK');
