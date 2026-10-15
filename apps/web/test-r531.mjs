import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';
await import('./build-r531.mjs');
const [js,css,html,relRaw,rootRaw,webRaw]=await Promise.all([
 readFile(resolve('dist/app-v531.js'),'utf8'),readFile(resolve('dist/app-v531.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r531 regression: '+m)},rel=JSON.parse(relRaw),rp=JSON.parse(rootRaw),wp=JSON.parse(webRaw);
ok(rp.version==='0.3.58'&&wp.version==='0.3.58','versions');ok(rel.version==='0.3.58'&&rel.revision==='r531-official-0.3.58','release');
ok(html.includes('app-v531.js')&&html.includes('app-v531.css'),'assets');
ok(js.includes("window.__ctR531Marker='special-real-screen+related-spa+opaque-home-chrome'"),'marker');
ok(js.includes("navigate:(path,replace=false)=>{go(String(path||'/home'),!!replace);return true}"),'SPA navigation bridge');
ok(js.includes("const nav=window.__ctCoreR471?.navigate"),'related bridge');
ok(js.includes("for(let attempt=0;attempt<24;attempt++)")&&js.includes("screen=window.__ctR513SeriesScreen"),'bounded real screen wait');
ok(js.includes("window.__ctR513SeriesScreenMarker='r520-three-special-series-full-screen-owner'"),'real special owner retained');
ok(css.includes('[data-ct531-home-shield]')&&css.includes('background:#030a0f!important')&&css.includes('z-index:204!important'),'opaque Home shield');
const tail=js.slice(js.lastIndexOf('/* CineTracker Web 0.3.58 r531'));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval(','new MutationObserver'])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R531_REGRESSION_OK');
