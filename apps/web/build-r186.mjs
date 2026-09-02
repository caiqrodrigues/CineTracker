import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r185c.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw,patch186,patch190,patch190b,patch191,patch192,patch193]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v185c.js'),'utf8'),
  readFile(resolve(dist,'app-v185c.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8'),
  readFile(resolve(root,'runtime-r186-shared.js'),'utf8'),
  readFile(resolve(root,'runtime-r190-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r190b-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r191-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r192-web.js'),'utf8'),
  readFile(resolve(root,'runtime-r193-web.js'),'utf8')
]);
if(!js.includes("const REVISION='r185c-profile-discover-polish';"))throw new Error('r193 requires r185C Web base');
if(!js.includes("window.__ctR185CWeb='profile-discover-hot-route-reuse';"))throw new Error('r193 requires r185C performance');
if(!js.includes("window.__ctR184GapPrompt='detect-skipped-released-episodes-before-manual-watch';"))throw new Error('r193 must preserve r184 gap prompt');
if(!patch186.includes("window.__ctR186='foryou-strict-quality-year-history-realtime';"))throw new Error('r193 requires r186 strict authority');
if(!patch190.includes("window.__ctR190Web = 'fast-state-actions-sports-profile';"))throw new Error('r193 requires r190 UI fixes');
if(!patch190b.includes("window.__ctR190BWeb='sports-only-global-search-guard';"))throw new Error('r193 requires r190b search guard');
if(!patch191.includes("window.__ctR191Web='nonblocking-authority-alias-filter-actions';"))throw new Error('r193 requires r191 nonblocking authority');
if(!patch192.includes("window.__ctR192Web='discover-bilingual-profile-final';"))throw new Error('r193 requires r192 search/favorites');
if(!patch192.includes("safeTmdb('/search/movie',{query:q,page:1,language:'en-US'})"))throw new Error('r193 bilingual search missing');
if(!patch192.includes("openFavoriteSearch158=function(kind)"))throw new Error('r193 multi-add favorites missing');
if(!patch192.includes("search:false"))throw new Error('r193 sports search isolation missing');
if(!patch193.includes("window.__ctR193Web='fast-state-authority';"))throw new Error('r193 patch marker missing');
if(!patch193.includes("cinetracker_known_media_v1"))throw new Error('r193 known-media authority missing');
if(!patch193.includes("cinetracker_media_state_v1"))throw new Error('r193 detail-state authority missing');
if(!patch193.includes("cinetracker_home_live_v0997_r5"))throw new Error('r193 fast Home missing');
if(!patch193.includes("cinetracker_profile_media_dashboard_v0997_fast"))throw new Error('r193 fast Profile missing');
if(!js.includes('\nboot();'))throw new Error('r193 insertion point missing');
js=js.replace("const REVISION='r185c-profile-discover-polish';","const REVISION='r193-fast-state-authority';");
js=js.replace('\nboot();','\n'+patch186+'\n'+patch190+'\n'+patch190b+'\n'+patch191+'\n'+patch192+'\n'+patch193+'\nboot();');
html=html.replaceAll('r185c-profile-discover-polish','r193-fast-state-authority').replaceAll('app-v185c.js','app-v193.js').replaceAll('app-v185c.css','app-v193.css');
sw=sw.replaceAll('r185c-profile-discover-polish','r193-fast-state-authority').replaceAll('app-v185c.js','app-v193.js').replaceAll('app-v185c.css','app-v193.css');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v193.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v193.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r193-fast-state-authority',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v185c.js'),{force:true}),rm(resolve(dist,'app-v185c.css'),{force:true})]);
console.log('WEB_R193_READY home=r5 profile=fast-dashboard known=canonical detail=alias-state preloads=paced');
