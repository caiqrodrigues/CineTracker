import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
if(process.env.CT_R416_SKIP_BUILD!=='1')await import('./build-r416.mjs');
const [js,html,css,sw,releaseRaw,runtime,pkgRaw,rootPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v416.js'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v416.css'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r416-profile-foryou-f1.js'),'utf8'),readFile(resolve('package.json'),'utf8'),readFile(resolve('../../package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('R416_STATIC '+m)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])ok(!runtime.includes(bad),'forbidden '+bad);
ok(js.includes("window.__ctWebBuild='1.0.207'")&&js.includes("const REVISION='r416-official-1.0.207'"),'identity');
ok(js.includes("window.__ctR416Marker='profile-persistent-first-paint+foryou-r411-final-owner+f1-series-optimistic-watch'"),'runtime marker');
ok(runtime.includes("window.__ctR411?.renderForYou?.(false)")&&runtime.includes('data-ct411-action="swap"'),'Pra Voce r411 final owner/swap');
ok(css.includes('[data-ct411-action="swap"]')&&css.includes('grid-template-columns:repeat(3'),'swap visibility/layout');
ok(runtime.includes("localStorage.setItem(pKey()")&&runtime.includes("rpc('cinetracker_profile_v380'"),'Profile durable snapshot/live v380');
ok(runtime.includes("rpc('cinetracker_mark_watch_v0994'")&&runtime.includes('p_released_episodes:ctx?.released||null'),'F1 imported-series write/released context');
ok(runtime.includes("rpc('cinetracker_f1_session_watch_set_v314'")&&runtime.includes("'f1:'+season+':'+ctx.round+':'+ctx.kind"),'F1 canonical session mirror');
ok(runtime.includes("document.dispatchEvent(new CustomEvent('cinetracker:data-changed'"),'F1 local invalidation event');
ok(html.includes('app-v416.js')&&!html.includes('app-v415.js'),'html asset');
ok(sw.includes('ct-web-1.0.207-r416')&&sw.includes('app-v416.js'),'service worker');
ok(JSON.parse(pkgRaw).version==='1.0.207'&&JSON.parse(rootPkgRaw).version==='1.0.207','package versions');
const rel=JSON.parse(releaseRaw);ok(rel.version==='1.0.207'&&rel.revision==='r416-official-1.0.207','release identity');
ok(rel.android==='unchanged-1.0.20/10062'||rel.android==='1.0.20/10062','Android changed');
console.log('R416_STATIC_OK Profile snapshot + Pra Voce native swaps + F1 series optimistic persistence');
