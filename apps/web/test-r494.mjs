import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r494.mjs');

const [html,js,css,releaseRaw,sourceIndex,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/app-v494.js'),'utf8'),
 readFile(resolve('dist/app-v494.css'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),
 readFile(resolve('index.html'),'utf8'),
 readFile(resolve('../../package.json'),'utf8'),
 readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r494 regression: '+m)};
const release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);

ok(rootPkg.version==='0.3.21'&&webPkg.version==='0.3.21','versions');
ok(release.version==='0.3.21'&&release.revision==='r494-official-0.3.21','release');
ok(html.includes('/app-v494.css?ct=r494-official-0.3.21'),'css asset');
ok(html.includes('/app-v494.js?ct=r494-official-0.3.21'),'js asset');
ok(!/<style[\s>]/i.test(html),'dist inline style absent');
ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(html),'dist inline script absent');
ok(!/<style[\s>]/i.test(sourceIndex),'source inline style absent');
ok(!/<script(?![^>]*\bsrc=)[^>]*>/i.test(sourceIndex),'source inline script absent');
for(const bad of ['--gold:#d6b55b','MENU DIÁRIO','auth-page','cloud-bar','void bootstrap();']){
 ok(!html.includes(bad),'dist old token '+bad);
 ok(!sourceIndex.includes(bad),'source old token '+bad);
}
ok(css.includes('--gold:#58afe0!important'),'modern blue palette');
ok(js.includes("window.__ctR494Marker='clean-entrypoint+no-legacy-inline+modern-blue-shell'"),'r494 marker');
ok(js.includes("window.__ctR493Marker='direct-home-progressive+profile-split-fast+top10-progressive+foryou-snapshot+strict-12'"),'r493 preserved');
ok(js.includes("if(r==='home')return renderHome493(seq);"),'Home preserved');
ok(js.includes("if(r==='profile')return renderProfile493(seq);"),'Profile preserved');
console.log('WEB_R494_REGRESSION_OK clean entrypoint');
