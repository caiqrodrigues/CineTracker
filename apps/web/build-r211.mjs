import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r208.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,patch,hotfix]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v208.js'),'utf8'),readFile(resolve(dist,'app-v208.css'),'utf8'),readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(root,'runtime-r211-v107-behavior.js'),'utf8'),readFile(resolve(root,'runtime-r214-v107-ui-hotfix.js'),'utf8')
]);
for(const m of ["window.__ctR211='v107-behavior-authority'",'cinetracker_mark_watch_v0994','cinetracker_recommendation_state_v107','data-ct107-rewatch','ct-f1-v107','ct107:snapshot:'])if(!patch.includes(m))throw new Error('Web 1.0.7 source runtime missing '+m);
for(const m of ["window.__ctR214='v107-ui-regression-hotfix'",'data-ct214-rewatch','cinetracker_mark_watch_v0994','#ct-f1-v104{display:none!important}'])if(!hotfix.includes(m))throw new Error('Web 1.0.7 hotfix missing '+m);
if(!js.includes('\nboot();'))throw new Error('Web 1.0.7 insertion point missing');
const cut=(src,a,b,label)=>{const i=src.indexOf(a),j=src.indexOf(b);if(i<0||j<0||j<=i)throw new Error('Web 1.0.7 cannot strip '+label);return src.slice(0,i)+src.slice(j)};
patch=cut(patch,'/* Canonical replay source:','/* Authoritative recommendation eligibility','overlapping replay authority');
patch=cut(patch,'/* Instant route feedback:','/* Standalone public F1 hub','snapshot navigation interception');
if(patch.includes('data-ct107-rewatch')||patch.includes('ct107:snapshot:'))throw new Error('Web 1.0.7 obsolete replay/snapshot code survived strip');
js=js.replaceAll("'cinetracker_mark_episode_v0994'","'cinetracker_legacy_episode_disabled_v107'").replaceAll('"cinetracker_mark_episode_v0994"','"cinetracker_legacy_episode_disabled_v107"');
js=js.replaceAll('r208-official-1.0.4','r211-official-1.0.7').replaceAll('CineTracker • v1.0.4','CineTracker • v1.0.7').replaceAll("window.__ctOfficialVersion='1.0.4'","window.__ctOfficialVersion='1.0.7'").replaceAll("window.__ctWebBuild='1.0.4'","window.__ctWebBuild='1.0.7'");
js=js.replace('\nboot();','\n'+patch+'\n'+hotfix+'\nboot();');
html=html.replaceAll('r208-official-1.0.4','r211-official-1.0.7').replaceAll('app-v208.js','app-v211.js').replaceAll('app-v205.js','app-v211.js').replaceAll('app-v208.css','app-v211.css').replaceAll('app-v205.css','app-v211.css');
const swVersion=/const\s+VERSION\s*=\s*['"][^'"]+['"]\s*;/;if(!swVersion.test(sw))throw new Error('SW VERSION missing');sw=sw.replace(swVersion,"const VERSION='ct-web-1.0.7-r211-hotfix1';");
await Promise.all([writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v211.js'),js,'utf8'),writeFile(resolve(dist,'app-v211.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'1.0.7',revision:'r211-official-1.0.7-hotfix1',base:'1.0.4-r208',runtime:'r211-without-replay-or-snapshot-overlap',rewatch:'r214-canonical-single-authority',sports:'single-v107-f1-hub;v104-hidden',generated_at:new Date().toISOString()},null,2),'utf8')]);
await Promise.all([rm(resolve(dist,'app-v208.js'),{force:true}),rm(resolve(dist,'app-v208.css'),{force:true}),rm(resolve(dist,'app-v205.js'),{force:true}),rm(resolve(dist,'app-v205.css'),{force:true})]);
console.log('WEB_1_0_7_HOTFIX1_READY revision=r211-official-1.0.7-hotfix1 rewatch=r214 sports=single-v107 top10=no-snapshot-interceptor');