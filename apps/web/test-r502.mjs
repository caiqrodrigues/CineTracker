import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
await import('./build-r502.mjs');
const [js,css,html,releaseRaw,rootPkgRaw,webPkgRaw]=await Promise.all([
 readFile(resolve('dist/app-v502.js'),'utf8'),readFile(resolve('dist/app-v502.css'),'utf8'),readFile(resolve('dist/index.html'),'utf8'),
 readFile(resolve('dist/release.json'),'utf8'),readFile(resolve('../../package.json'),'utf8'),readFile(resolve('package.json'),'utf8')
]);
const ok=(v,m)=>{if(!v)throw new Error('r502 regression: '+m)},release=JSON.parse(releaseRaw),rootPkg=JSON.parse(rootPkgRaw),webPkg=JSON.parse(webPkgRaw);
ok(rootPkg.version==='0.3.29'&&webPkg.version==='0.3.29','versions');
ok(release.version==='0.3.29'&&release.revision==='r502-official-0.3.29','release');
ok(html.includes('app-v502.js?ct=r502-official-0.3.29')&&html.includes('app-v502.css?ct=r502-official-0.3.29'),'assets');
ok(js.includes("window.__ctR502Marker='home-movies-user-lock+standard-176x264+r501-preserved'"),'marker');
ok(js.includes('userSelected=true;tabRef.current=wanted;tabGeneration++'),'r371 user lock');
ok(js.includes('dataset.ct502HomeKind=wanted'),'canonical tab dataset');
ok(js.includes("if(activeKind()==='series')scheduleHome393('series',false)"),'series late-paint guard');
ok(js.includes("if(activeKind()==='movies')scheduleHome393('movies',false)"),'movies active guard');
ok(css.includes('grid-template-columns:repeat(auto-fill,176px)!important'),'desktop standard grid');
ok(css.includes('width:176px!important')&&css.includes('height:264px!important'),'176x264 cards');
ok(css.includes('@media(max-width:720px)')&&css.includes('aspect-ratio:2/3!important'),'mobile 2:3');
ok(js.includes('topEligible500'),'Top10 r500 preserved');
ok(js.includes('cinetracker_foryou_payload_v498'),'Pra Você r498 preserved');
const tail=js.slice(js.lastIndexOf("window.__ctR502Marker"));
for(const bad of ['window.location.reload(','router.refresh(','while(true)','setInterval('])ok(!tail.includes(bad),'forbidden '+bad);
console.log('WEB_R502_REGRESSION_OK');
