import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r542.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v542.js'),'utf8'),
 readFile(resolve(dist,'app-v542.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
function uniqueReplace(source,previous,next,label){
 const n=source.split(previous).length-1;
 if(n!==1)throw new Error(label+': expected unique anchor, found '+n);
 return source.replace(previous,next);
}
// Root cause of Web WWE not synchronizing: runtime-r542 expects
// window.__ctCoreR471.edge; r471 closure bridge only exported rpc.
// Expose the EXISTING authenticated edge helper, not a new unauthenticated
// fetch, and preserve every unrelated r541 behavior byte-for-byte.
const coreAt=js.indexOf('window.__ctCoreR471=Object.freeze({');
if(coreAt<0||js.indexOf('window.__ctCoreR471=Object.freeze({',coreAt+1)>=0)
 throw new Error('r471 core declaration absent or ambiguous');
const near=js.slice(coreAt,coreAt+2600);
const rpcMethod='rpc:(name,args={})=>rpc(name,args),';
if(!near.includes(rpcMethod))throw new Error('r471 authenticated RPC method not in expected core declaration: '+near.slice(0,380));
const fixed=near.replace(rpcMethod,
 'edge:(name,body={},timeout=18000)=>edge(name,body,timeout),\\n rpc:(name,args={})=>rpc(name,args),');
js=js.slice(0,coreAt)+fixed+js.slice(coreAt+near.length);
js=uniqueReplace(js,"const REVISION='r542-official-0.3.69';","const REVISION='r543-official-0.3.70';",'Web version');
js=js.replaceAll("version:'0.3.69',scope:'WWE-recent-episodes-only'","version:'0.3.70',scope:'WWE-recent-episodes-only'");
html=html.replaceAll('app-v542.js','app-v543.js').replaceAll('app-v542.css','app-v543.css')
 .replaceAll('r542-official-0.3.69','r543-official-0.3.70')
 .replaceAll('v0.3.69','v0.3.70');
css+='\n/* r543: existing r542 Home UI preserved, authenticated Edge bridge fixed. */\n';
sw=sw.replaceAll('r542','r543').replaceAll('app-v542.js','app-v543.js').replaceAll('app-v542.css','app-v543.css');
const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.70',revision:'r543-official-0.3.70',
 base:'r542 + authenticated existing Edge bridge for WWE updates',
 scope:'Raw and SmackDown synchronization only; all other Web UI frozen at r541',
 wwe:'r542 Home runtime can invoke the authenticated ct-wwe-tv-refresh Edge Function; recent episodes update Home rows in place without page refresh',
 preserved:'r541 UI, Profile, Descobrir, sports, UFC, F1 and all other Home behavior'
});
new Function(js);
if(!js.includes("edge:(name,body={},timeout=18000)=>edge(name,body,timeout),"))
 throw new Error('Authenticated r543 Edge bridge missing');
await Promise.all([
 writeFile(resolve(dist,'app-v543.js'),js),
 writeFile(resolve(dist,'app-v543.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v542.js'),{force:true}),rm(resolve(dist,'app-v542.css'),{force:true})]);
console.log('WEB_R543_READY original authenticated edge() now exported to WWE Home sync; r541 UI preserved, no reload');
