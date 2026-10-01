import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r421.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v421.js'),'utf8'),
 readFile(resolve(dist,'app-v421.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r422-audit-performance.js'),'utf8')
]);
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r422 forbidden runtime '+bad);
for(const need of ['window.__ctR422Marker','cinetracker_shown_recommendations_recent_v296','cinetracker_shown_recommendations_record_v296','pureDramaDocumentary','scoreOf','yearOf','syncProfileCollapse'])if(!runtime.includes(need))throw new Error('r422 runtime missing '+need);

const removeKnown=(needle,label)=>{
 const n=js.split(needle).length-1;
 if(n)js=js.replaceAll(needle,'');
 return n;
};
const observerCountBefore=(js.match(/new MutationObserver/g)||[]).length;
const observers=[
 ["const ct244Observer=new MutationObserver(ct244Schedule);\nct244Observer.observe(document.documentElement,{childList:true,subtree:true});",'r244 document observer'],
 ["try{new MutationObserver(queue237).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}",'r237 app observer'],
 ["try{new MutationObserver(()=>queue246(false,35)).observe(q('#app')||document.documentElement,{subtree:true,childList:true})}catch{}",'r246 app observer'],
 ["try{\n const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(routeNow()==='discover'&&String(discover?.tab)==='foryou')requestAnimationFrame(applyForYouFilter319)}).observe(app,{subtree:true,childList:true});\n}catch{}",'r319 app observer'],
 ["try{\n const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(['profile','perfil'].includes(routeNow()))requestAnimationFrame(decorateProfile316);if(['sports','esportes'].includes(routeNow()))requestAnimationFrame(normalizeF1316)}).observe(app,{subtree:true,childList:true,characterData:true});\n}catch{}",'r316 app observer'],
 ["try{\n const app=q('#app');if(app&&window.MutationObserver)new MutationObserver(()=>{if(['profile','perfil'].includes(routeNow()))requestAnimationFrame(sync317)}).observe(app,{subtree:true,childList:true,characterData:true});\n}catch{}",'r317 app observer']
];
for(const [needle,label] of observers)removeKnown(needle,label);
removeKnown("document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue246(true,0)});",'r246 visibility refetch');
removeKnown("window.addEventListener('online',()=>{if(isForYou())void loadForYou(true)});",'r411 online force reload');

const schedulerNames=['scheduleForYouRepair','scheduleForYou','scheduleRepair','scheduleFY','scheduleForYou417','scheduleFY418','scheduleDiscover420','scheduleForYouSanitize421'];
for(const name of schedulerNames){
 const re=new RegExp('function '+name+'\\([^\\n]*\\)\\{[^\\n]*\\}','g');
 const before=(js.match(re)||[]).length;
 if(before)js=js.replace(re,"function "+name+"(){try{window.__ctR422?.scheduleRoute?.('legacy-repair',60)}catch{}}");
}

const r411Action="const a=t.closest('[data-ct411-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();act(String(a.dataset.ct411Action||''),String(a.dataset.ct411Slot||''));return}";
if(!js.includes(r411Action))throw new Error('r422 r411 action capture missing');
js=js.replace(r411Action,"const a=t.closest('[data-ct411-action]');if(a){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const action=String(a.dataset.ct411Action||''),slot=String(a.dataset.ct411Slot||'');if(action==='swap')void window.__ctR422?.swapForYou?.(slot);else act(action,slot);return}");

const poolLimit="rpcCall(name,{p_kind:type,p_limit:24})";
if(!js.includes(poolLimit))throw new Error('r422 r411 pool limit missing');
js=js.replace(poolLimit,"rpcCall(name,{p_kind:type,p_limit:48})");

const topLine="const movies=strict319(raw.movies,p,false).slice(0,10),series=strict319(raw.series,p,false).slice(0,10);";
if(!js.includes(topLine))throw new Error('r422 Top10 selection missing');
js=js.replace(topLine,"const [movies,series]=window.__ctR422Eligibility?await Promise.all([window.__ctR422Eligibility.filterRows(strict319(raw.movies,p,false),{limit:10,maxScan:40,requireOriginDetail:true,excludeWwe:true}),window.__ctR422Eligibility.filterRows(strict319(raw.series,p,false),{limit:10,maxScan:40,requireOriginDetail:true,excludeWwe:true})]):[strict319(raw.movies,p,false).slice(0,10),strict319(raw.series,p,false).slice(0,10)];");

