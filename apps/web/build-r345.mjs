import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r344.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v344.js'),'utf8'),
 readFile(resolve(dist,'app-v344.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r345-foryou-back-filters.js'),'utf8')
]);
const must=(s,x)=>{if(!s.includes(x))throw new Error('r345 missing '+x)};
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r345 expected one '+l+', found '+n);return s.replace(a,b)};
const range=(s,start,end,next,l)=>{const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0||b<=a)throw new Error('r345 range '+l+' missing');return s.slice(0,a)+next+'\n'+s.slice(b)};

for(const x of[
 "window.__ctWebBuild='1.0.135';window.__ctOfficialVersion='1.0.135';",
 "const REVISION='r344-official-1.0.135';",
 "const version='1.0.135',revision='r344-official-1.0.135';",
 "window.__ctR344Marker='foryou-primary-genre+canonical-actions+top10-ten-up'",
 "function lockRow342(row){",
 "function ct169InjectBack(){",
 "boot();"
])must(js,x);
for(const x of[
 "window.__ctR345Marker='foryou-grid-actions+icon-back-in-search-row+filters-removed'",
 "normalizeForYou345",
 "ct345-back-icon",
 "data-ct318-filter"
])must(runtime,x);

/* r342 no longer owns Pra Você geometry. */
js=once(js,
 "function lockRow342(row){\n if(!row)return false;",
 "function lockRow342(row){\n if(row?.classList?.contains('ct336-actions'))return false;\n if(!row)return false;",
 'exclude ct336 from r342'
);

/* Replace textual Voltar injector with icon-only control beside search. */
const back345=[
"function ct169InjectBack(){",
"  if(!session||route()==='auth')return;",
"  document.querySelectorAll('[data-ct169-back]').forEach(x=>x.remove());",
"  const input=[...document.querySelectorAll('input')].find(x=>/buscar filmes|buscar s[eé]ries|epis[oó]dios|atores/i.test(String(x.placeholder||'')))||document.querySelector('input[type=search]');",
"  if(!input)return;",
"  const search=input.closest('.search')||input.parentElement;if(!search||!search.parentElement)return;",
"  const parent=search.parentElement;parent.classList.add('ct345-search-row');",
"  if(route()==='home'&&ct169NavDepth<=0)return;",
"  const b=document.createElement('button');b.type='button';b.className='ct345-back-icon';b.dataset.ct169Back='1';b.setAttribute('aria-label','Voltar');b.setAttribute('title','Voltar');b.textContent='‹';",
"  parent.insertBefore(b,search);",
"}"
].join('\n');
js=range(js,"function ct169InjectBack(){","const ct169SetAppBase=setApp;",back345,'ct169 back');

js=once(js,"window.__ctWebBuild='1.0.135';window.__ctOfficialVersion='1.0.135';","window.__ctWebBuild='1.0.136';window.__ctOfficialVersion='1.0.136';",'web version');
js=once(js,"const REVISION='r344-official-1.0.135';","const REVISION='r345-official-1.0.136';",'revision');
js=once(js,"const version='1.0.135',revision='r344-official-1.0.135';","const version='1.0.136',revision='r345-official-1.0.136';",'footer identity');
js=once(js,'boot();',runtime+'\nboot();','runtime insertion');

html=html.replaceAll('app-v344.js','app-v345.js').replaceAll('app-v344.css','app-v345.css').replaceAll('v1.0.135','v1.0.136').replaceAll('r344-official-1.0.135','r345-official-1.0.136');
sw=sw.replaceAll('ct-web-1.0.135-r344','ct-web-1.0.136-r345').replaceAll('app-v344.js','app-v345.js').replaceAll('app-v344.css','app-v345.css');
css+='\n/* CineTracker Web 1.0.136 r345 — stable Pra Você grid actions + icon back beside search + no filter controls. */\n';

const prev=JSON.parse(releaseRaw),release={
 ...prev,
 version:'1.0.136',revision:'r345-official-1.0.136',base:'r344-production',
 scope:'foryou-stable-actions+icon-back+discover-filters-removed',
 discover_foryou_actions:'normal-flow-grid-2-or-3+swap-always-present',
 discover_foryou_geometry:'r342-excluded-from-ct336-actions',
 discover_foryou_filters:'removed-ui+forced-all',
 navigation_back:'icon-only-left-of-search-no-text-button',
 discover_header:'back-and-search-same-row-no-vacuum',
 discover_top10_geometry:'desktop-ten-equal-columns-visible-in-viewport',
 home_startup:'fresh-payload+history+live-reconcile+metadata-hydrate-before-reveal',
 sports_startup:'every-open-warm+force-provider-sync+auth-retry+refresh-payload',
 android:'1.0.20/10062'
};
if(release.android!=='1.0.20/10062')throw new Error('r345 Android baseline changed');
await Promise.all([
 writeFile(resolve(dist,'app-v345.js'),js),writeFile(resolve(dist,'app-v345.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v344.js'),{force:true}),rm(resolve(dist,'app-v344.css'),{force:true})]);
console.log('WEB_R345_READY Pra Você stable actions + icon-only back + filters removed');
