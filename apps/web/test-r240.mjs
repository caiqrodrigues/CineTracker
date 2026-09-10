import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const [sports,sem,build,pkg]=await Promise.all([
 readFile(resolve(root,'runtime-r240-sports-four-tabs.js'),'utf8'),readFile(resolve(root,'runtime-r240-user-video-semantics.js'),'utf8'),readFile(resolve(root,'build-r240.mjs'),'utf8'),readFile(resolve(root,'package.json'),'utf8')
]);
const need=(s,x,label=x)=>{if(!s.includes(x))throw new Error('r240 invariant missing: '+label)};
for(const x of ["window.__ctR240='sports-four-data-authority'","['next','Próximos']","['previous','Anteriores']","['favorites','Favoritos']","['watched','Assistidos']","sportsTabs=function()","sportsPayload=async function()","sportsFiltered=function(rows)","p_scope:'today'","p_favorite_only:true","r240Shift(now,-3)","LEGACY_WATCHED_KEY_240"])need(sports,x);
for(const x of ["window.__ctR240Home='follow-first-history-hidden'","window.__ctR240Discover='canonical-exclusions-atomic-switch'","window.__ctR240Sports='search-focus-caret-stable'","blockedState240","exclusionContext158()","restoreDiscover240","captureSports240","setSelectionRange","ct240HistoryHidden"])need(sem,x);
for(const forbidden of ['Duna','Reacher','Spider-Man','Stuart','Lioness','WWE Raw'])if(sem.includes(forbidden))throw new Error('r240 semantic authority may not hardcode title '+forbidden);
for(const x of ["const REVISION='r240-official-1.0.32'","app-v240.js","version:'1.0.32'","semanticPatch","sportsPatch"])need(build,x);
const p=JSON.parse(pkg);if(p.version!=='1.0.32'||p.scripts?.build!=='node build-r240.mjs'||p.scripts?.verify!=='node build-r240.mjs && node test-r240.mjs')throw new Error('r240 package identity wrong');
console.log('R240_STATIC_OK home=follow-first discover=central-exclusions+atomic sports=4-tabs+focus profile/f1=preserved');