import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r229.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v229.js'),'utf8'),readFile(resolve(dist,'app-v229.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r230-v124-final-ui-home-authority.js'),'utf8')
]);
const once=(s,a,b,label)=>{const n=s.split(a).length-1;if(n!==1)throw new Error(`Web 1.0.24 expected one ${label}, found ${n}`);return s.replace(a,b)};
for(const must of ["window.__ctR230V124='home-complete-first-paint+foryou-uniform-actions+sports-final+stats-icon'",'enrich-before-visible-paint-no-late-morph','uniform-bottom-actions+swap-watchdog+metadata','canonical-filters+two-actions+icon-collapse'])if(!patch.includes(must))throw new Error('Web 1.0.24 patch missing '+must);
if(!js.includes("const REVISION='r229-official-1.0.23';"))throw new Error('Web 1.0.24 requires r229 base');
if(!js.includes('\nboot();'))throw new Error('Web 1.0.24 boot point missing');
js=once(js,"const REVISION='r229-official-1.0.23';","const REVISION='r230-official-1.0.24';",'revision');
js=once(js,"window.__ctWebBuild='1.0.23';window.__ctOfficialVersion='1.0.23';","window.__ctWebBuild='1.0.24';window.__ctOfficialVersion='1.0.24';",'identity');
js=js.replaceAll('CineTracker • v1.0.23','CineTracker • v1.0.24').replaceAll("JSON.stringify({version:'1.0.23',revision:REVISION","JSON.stringify({version:'1.0.24',revision:REVISION");
// Stop the 1.0.23 Sports normalizer from repeatedly fighting the r230 final authority.
const old123="try{new MutationObserver(sync).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})}catch{}\nsetInterval(sync,700);sports();";
if(js.includes(old123))js=js.replace(old123,"sports();");
// Stop r227's broad DOM sync if this historical authority is present in the accumulated bundle.
const old121="let timer=0;function sync121(){clearTimeout(timer);timer=setTimeout(()=>{void syncWlCounts121();discover121();statsToggle121();sports121()},45)}";
if(js.includes(old121))js=js.replace(old121,"let timer=0;function sync121(){}");
js=js.replace('\nboot();','\n'+patch+'\nboot();');
html=html.replaceAll('r229-official-1.0.23','r230-official-1.0.24').replaceAll('app-v229.js','app-v230.js').replaceAll('app-v229.css','app-v230.css');
const swCache=/const\s+CACHE\s*=\s*['"][^'"]+['"]\s*;/;if(!swCache.test(sw))throw new Error('SW CACHE missing');
sw=sw.replace(swCache,"const CACHE='ct-web-1.0.24-r230';").replaceAll('app-v229.js','app-v230.js').replaceAll('app-v229.css','app-v230.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v230.js'),js,'utf8'),writeFile(resolve(dist,'app-v230.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.24',revision:'r230-official-1.0.24',base:'r229-official-1.0.23',home:'enrich-before-first-visible-paint',discover:'uniform-actions+metadata+swap-watchdog',sports:'canonical-filters+two-actions',statistics:'icon-only',generated_at:new Date().toISOString()},null,2),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v229.js'),{force:true}),rm(resolve(dist,'app-v229.css'),{force:true})]);
console.log('WEB_1_0_24_READY home=complete-first-paint discover=uniform-actions sports=canonical stats=icon-only');
