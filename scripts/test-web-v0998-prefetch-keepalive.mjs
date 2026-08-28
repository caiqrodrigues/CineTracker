import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const query=await readFile(resolve(root,'apps/web/patch-v125-v0998-query-state.js'),'utf8');
const keep=await readFile(resolve(root,'apps/web/patch-v126-v0998-keepalive-tabs.js'),'utf8');
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const sw=await readFile(resolve(root,'apps/web/service-worker.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');

function need(text,needle,label){if(!text.includes(needle))throw new Error(`0.99.8 missing ${label}: ${needle}`)}
if(pkg.version!=='0.99.8')throw new Error(`Expected package 0.99.8, got ${pkg.version}`);
need(query,"const STALE_TIME=7*60*1000",'7 minute staleTime');
need(query,"const CACHE_TIME=30*60*1000",'cacheTime');
need(query,'Promise.all([','parallel boot Promise.all');
need(query,'window.sbRpc?window.sbRpc(HOME_RPC,{})','Home boot prefetch');
need(query,'window.sbRpc?window.sbRpc(PROFILE_RPC,profileBody())','Profile boot prefetch');
need(query,'prefetchDiscover()','Discover boot prefetch');
need(query,'prefetchSettings()','Settings boot state');
need(query,'window.__ct0998QueryClient','global query client');
need(query,'scheduleRpcRefresh','background RPC revalidation');
need(query,'refreshFetch','background TMDB revalidation');
need(keep,"const pages=new Map()",'DOM page cache');
need(keep,"const scrolls=new Map()",'scroll preservation');
need(keep,"bin.appendChild(node)",'hidden DOM keep-alive');
need(keep,"pages.has(route)?await instantRestore(route):await firstVisit(route)",'instant cached route restoration');
need(keep,'async function primeAll()','route pre-mount');
need(keep,"animation:ct998Fade 150ms",'150ms fade transition');
need(keep,"el.removeAttribute('data-ct120-nav')",'single keep-alive navigation authority');
need(sw,"ct-web-0.99.8-r1",'0.99.8 service-worker cache');
const order=['patch-v1195-v0997-route-preload-core.js','patch-v125-v0998-query-state.js','patch-v120-v0997-structural-authority.js','patch-v124-v0997-video-smoke-authority.js','patch-v126-v0998-keepalive-tabs.js'].map(x=>html.indexOf(x));
if(order.some(x=>x<0)||order.some((x,i)=>i&&x<=order[i-1]))throw new Error(`0.99.8 runtime order invalid: ${order.join(',')}`);
console.log('WEB_0998_PREFETCH_KEEPALIVE_OK stale=7m cache=30m boot=Promise.all tabs=4 keepalive=DOM scroll=preserved fade=150ms');
