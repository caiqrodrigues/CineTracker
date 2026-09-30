import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r411.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v411.js'),'utf8'),
 readFile(resolve(dist,'app-v411.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r412-global-recommendation-eligibility.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r412 expected one '+l+', found '+n);return s.replace(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r412 forbidden runtime pattern: '+bad);
for(const need of ['MIN_RUNTIME=40','youtube originals','10766','novela','data-ct411-action="swap"'])if(!runtime.toLowerCase().includes(need.toLowerCase()))throw new Error('r412 runtime missing '+need);

js=js.replaceAll('cinetracker_discover_watch_unseen_v396','cinetracker_discover_watch_unseen_v412');
js=js.replaceAll('cinetracker_discover_fresh_v387','cinetracker_discover_fresh_v412');
js=js.replaceAll('cinetracker_home_series_v406','cinetracker_home_series_v412');

js=once(js,
 "  const list=unwrapRows(value).filter(x=>key(x));",
 "  const rawList=unwrapRows(value).filter(x=>key(x));\n  const list=window.__ctR412Eligibility?await window.__ctR412Eligibility.filterRows(rawList,{limit:24,maxScan:24,requireOriginDetail:false,excludeWwe:true}):rawList;",
 'r411 pool eligibility'
);

js=once(js,
 "  const [p,raw]=await Promise.all([personal319(true),source319(tab,force)]);\n  if(token!==state.loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;\n  return paintPublic319(raw,tab,p);",
 "  const [p,raw]=await Promise.all([personal319(true),source319(tab,force)]);\n  if(token!==state.loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;\n  const personalCandidates=strict319(raw,p,true);\n  const eligibleCandidates=window.__ctR412Eligibility?await window.__ctR412Eligibility.filterRows(personalCandidates,{limit:36,maxScan:80,requireOriginDetail:true,excludeWwe:true}):personalCandidates;\n  if(token!==state.loadToken||routeNow()!=='discover'||String(discover?.tab)!==tab)return false;\n  return paintPublic319(eligibleCandidates,tab,p);",
 'r319 public strict eligibility'
);

js=once(js,
 "window.__ctWebBuild='1.0.202';window.__ctOfficialVersion='1.0.202';",
 "window.__ctWebBuild='1.0.203';window.__ctOfficialVersion='1.0.203';",
 'version'
);
js=once(js,"const REVISION='r411-official-1.0.202';","const REVISION='r412-official-1.0.203';",'revision');
js=once(js,"const version='1.0.202',revision='r411-official-1.0.202';","const version='1.0.203',revision='r412-official-1.0.203';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r412 runtime');

html=html.replaceAll('app-v411.js','app-v412.js').replaceAll('app-v411.css','app-v412.css').replaceAll('v1.0.202','v1.0.203').replaceAll('r411-official-1.0.202','r412-official-1.0.203');
sw=sw.replaceAll('ct-web-1.0.202-r411','ct-web-1.0.203-r412').replaceAll('app-v411.js','app-v412.js').replaceAll('app-v411.css','app-v412.css');
css+='\n/* CineTracker Web 1.0.203 r412 — strict recommendations + complete Pra Voce actions. */\n[data-ct411-foryou] .ct388-slot,[data-ct411-foryou] .ct388-cardwrap{overflow:visible!important}\n[data-ct411-foryou] .ct411-actions{display:grid!important;visibility:visible!important;opacity:1!important;overflow:visible!important;max-height:none!important;min-height:32px!important}\n[data-ct411-foryou] .ct411-action,[data-ct411-foryou] .ct411-action[data-ct411-action="swap"]{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:relative!important;z-index:4!important}\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.203',revision:'r412-official-1.0.203',base:'r411+r412-strict-global-recommendation-eligibility',scope:'recommendation-and-discovery-eligibility',recommendation_rules:'minimum movie/special runtime 40m; YouTube/web-origin blocked; novelas/soap blocked; existing personal/WWE discovery blocks preserved',discover_foryou:'v412 strict server pools + r411 local owner + 7 visible Trocar actions',discover_public:'r319 personal blocklist followed by bounded TMDB detail eligibility and ordered replacement',home:'series authority delegated through cinetracker_home_series_v412; Raw/SmackDown progression preserved',backend:'r412 eligibility helper + strict fresh/watch/home-series RPCs',android:'unchanged-1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v412.js'),js),writeFile(resolve(dist,'app-v412.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v411.js'),{force:true}),rm(resolve(dist,'app-v411.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v412.js'),'utf8');
for(const need of [
 "window.__ctR412Marker='strict-40min-youtube-web-novela+server-v412+7-swap-repair'",
 'cinetracker_discover_watch_unseen_v412','cinetracker_discover_fresh_v412','cinetracker_home_series_v412',
 'window.__ctR412Eligibility.filterRows(personalCandidates'
]){if(!built.includes(need))throw new Error('r412 built missing '+need)}
if(!built.includes('data-ct411-action="swap"'))throw new Error('r412 built missing Trocar action owner');
console.log('WEB_R412_READY strict 40m + YouTube/web + novela exclusion + 7 Trocar actions');
