import {readFile,writeFile,rm,rename} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r548.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,wweGuard,homeGuard,authResume]=await Promise.all([
 'index.html','app-v548.js','app-v548.css','service-worker.js','release.json',
 'runtime-r549-wwe-final-owner.js','runtime-r549-home-render-guard.js','runtime-r549-home-auth-resume.js'
].map((file,index)=>readFile(resolve(index>4?root:dist,file),'utf8')));

function insertOnce(anchor,content,label){
 if(js.split(anchor).length!==2)throw new Error(label+' anchor must occur once');
 js=js.replace(anchor,content+'\n'+anchor);
}
// r171/r174/r181 overwrote r548's early WWE hook. Override only after all of them.
insertOnce('window.__ctCoreR471=Object.freeze({',wweGuard,'r549 last WWE owner');
// The visible Home renderer owns series404, not the legacy hSeries array.
insertOnce('function renderSeries404(){',homeGuard,'r549 Home visible owner');
js=js.replace('function renderSeries404(){','function renderSeries404(){\n ct549ApplyReleasedToVisibleHome();');
new Function(authResume);
js+='\n'+authResume+'\n';
const oldRevision="const REVISION='r548-official-0.3.75';";
if(js.split(oldRevision).length!==2)throw new Error('r549 revision anchor must occur once');
js=js.replace(oldRevision,"const REVISION='r549-official-0.3.76';");
html=html.replaceAll('app-v548.js','app-v549.js').replaceAll('app-v548.css','app-v549.css')
 .replaceAll('r548-official-0.3.75','r549-official-0.3.76').replaceAll('v0.3.75','v0.3.76');
sw=sw.replaceAll('r548','r549').replaceAll('app-v548.js','app-v549.js').replaceAll('app-v548.css','app-v549.css');
css+='\n/* r549: only Web WWE season loading and new-release Home reconciliation. */\n';
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'0.3.76',revision:'r549-official-0.3.76',scope:'Web only; Android unchanged',
 home_series:'Reconciles premiered episodes into the final r404 Home state and retries after session hydration',
 wwe_drawer:'Final r171/r174/r181-safe toggle, full-season watched history and visible-season lazy fetches'});
new Function(js);
await Promise.all([
 writeFile(resolve(dist,'app-v549.js'),js),writeFile(resolve(dist,'app-v549.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release-r549.tmp.json'),JSON.stringify(release,null,2))
]);
await rename(resolve(dist,'release-r549.tmp.json'),resolve(dist,'release.json'));
if(JSON.parse(await readFile(resolve(dist,'release.json'),'utf8')).revision!=='r549-official-0.3.76')
 throw new Error('r549 release.json did not persist');
await Promise.all([rm(resolve(dist,'app-v548.js'),{force:true}),rm(resolve(dist,'app-v548.css'),{force:true})]);
console.log('WEB_R549_READY final WWE owner and authenticated Home release reconciliation; Android unchanged');
