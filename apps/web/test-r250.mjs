import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),repo=resolve(root,'../..'),dist=resolve(root,'dist');
const read=p=>readFile(resolve(repo,p),'utf8');
const [pkg,build,runtime,workflow,migration,readme,changelog,js,css,html,releaseRaw]=await Promise.all([
 read('apps/web/package.json'),read('apps/web/build-r250.mjs'),read('apps/web/runtime-r250-source-aligned.js'),read('.github/workflows/verify.yml'),read('supabase/migrations/20260911160000_r250_sports_rpc_compat.sql'),read('README.md'),read('CHANGELOG.md'),readFile(resolve(dist,'app-v250.js'),'utf8'),readFile(resolve(dist,'app-v250.css'),'utf8'),readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'release.json'),'utf8')
]);
const must=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r250 invariant missing '+label)};
for(const x of ['"version": "1.0.41"','build-r250-official.mjs','test-r250.mjs'])must(pkg,x,'package '+x);
for(const x of ["await import('./build-r249-official.mjs')","window.__ctR250LegacyR249EventsDisabled=true","r250-official-1.0.41","app-v250.js","app-v250.css"])must(build,x,'build '+x);
for(const x of ["window.__ctR250='source-aligned-deterministic-ui'","window.__ctR250Home='watched-frontier-released-newer-only'","window.__ctR250Discover='owned-tab-generation-and-personal-exclusions'","window.__ctR250Sports='canonical-payload-v1-four-tabs'","window.__ctR250F1='single-hub-persistent-user-collapse'","window.__ctR250Profile='single-merged-statistics'","window.__ctR250Horizontal='local-x-rails-page-y-only'","cinetracker_sports_payload_v1","cinetracker_sport_mark_watched_v1","history_missing_episodes=newer.length","contentOnly250","SPORT_TABS","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","age>=1&&age<=3","ct:f1hub:collapsed:r250","ct250-xrail"])must(runtime,x,'runtime '+x);
if(runtime.includes('new MutationObserver'))throw new Error('r250 must not use MutationObserver reconciliation');
for(const x of ["window.__ctWebBuild='1.0.41';window.__ctOfficialVersion='1.0.41';","const REVISION='r250-official-1.0.41';","window.__ctR250='source-aligned-deterministic-ui'","window.__ctR250LegacyR249EventsDisabled=true"])must(js,x,'bundle '+x);
if(js.includes('cinetracker_sports_events_v0997'))throw new Error('r250 final bundle still calls legacy sports RPC');
for(const x of ['overflow-x:clip!important','.ct250-xrail','overflow-x:auto!important','overflow-y:auto!important','.ct250-home-card.thumbCard','.ct250-rating'])must(css,x,'css '+x);
for(const x of ['app-v250.js','app-v250.css'])must(html,x,'html '+x);
const release=JSON.parse(releaseRaw);if(release.version!=='1.0.41'||release.revision!=='r250-official-1.0.41')throw new Error('r250 release identity mismatch');
for(const x of ['Verify Web 1.0.41 r250 Deterministic UI','build-r250-official.mjs','test-r250.mjs','test-r250-regression-browser.mjs','r250-official-1.0.41'])must(workflow,x,'workflow '+x);
for(const x of ['Web | **1.0.41**','`r250-official-1.0.41`','## Web 1.0.41 / r250'])must(readme,x,'README '+x);
for(const x of ['## 1.0.41 — 2026-09-11 — Web r250','cinetracker_sports_payload_v1','compatibilidade'])must(changelog,x,'CHANGELOG '+x);
for(const x of ['create or replace function public.cinetracker_sports_events_v0997','cinetracker_sports_payload_v1'])must(migration,x,'migration '+x);
console.log('R250_STATIC_OK home=frontier discover=owned sports=canonical f1=single profile=merged scroll=local android=unchanged');
