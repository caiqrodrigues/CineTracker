import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r432.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v432.js'),'utf8'),
 readFile(resolve(dist,'app-v432.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

const stale="const R=window.__ctR288R263||{}, M=window.__ctR295Test||{}, S=window.__ctR296Test||{}, T300=window.__ctR300Test||{};\nconst discover=R.discover263;";
const dynamic="const dynamicProxy=name=>new Proxy({}, {get(_t,p){try{return window[name]?.[p]}catch{return undefined}},set(_t,p,v){try{if(window[name])window[name][p]=v}catch{}return true}});\nconst R=dynamicProxy('__ctR288R263'), M=dynamicProxy('__ctR295Test'), S=dynamicProxy('__ctR296Test'), T300=dynamicProxy('__ctR300Test');\nconst discover=dynamicProxy('__ctR288R263.discover263');";
if(!js.includes(stale))throw new Error('r433 stale r309 boot capture not found');
js=js.replace(stale,dynamic);

js=js.replaceAll('1.0.223','1.0.224').replaceAll('r432-official-1.0.223','r433-official-1.0.224');
html=html.replaceAll('app-v432.js','app-v433.js').replaceAll('app-v432.css','app-v433.css').replaceAll('v1.0.223','v1.0.224').replaceAll('r432-official-1.0.223','r433-official-1.0.224');
sw=sw.replaceAll('ct-web-1.0.223-r432','ct-web-1.0.224-r433').replaceAll('app-v432.js','app-v433.js').replaceAll('app-v432.css','app-v433.css');
css+='\n/* CineTracker Web 1.0.224 r433 — Pra Você boot-state fix. */\n';

const prev=JSON.parse(releaseRaw);
const release={...prev,version:'1.0.224',revision:'r433-official-1.0.224',base:'r432+dynamic-discover-state',scope:'discover-foryou-only',discover_foryou:'r309 reads Discover state dynamically after boot',discover_actions:'Watchlist/Visto/Trocar owned by r309',black_screen_fix:'r309 no longer captures discover263 before boot',home:'unchanged',profile:'unchanged',sports:'unchanged',android:'unchanged'};
js+="\nwindow.__ctR433Marker='foryou-dynamic-discover-state';\n";

await Promise.all([
 writeFile(resolve(dist,'app-v433.js'),js),
 writeFile(resolve(dist,'app-v433.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v432.js'),{force:true}),rm(resolve(dist,'app-v432.css'),{force:true})]);

if(js.includes("const discover=R.discover263;"))throw new Error('r433 static discover capture survived');
if(!js.includes("dynamicProxy('__ctR288R263.discover263')"))throw new Error('r433 dynamic discover proxy missing');
if(!js.includes("window.__ctR433Marker='foryou-dynamic-discover-state'"))throw new Error('r433 marker missing');
if(js.includes('location.reload(')||js.includes('router.refresh('))throw new Error('r433 forbidden page refresh survived');
console.log('WEB_R433_READY');
