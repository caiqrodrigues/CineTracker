import {readFile,writeFile,rm} from 'node:fs/promises';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
await import('./build-r371.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v371.js'),'utf8'),readFile(resolve(dist,'app-v371.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r372-foryou-layout-fresh-strict.js'),'utf8')
]);
const once=(s,a,b,l)=>{const n=s.split(a).length-1;if(n!==1)throw new Error('r372 expected one '+l+', found '+n);return s.replace(a,b)};
js=once(js,
 " row.style.setProperty('display','grid','important');\n row.style.setProperty('grid-template-columns',bucket==='watch'?'repeat(2,minmax(0,1fr))':'repeat(3,minmax(0,1fr))','important');",
 " row.style.setProperty('display','flex','important');\n row.style.setProperty('flex-flow','row nowrap','important');\n row.style.setProperty('align-items','center','important');\n row.style.setProperty('justify-content','space-between','important');\n row.style.setProperty('gap','8px','important');",
 'r367 legacy grid');
js=once(js," styleRow(row,poster,expected);"," /* r372 final flex geometry owner */",'r348 legacy geometry writer');
js=once(js,"window.__ctWebBuild='1.0.162';window.__ctOfficialVersion='1.0.162';","window.__ctWebBuild='1.0.163';window.__ctOfficialVersion='1.0.163';",'version');
js=once(js,"const REVISION='r371-official-1.0.162';","const REVISION='r372-official-1.0.163';",'revision');
js=once(js,"const version='1.0.162',revision='r371-official-1.0.162';","const version='1.0.163',revision='r372-official-1.0.163';",'footer');
js=once(js,'boot();',runtime+'\nboot();','runtime');
html=html.replaceAll('app-v371.js','app-v372.js').replaceAll('app-v371.css','app-v372.css').replaceAll('v1.0.162','v1.0.163').replaceAll('r371-official-1.0.162','r372-official-1.0.163');
sw=sw.replaceAll('ct-web-1.0.162-r371','ct-web-1.0.163-r372').replaceAll('app-v371.js','app-v372.js').replaceAll('app-v371.css','app-v372.css');
css+='\n/* CineTracker Web 1.0.163 r372 — stable flex action row + strict 100% Novos personal exclusion. */\n';
const prev=JSON.parse(releaseRaw),release={...prev,version:'1.0.163',revision:'r372-official-1.0.163',base:'r371-production',scope:'foryou-layout+fresh-strict-personal-filter',discover_foryou_actions_layout:'flex-row-nowrap+gap8+fixed32+no-overlap',discover_foryou_overlay:'absolute-z10-36x36-backdrop-blur',discover_fresh_filter:'strict-seen+watch-before-render',discover_fresh_authority:'r319-personal-live',discover_fresh_fallback:'single-TMDB-batch-then-refilter',android:'1.0.20/10062'};
await Promise.all([
 writeFile(resolve(dist,'app-v372.js'),js),writeFile(resolve(dist,'app-v372.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v371.js'),{force:true}),rm(resolve(dist,'app-v371.css'),{force:true})]);
console.log('WEB_R372_READY stable buttons + strict fresh personal exclusion');