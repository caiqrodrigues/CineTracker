import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const warm=await readFile(resolve(root,'dist/patch-v112-v0994-warm-boot.js'),'utf8');
const fluid=await readFile(resolve(root,'dist/patch-v113-v0994-fluidity.js'),'utf8');
const home=await readFile(resolve(root,'dist/patch-v099-v0994-web.js'),'utf8');
const legacy=await readFile(resolve(root,'dist/patch-v092-v0991.js'),'utf8');

if(!warm.includes('v113-cache-first-fast-boot'))throw new Error('fast cache-first warm boot marker missing');
if(!warm.includes('if(hasHomeCache())'))throw new Error('warm boot does not release from persisted Home cache');
if(warm.includes("await Promise.all([homeJob,dashJob"))throw new Error('warm boot still blocks on all primary routes');
if(!warm.includes('void backgroundWarm(false)'))throw new Error('background stale-while-revalidate missing');
if(!legacy.includes('v113-persistent-hot-route-cache'))throw new Error('persistent Profile/Discover cache missing');
if(!legacy.includes("ct0994_profile_snapshot_v3")||!legacy.includes("ct0994_discover_snapshot_v3"))throw new Error('persistent route snapshot keys missing');
if(!legacy.includes("if(discover991.tab==='foryou'){controls.innerHTML=discoverFilters991();bindDiscoverFilters991();return loadForYou991()}"))throw new Error('Pra Voce Geral/Series/Filmes filters not restored');
if(legacy.includes("controls.innerHTML='';discover991.filter='all';return loadForYou991()"))throw new Error('Pra Voce still resets/removes filters');
if(!legacy.includes("if(dashboard991.length){void loadDiscover991()"))throw new Error('Discover still waits for dashboard network before first paint');
if(!home.includes("vp.dataset.ct994Anchored='1'"))throw new Error('Home initial viewport is not synchronously anchored');
if(home.includes("requestAnimationFrame(()=>{const vp=$('#ct994-viewport',root),hist=$('.ct992-history',root);if(vp&&hist)vp.scrollTop=hist.offsetHeight})"))throw new Error('Home still visibly scrolls through history');
if(!legacy.includes('id="ct113-activity-host"'))throw new Error('old Profile timeline was not replaced by v113 activity host');
if(!fluid.includes('cinetracker_profile_activity_v0994'))throw new Error('activity RPC missing');
for(const n of ['7 dias','30 dias','90 dias'])if(!fluid.includes(n))throw new Error(`activity range ${n} missing`);
if(!fluid.includes('importações em lote consolidadas'))throw new Error('activity baseline consolidation explanation missing');
if((html.match(/patch-v113-v0994-fluidity\.js/g)||[]).length!==1)throw new Error('v113 must load exactly once');
if(html.indexOf('patch-v113-v0994-fluidity.js')<html.indexOf('patch-v112-v0994-warm-boot.js'))throw new Error('v113 must load after v112');
console.log('CineTracker Web 0.99.4 fluidity/cache-first: OK');
