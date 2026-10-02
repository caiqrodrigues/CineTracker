import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r444.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v444.js'),'utf8'),
 readFile(resolve(dist,'app-v444.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);
const runtime="/* CineTracker Web 1.0.236 r445 — Descobrir > Pra Você: single-flight, no page re-entry. */\n(()=>{'use strict';\nif(window.__ctR445?.version==='1.0.236')return;\nconst isFY=()=>{try{return String(typeof route==='function'?route():'')==='discover'&&String(window.__ctR288R263?.discover263?.tab||'')==='foryou'}catch{return false}};\nconst api=window.__ctR309;\nif(!api||typeof api.buildForYou!=='function')return;\nconst original=api.buildForYou.bind(api);\nlet inFlight=null,lastAt=0,lastResult=false;\nconst buildForYou=async(force=false)=>{\n if(!isFY())return false;\n if(inFlight)return inFlight;\n if(!force&&lastAt>0&&Date.now()-lastAt<15000)return lastResult;\n inFlight=Promise.resolve().then(()=>original(!!force)).then(v=>{lastAt=Date.now();lastResult=!!v;return !!v}).catch(()=>false).finally(()=>{inFlight=null});\n return inFlight;\n};\napi.buildForYou=buildForYou;\nif(window.__ctR309Api)window.__ctR309Api.buildForYou=buildForYou;\nconst cleanRefreshQuery=()=>{\n try{\n  const u=new URL(location.href);\n  if(!u.searchParams.has('ct_refresh'))return;\n  u.searchParams.delete('ct_refresh');\n  history.replaceState(history.state,'',u.pathname+(u.search?u.search:'')+(u.hash||''));\n }catch{}\n};\ncleanRefreshQuery();\nwindow.__ctR445={version:'1.0.236',scope:'discover-foryou-only',singleFlight:true,automaticReentryBlocked:true,buildForYou};\n})();";
const anchor='</body>';
if(!html.includes(anchor))throw new Error('r445 html anchor missing');
html=html.replace(anchor,'<script>'+runtime.replace(/<\\/script/gi,'<\\/script')+'</script>'+anchor);
js+='\n'+runtime+'\n';
html=html.replaceAll('app-v444.js','app-v445.js').replaceAll('app-v444.css','app-v445.css');
sw=sw.replaceAll('app-v444.js','app-v445.js').replaceAll('app-v444.css','app-v445.css').replaceAll('ct-web-1.0.235-r444','ct-web-1.0.236-r445');
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'1.0.236',revision:'r445-official-1.0.236',base:'r444+foryou-single-flight',scope:'discover-foryou-only',discover_foryou:'r309 remains sole renderer; r445 serializes buildForYou calls and blocks automatic re-entry for 15 seconds',discover_actions:'Watchlist/Visto/Trocar remain owned by r309',page_reload:false,ct_refresh_query:'removed with history.replaceState without reload',home:'unchanged-r444',profile:'unchanged-r444',sports:'unchanged-r444',android:'unchanged'});
await Promise.all([
 writeFile(resolve(dist,'app-v445.js'),js),
 writeFile(resolve(dist,'app-v445.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v444.js'),{force:true}),rm(resolve(dist,'app-v444.css'),{force:true})]);
for(const bad of ['window.location.reload(','router.refresh(','setInterval(','while(true)'])if(js.includes(bad))throw new Error('r445 forbidden '+bad);
if(!js.includes('window.__ctR445={version:\'1.0.236\''))throw new Error('r445 runtime missing');
if(!js.includes('singleFlight:true'))throw new Error('r445 single-flight missing');
if(!js.includes('ct_refresh'))throw new Error('r445 refresh-query guard missing');
console.log('WEB_R445_READY');