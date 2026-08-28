import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const warm=await readFile(resolve(root,'dist/patch-v112-v0994-warm-boot.js'),'utf8');
const legacy=await readFile(resolve(root,'dist/patch-v092-v0991.js'),'utf8');

const count=(s,n)=>(s.match(new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;
if(count(html,'patch-v112-v0994-warm-boot.js')!==1)throw new Error('v112 warm boot must load exactly once');
if(html.indexOf('patch-v112-v0994-warm-boot.js')<html.indexOf('patch-v111-v0994-global-search.js'))throw new Error('v112 must load after v111');
if(!warm.includes('v113-cache-first-fast-boot'))throw new Error('cache-first warm boot marker missing');
if(!warm.includes('if(hasHomeCache())'))throw new Error('persisted Home cache is not used for immediate startup');
if(!warm.includes('void backgroundWarm(false)'))throw new Error('background refresh missing');
if(!warm.includes("window.__ct991PreloadDiscover"))throw new Error('Discover background preload missing');
if(!warm.includes("window.__ct991Preload"))throw new Error('Profile background preload missing');
if(!warm.includes("cinetracker_profile_home_payload_v0994"))throw new Error('Home preload missing');
if(!warm.includes("cinetracker_profile_remaining_v0994"))throw new Error('remaining metrics preload missing');
if(warm.includes('BOOT_TIMEOUT=18000')||warm.includes('await Promise.all([homeJob,dashJob'))throw new Error('old blocking all-routes warm boot is still present');
if(!warm.includes("window.addEventListener('cinetracker:data-changed'"))throw new Error('background rewarm after data changes missing');
if(!legacy.includes('v113-persistent-hot-route-cache'))throw new Error('persistent route cache augmentation missing');
if(!legacy.includes('window.__ct991Preload ='))throw new Error('Profile preload export missing');
if(!legacy.includes('window.__ct991PreloadDiscover ='))throw new Error('Discover preload export missing');
if(!legacy.includes('__ct991RecommendationCache'))throw new Error('Discover recommendations cache missing');
if(!legacy.includes('__ct991MixedCache'))throw new Error('Discover tabs cache missing');
console.log('CineTracker Web 0.99.4 cache-first warm boot: OK');
