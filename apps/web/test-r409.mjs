import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R409_SKIP_BUILD!=='1')await import('./build-r409.mjs');
const [runtime,app,html,sw,pkg,rootPkg,releaseRaw]=await Promise.all([
 Promise.all(['01','02','03','04c1','04c2','04c3','04c4','04c5','04c6','04c7','04c8'].map(i=>readFile(resolve('runtime-r409-part'+i+'.txt'),'utf8'))).then(x=>x.join('')),readFile(resolve('dist/app-v409.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('dist/release.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error(m)};
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
for(const need of ["rpcCall('cinetracker_mark_watch_v0994'","rpc('cinetracker_home_history_v324'","rpcCall('cinetracker_discover_foryou_v396'","cinetracker_discover_watch_unseen_v396","cinetracker_discover_fresh_v387","Promise.any","[['watchlist','+ Watchlist'],['seen','✓ Visto'],['swap','↻ Trocar']]","const watchLocks=new Set()","const actionLocks=new Set()"] )ok(runtime.includes(need),'runtime missing '+need);
ok(app.includes("window.__ctWebBuild='1.0.200'")&&app.includes("const REVISION='r409-official-1.0.200'"),'identity');
ok(app.includes('if(window.__ctR409?.markWatched)return void window.__ctR409.markWatched(action)'),'r281 handoff');
ok(app.includes('getSeries:()=>series')&&app.includes('setSeries:(list,paint=true)'),'series bridge');
ok(app.includes("window.__ctR409?.onHomePaint?.('series')")&&app.includes("window.__ctR409?.onHomePaint?.('movies')"),'paint callbacks');
ok(app.includes('if(window.__ctR409?.loadForYou)return window.__ctR409.loadForYou(force)'),'ForYou load owner');
ok(app.includes('if(window.__ctR409?.renderForYou)return window.__ctR409.renderForYou()'),'ForYou render owner');
ok(html.includes('app-v409.js')&&!html.includes('app-v408.js'),'html asset');
ok(sw.includes('ct-web-1.0.200-r409')&&sw.includes('app-v409.js'),'service worker');
ok(JSON.parse(pkg).version==='1.0.200'&&JSON.parse(rootPkg).version==='1.0.200','packages');
const release=JSON.parse(releaseRaw);ok(release.version==='1.0.200'&&release.revision==='r409-official-1.0.200','release identity');
console.log('R409_STATIC_OK');
