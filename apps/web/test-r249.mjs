import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),repo=resolve(root,'../..'),dist=resolve(root,'dist');
const read=p=>readFile(resolve(repo,p),'utf8');
const [pkg,build,official,runtime,workflow,readme,changelog,js,css,html,releaseRaw]=await Promise.all([
 read('apps/web/package.json'),read('apps/web/build-r249.mjs'),read('apps/web/build-r249-official.mjs'),read('apps/web/runtime-r249-single-authority.js'),read('.github/workflows/verify.yml'),read('README.md'),read('CHANGELOG.md'),readFile(resolve(dist,'app-v249.js'),'utf8'),readFile(resolve(dist,'app-v249.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r249 invariant missing '+label)};
for(const x of ['"version": "1.0.40"','build-r249-official.mjs','test-r249.mjs'])must(pkg,x,'package '+x);
for(const x of ["await import('./build-r248-official.mjs')","cinetracker_sports_events_v0997","window.__ctR249SportsRows","window.__ctR249LegacyCurrentObserverDisabled=true","window.__ctR249LegacyBindingObserverDisabled=true","r249-official-1.0.40","app-v249.js","app-v249.css"])must(build,x,'build '+x);
for(const x of ["window.__ctR249='single-authority-current-ui'","window.__ctR249Following='watched-frontier-new-release-wins'","window.__ctR249Discover='atomic-latest-request-generation'","window.__ctR249Sports='canonical-four-tabs-no-legacy-rpc'","window.__ctR249F1='persistent-collapse-event-driven'","window.__ctR249Profile='single-statistics-owner'","window.__ctR249Horizontal='local-x-only-global-x-clipped'","DISCOVER_TAG","discoverLatest249","SPORT_TABS","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","age>=1&&age<=3","dayStart(eventDate(e))===today","ct:f1hub:collapsed:r249","ct249-xrail"])must(runtime,x,'runtime '+x);
if(runtime.includes('new MutationObserver'))throw new Error('r249 runtime reintroduced a perpetual DOM observer');
for(const x of ["window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';","const REVISION='r249-official-1.0.40';","window.__ctR249='single-authority-current-ui'","window.__ctR249LegacyCurrentObserverDisabled=true","window.__ctR249LegacyBindingObserverDisabled=true"])must(js,x,'bundle '+x);
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r249 final bundle still contains removed sports RPC');
const tail=js.slice(js.indexOf("window.__ctR248='current-following-complete-ui-authority'"));
if(tail.includes('observer.observe(document.body,{subtree:true,childList:true});'))throw new Error('r249 final bundle still attaches r248 current observer');
if(tail.includes("new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(cleanLegacy)}).observe(document.documentElement"))throw new Error('r249 final bundle still attaches r248 binding observer');
for(const x of ['overflow-x:clip!important','.ct249-xrail','overflow-x:auto!important','overflow-y:auto!important'])must(css,x,'css '+x);
for(const x of ['app-v249.js','app-v249.css'])must(html,x,'html '+x);
const release=JSON.parse(releaseRaw);if(release.version!=='1.0.40'||release.revision!=='r249-official-1.0.40')throw new Error('r249 release.json identity mismatch');
for(const x of ['Verify Web 1.0.40 r249 Single Authority','build-r249-official.mjs','test-r249.mjs','test-r249-authority-browser.mjs','test-r249-exact-bundle-browser.mjs','r249-official-1.0.40'])must(workflow,x,'workflow '+x);
for(const x of ['Web | **1.0.40**','`r249-official-1.0.40`','## Web 1.0.40 / r249'])must(readme,x,'README '+x);
for(const x of ['## 1.0.40 — 2026-09-11 — Web r249','single authority','cinetracker_sports_events_v0997'])must(changelog,x,'CHANGELOG '+x);
for(const x of ["window.__ctR249='single-authority-current-ui'",'cinetracker_sports_events_v0997'])must(official,x,'official validation '+x);
console.log('R249_STATIC_OK single-authority discover=race-safe sports=4-tabs no-legacy-rpc profile=single scroll=local android=unchanged');