const f1Old="const f1=t.closest('[data-ct311-f1-watch]');if(f1){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void toggleF1418(f1);return}";
if(js.includes(f1Old))js=js.replace(f1Old,"const f1=t.closest('[data-ct311-f1-watch]');if(f1){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();void window.__ctR421?.toggleF1?.(f1);return}");

js=js.replace("window.__ctWebBuild='1.0.212';window.__ctOfficialVersion='1.0.212';","window.__ctWebBuild='1.0.213';window.__ctOfficialVersion='1.0.213';")
     .replace("const REVISION='r421-official-1.0.212';","const REVISION='r422-official-1.0.213';")
     .replace("const version='1.0.212',revision='r421-official-1.0.212';","const version='1.0.213',revision='r422-official-1.0.213';")
     .replace('boot();',runtime+'\nboot();');

html=html.replaceAll('app-v421.js','app-v422.js').replaceAll('app-v421.css','app-v422.css').replaceAll('v1.0.212','v1.0.213').replaceAll('r421-official-1.0.212','r422-official-1.0.213');
sw=sw.replaceAll('ct-web-1.0.212-r421','ct-web-1.0.213-r422').replaceAll('app-v421.js','app-v422.js').replaceAll('app-v421.css','app-v422.css');
css+='\n/* CineTracker Web 1.0.213 r422 — scoped polish only. */\nhtml,body{max-width:100%;overflow-x:hidden!important}\n.ct288-card,.ct291-card,[data-profile] .card,[data-detail] .card{transition:box-shadow .3s ease!important}\n.ct288-card:hover,.ct291-card:hover,[data-profile] .card:hover,[data-detail] .card:hover{box-shadow:0 12px 32px rgba(0,0,0,.8)}\n.ct246-local-track,.ct-r244-horizontal-scroll,[data-page="profile"] [data-profile] .panel>.row{scrollbar-width:thin!important;touch-action:pan-x pan-y!important;overscroll-behavior-x:contain!important}\n.ct246-local-track::-webkit-scrollbar,.ct-r244-horizontal-scroll::-webkit-scrollbar,[data-page="profile"] [data-profile] .panel>.row::-webkit-scrollbar{height:4px!important}.ct246-local-track::-webkit-scrollbar-thumb,.ct-r244-horizontal-scroll::-webkit-scrollbar-thumb,[data-page="profile"] [data-profile] .panel>.row::-webkit-scrollbar-thumb{border-radius:999px!important;background:rgba(135,165,180,.42)!important}\n[data-profile] .ct237-profile-stats,[data-profile] .ct317-profile-stats{grid-template-columns:repeat(4,minmax(0,1fr))!important}\n[data-profile] .stat b,[data-profile] .stat strong,[data-profile] .stat .value,[data-profile] .stat-value{font-variant-numeric:tabular-nums!important}\n[data-ct411-foryou] .ct411-actions{display:grid!important;gap:5px!important;width:100%!important}[data-ct411-foryou] .ct411-actions.three{grid-template-columns:repeat(3,minmax(0,1fr))!important}[data-ct411-foryou] .ct411-actions.two{grid-template-columns:repeat(2,minmax(0,1fr))!important}[data-ct411-foryou] [data-ct411-action]{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;align-items:center!important;justify-content:center!important;min-width:0!important;white-space:nowrap!important}\n';

const remainingObservers=(js.match(/new MutationObserver/g)||[]).length;
if(remainingObservers>=observerCountBefore)throw new Error('r422 did not retire any proven redundant global observer');
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.213',revision:'r422-official-1.0.213',base:'r421+r422-audit-performance',scope:'stability-audit+strict-discover-rules+persisted-7d-foryou+profile-unified-collapse',stability:'redundant global MutationObservers and inherited Pra Voce repair fan-out removed; foreground recovery is coalesced and finite',discover:'existing short/youtube/soap/reality/standup/WWE/personal filters preserved; active eligibility also requires TMDB >=7.5, year >1990 and rejects pure Drama/Documentary',discover_foryou:'existing r411 renderer stays authoritative; persisted existing r296 seven-day history is reused; Trocar changes one slot and keeps native action rows',profile:'existing metrics/order preserved; existing statistics toggle also controls the sports statistics panel; tabular numeric rendering',f1:'existing r421 series-only media_id 865 authority preserved; stale r418 capture delegates to r421 writer',android:'unchanged-1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v422.js'),js),writeFile(resolve(dist,'app-v422.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v421.js'),{force:true}),rm(resolve(dist,'app-v421.css'),{force:true})]);
console.log('WEB_R422_READY observers=0');
