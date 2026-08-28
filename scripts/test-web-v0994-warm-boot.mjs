import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const warm=await readFile(resolve(root,'dist/patch-v112-v0994-warm-boot.js'),'utf8');
const legacy=await readFile(resolve(root,'dist/patch-v092-v0991.js'),'utf8');

const count=(s,n)=>(s.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;
if(count(html,'patch-v112-v0994-warm-boot.js')!==1)throw new Error('v112 warm boot must load exactly once');
if(html.indexOf('patch-v112-v0994-warm-boot.js')<html.indexOf('patch-v111-v0994-global-search.js'))throw new Error('v112 must load after v111');
if(!warm.includes('v112-bingers-style-warm-boot'))throw new Error('warm boot marker missing');
if(!warm.includes("window.__ct991PreloadDiscover"))throw new Error('warm boot does not await Discover preload');
if(!warm.includes("window.__ct991Preload"))throw new Error('warm boot does not await Profile preload');
if(!warm.includes("cinetracker_profile_home_payload_v0994"))throw new Error('warm boot does not preload Home');
if(!warm.includes("cinetracker_profile_remaining_v0994"))throw new Error('warm boot does not preload remaining metrics');
if(!warm.includes('Pré-carregando capas e recomendações'))throw new Error('warm boot does not preload first-view images');
if(!warm.includes("window.addEventListener('cinetracker:data-changed'"))throw new Error('warm boot does not rewarm after data changes');
if(!legacy.includes('v112-hot-route-preload-exports'))throw new Error('legacy data layer was not augmented for warm boot');
if(!legacy.includes('window.__ct991Preload ='))throw new Error('Profile preload export missing');
if(!legacy.includes('window.__ct991PreloadDiscover ='))throw new Error('Discover preload export missing');
if(!legacy.includes('__ct991RecommendationCache'))throw new Error('Discover recommendations are not cached in memory');
if(!legacy.includes('__ct991MixedCache'))throw new Error('Discover global tabs are not cached in memory');
console.log('CineTracker Web 0.99.4 warm boot: OK');
