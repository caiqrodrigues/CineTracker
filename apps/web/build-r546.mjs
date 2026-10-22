import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r545.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all(
 ['index.html','app-v545.js','app-v545.css','service-worker.js','release.json','runtime-r546-home-entry.js']
 .map((f,i)=>readFile(resolve(i===5?root:dist,f),'utf8')));
const old='if(homeAnchorKind507===k&&all[k]?.initialDone)return homeAnchorToken393;';
if(js.split(old).length!==2)throw Error('Home guard not unique');
js=js.replace(old,'if(!reset&&homeAnchorKind507===k&&all[k]?.initialDone)return homeAnchorToken393;');
new Function(runtime);
js+='\n'+runtime+'\n';
js=js.replace("const REVISION='r545-official-0.3.72';","const REVISION='r546-official-0.3.73';");
html=html.replaceAll('app-v545.js','app-v546.js').replaceAll('app-v545.css','app-v546.css').replaceAll('r545-official-0.3.72','r546-official-0.3.73').replaceAll('v0.3.72','v0.3.73');
sw=sw.replaceAll('r545','r546').replaceAll('app-v545.js','app-v546.js').replaceAll('app-v545.css','app-v546.css');
css+='\n/* r546: Home entry scroll only, history remains accessible above. */\n';
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.73',revision:'r546-official-0.3.73',scope:'Web Home entry only; Android untouched',home_landing:'Series enters at Continue, Movies at Watchlist; History remains above'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v546.js'),js),writeFile(resolve(dist,'app-v546.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v545.js'),{force:true}),rm(resolve(dist,'app-v545.css'),{force:true})]);
console.log('WEB_R546_READY');