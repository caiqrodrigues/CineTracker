import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r364.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v364.js'),'utf8'),
 readFile(resolve(dist,'app-v364.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r365-discover-speed-foryou-actions.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r365 expected one '+l+', found '+n);return s.replace(a,b)};

for(const x of[
 "window.__ctWebBuild='1.0.155';window.__ctOfficialVersion='1.0.155';",
 "const REVISION='r364-official-1.0.155';",
 "const version='1.0.155',revision='r364-official-1.0.155';",
 "window.__ctR364Marker='foryou-single-click-owner+legacy-observers-retired+no-freeze'",
 "Date.now()-personal.at<5000",
 "[personal319(true),source319(tab,force)]",
 "[personal319(true),topRaw319(provider,force)]",
 "function prefetch319(){if(routeNow()!=='discover')return;for(const t of STRICT)void source319(t,false)}",
 "personalTask=null;sourceCache.clear();topCache.clear();",
 "if(STRICT.has(t))void loadPublic319(t,true);",
 "else if(t==='top10')void loadTop319(true);",
 "boot();"
])if(!js.includes(x))throw new Error('r365 missing '+x);
for(const x of[
 "window.__ctR365Marker='discover-warm-authority+foryou-direct-local-actions'",
 "const tx=mutate(m.action,m.key,m.name)",
 "persistDirect(m.action,m.key)",
 "window.__ctR358Early=early"
])if(!runtime.includes(x))throw new Error('r365 runtime missing '+x);

js=once(js,"Date.now()-personal.at<5000","Date.now()-personal.at<300000",'personal cache ttl');
js=once(js,"[personal319(true),source319(tab,force)]","[personal319(!!force),source319(tab,force)]",'public personal reuse');
js=once(js,"[personal319(true),topRaw319(provider,force)]","[personal319(!!force),topRaw319(provider,force)]",'top10 personal reuse');
js=once(js,"function prefetch319(){if(routeNow()!=='discover')return;for(const t of STRICT)void source319(t,false)}","function prefetch319(){if(routeNow()!=='discover')return;void personal319(false);for(const t of STRICT)void source319(t,false)}",'discover authority prefetch');
js=once(js,"personalTask=null;sourceCache.clear();topCache.clear();","personalTask=null;/* r365: keep public TMDB/provider source caches warm; personal filter is invalidated above */",'data changed source cache');
js=once(js,"if(STRICT.has(t))void loadPublic319(t,true);","if(STRICT.has(t))void loadPublic319(t,false);",'data changed public reload');
js=once(js,"else if(t==='top10')void loadTop319(true);","else if(t==='top10')void loadTop319(false);",'data changed top reload');

js=once(js,"window.__ctWebBuild='1.0.155';window.__ctOfficialVersion='1.0.155';","window.__ctWebBuild='1.0.156';window.__ctOfficialVersion='1.0.156';",'version');
js=once(js,"const REVISION='r364-official-1.0.155';","const REVISION='r365-official-1.0.156';",'revision');
js=once(js,"const version='1.0.155',revision='r364-official-1.0.155';","const version='1.0.156',revision='r365-official-1.0.156';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');

html=html.replaceAll('app-v364.js','app-v365.js').replaceAll('app-v364.css','app-v365.css').replaceAll('v1.0.155','v1.0.156').replaceAll('r364-official-1.0.155','r365-official-1.0.156');
sw=sw.replaceAll('ct-web-1.0.155-r364','ct-web-1.0.156-r365').replaceAll('app-v364.js','app-v365.js').replaceAll('app-v364.css','app-v365.css');
css+='\n/* CineTracker Web 1.0.156 r365 — warm Discover authority cache; direct local Pra Você actions. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.156',revision:'r365-official-1.0.156',base:'r364-production',
 scope:'discover-speed+foryou-action-correctness-only',
 discover_personal_cache:'5min+immediate-invalidate-on-data-change',
 discover_public_sources:'keep-warm-across-personal-data-change',
 discover_tab_loading:'cached-source+cached-authority-first',
 discover_prefetch:'authority+public-source-background-warm',
 discover_foryou_click_owner:'r365-direct-local-owner',
 discover_foryou_actions:'clicked-slot-immediate+direct-background-persist+targeted-refill',
 discover_foryou_reload:'forbidden-no-renderDiscover-no-loadForYou-no-global-cache-clear',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r365 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v365.js'),js),writeFile(resolve(dist,'app-v365.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v364.js'),{force:true}),rm(resolve(dist,'app-v364.css'),{force:true})]);
console.log('WEB_R365_READY fast Discover tabs + direct local Pra Você actions');
