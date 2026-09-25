import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
if(process.env.CT_R374_SKIP_BUILD!=='1')await import('./build-r374.mjs');
const [html,js,sw,rel,src]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),readFile(resolve('dist/app-v374.js'),'utf8'),readFile(resolve('dist/service-worker.js'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('runtime-r374-home-tab-scroll-reset.js'),'utf8')
]);
const r=JSON.parse(rel),ok=(v,m)=>{if(!v)throw new Error(m)};
for(const x of ["window.__ctR374Marker='home-tab-switch-scroll-reset+legacy-anchor-blocked+container-aware'","window.scrollTo({top:0,left:0,behavior:'auto'})","document.scrollingElement.scrollTop=0","el.scrollTop=0","window.addEventListener('click'","event?.stopImmediatePropagation?.()","['wheel','touchmove']"])ok(src.includes(x),'missing '+x);
ok(html.includes('app-v374.js')&&sw.includes('ct-web-1.0.165-r374'),'asset identity');
ok(r.version==='1.0.165'&&r.revision==='r374-official-1.0.165','release identity');
console.log('WEB_R374_TEST_OK');