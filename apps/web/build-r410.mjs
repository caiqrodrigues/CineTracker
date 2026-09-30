import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r409.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v409.js'),'utf8'),
 readFile(resolve(dist,'app-v409.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r410-discover-foryou-owner.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r410 expected one '+l+', found '+n);return s.replace(a,b)};
const every=(s,a,b,l)=>{const n=s.split(a).length-1;if(n<1)throw new Error('r410 expected at least one '+l+', found '+n);return s.replaceAll(a,b)};
new Function(runtime);
for(const bad of ['new MutationObserver','setInterval(','while(true)','window.location.reload(','router.refresh('])if(runtime.includes(bad))throw new Error('r410 forbidden runtime pattern: '+bad);

js=every(js,
 "async function buildForYou(force=false){\n if(!discover||routeNow()!=='discover')return false;",
 "async function buildForYou(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);\n if(!discover||routeNow()!=='discover')return false;",
 'r309 buildForYou local closure'
);
js=every(js,
 "function paintForYou(){\n const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
 "function paintForYou(){\n if(window.__ctR410?.renderForYou)return window.__ctR410.renderForYou();\n const h=host();if(!h||routeNow()!=='discover'||String(discover?.tab)!=='foryou')return false;",
 'r309 paintForYou local closure'
);
js=every(js,
 "async function loadForYou319(force=false){\n loading319('Montando recomendações…');",
 "async function loadForYou319(force=false){\n if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);\n loading319('Montando recomendações…');",
 'r319 loadForYou local closure'
);
js=every(js,
 "if(t==='foryou')return loadForYou319(force);",
 "if(t==='foryou')return window.__ctR410?.loadForYou?window.__ctR410.loadForYou(force):loadForYou319(force);",
 'r319 loadDiscover foryou delegation'
);
js=every(js,
 "paintForYou263=function(){\n const host=discoverHost263(),d=discover263.forYou;if(!host||!d)return;",
 "paintForYou263=function(){\n if(window.__ctR410?.renderForYou)return window.__ctR410.renderForYou();\n const host=discoverHost263(),d=discover263.forYou;if(!host||!d)return;",
 'r288 paintForYou local closure'
);
js=once(js,
 "'<button type=\"button\" data-ct409-action=\"'+a+'\" data-ct409-slot=\"'+name+'\">'+l+'</button>'",
 "'<button type=\"button\" class=\"chip ct410-action\" aria-disabled=\"false\" data-ct409-action=\"'+a+'\" data-ct409-slot=\"'+name+'\">'+l+'</button>'",
 'r409 active action styling'
);
js=once(js,
 "window.__ctWebBuild='1.0.200';window.__ctOfficialVersion='1.0.200';",
 "window.__ctWebBuild='1.0.201';window.__ctOfficialVersion='1.0.201';",
 'version'
);
js=once(js,"const REVISION='r409-official-1.0.200';","const REVISION='r410-official-1.0.201';",'revision');
js=once(js,"const version='1.0.200',revision='r409-official-1.0.200';","const version='1.0.201',revision='r410-official-1.0.201';",'footer');
js=once(js,'boot();',runtime+'\nboot();','r410 runtime');

html=html.replaceAll('app-v409.js','app-v410.js').replaceAll('app-v409.css','app-v410.css').replaceAll('v1.0.200','v1.0.201').replaceAll('r409-official-1.0.200','r410-official-1.0.201');
sw=sw.replaceAll('ct-web-1.0.200-r409','ct-web-1.0.201-r410').replaceAll('app-v409.js','app-v410.js').replaceAll('app-v409.css','app-v410.css');
css+='\n/* CineTracker Web 1.0.201 r410 — Descobrir > Pra Você only. */\n[data-ct410-foryou] .ct410-action{display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;opacity:1!important;cursor:pointer!important;min-width:0!important;width:100%!important;white-space:nowrap!important}\n[data-ct410-foryou] .ct410-action[aria-disabled="false"]{pointer-events:auto!important;opacity:1!important}\n';

const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.201',revision:'r410-official-1.0.201',base:'r409+r410-discover-foryou-authority',scope:'discover-foryou-only',discover_foryou:'r319 and r309 local closures delegate before legacy build/paint; r409 v396 payload remains canonical',discover_actions:'daily/fresh Watchlist+Visto+Trocar; watch Visto+Trocar; active chip buttons; local optimistic actions',home:'unchanged-r409',profile:'untouched',sports:'untouched',top10:'untouched',settings:'untouched',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v410.js'),js),writeFile(resolve(dist,'app-v410.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v409.js'),{force:true}),rm(resolve(dist,'app-v409.css'),{force:true})]);
const built=await readFile(resolve(dist,'app-v410.js'),'utf8');
for(const need of [
 "window.__ctR410Marker='r319-local-closure+legacy-painter-block+active-complete-actions'",
 "if(window.__ctR410?.loadForYou)return window.__ctR410.loadForYou(force);",
 "if(window.__ctR410?.renderForYou)return window.__ctR410.renderForYou();",
 "class=\"chip ct410-action\"",
 "cinetracker_discover_foryou_v396",
 "↻ Trocar"
])if(!built.includes(need))throw new Error('r410 missing '+need);
console.log('WEB_R410_READY discover Pra Voce local closure owner + active complete actions');