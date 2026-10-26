import {readFile,writeFile,rm,rename} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r547.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,homeRuntime,drawerRuntime]=await Promise.all([
 'index.html','app-v547.js','app-v547.css','service-worker.js','release.json',
 'runtime-r548-web-home-premieres.js','runtime-r548-wwe-drawer-hook.js'
].map((file,index)=>readFile(resolve(index>4?root:dist,file),'utf8')));

const drawerAnchor='/* ---------- render de detalhes inspirado no layout pedido ---------- */';
if(js.split(drawerAnchor).length!==2)throw new Error('r548 WWE season drawer anchor must be unique');
if(js.includes('window.__ctR548WweDetail='))throw new Error('r548 drawer already installed');
js=js.replace(drawerAnchor,drawerRuntime+'\n'+drawerAnchor);
new Function(homeRuntime);
js+='\n'+homeRuntime+'\n';
const version="const REVISION='r547-official-0.3.74';";
if(js.split(version).length!==2)throw new Error('r548 revision anchor must be unique');
js=js.replace(version,"const REVISION='r548-official-0.3.75';");
html=html.replaceAll('app-v547.js','app-v548.js').replaceAll('app-v547.css','app-v548.css')
 .replaceAll('r547-official-0.3.74','r548-official-0.3.75').replaceAll('v0.3.74','v0.3.75');
sw=sw.replaceAll('r547','r548').replaceAll('app-v547.js','app-v548.js').replaceAll('app-v547.css','app-v548.css');
css+='\n/* r548: only WWE drawer episode states; the rest of Web presentation is unchanged. */\n';
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'0.3.75',revision:'r548-official-0.3.75',scope:'Web only: Raw, SmackDown and Lupin Home; WWE season drawer; Android unchanged',home_series:'Recent aired unwatched WWE events and Netflix Lupin Part 4 (2026-10-23) reactivate Continue without resetting 30-day dust for other series',wwe_drawer:'Raw/SmackDown season fetch with bounded watch state, lazily loaded season score graphs and reversible optimistic watched buttons'});
new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v548.js'),js),writeFile(resolve(dist,'app-v548.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release-r548.tmp.json'),JSON.stringify(release,null,2))
]);
await rename(resolve(dist,'release-r548.tmp.json'),resolve(dist,'release.json'));
if(JSON.parse(await readFile(resolve(dist,'release.json'),'utf8')).revision!=='r548-official-0.3.75')
 throw new Error('r548 release.json did not persist');
await Promise.all([rm(resolve(dist,'app-v547.js'),{force:true}),rm(resolve(dist,'app-v547.css'),{force:true})]);
console.log('WEB_R548_READY Home Raw/SmackDown/Lupin; WWE season drawer; Android unchanged');
