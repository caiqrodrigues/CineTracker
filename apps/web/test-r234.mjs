import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
const [js,html,sw,release,runtime]=await Promise.all([
 readFile(resolve(dist,'app-v234.js'),'utf8'),
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r234-v126-real-regressions.js'),'utf8')
]);

const must=[
 "const REVISION='r234-official-1.0.26';",
 "window.__ctWebBuild='1.0.26';window.__ctOfficialVersion='1.0.26';",
 "window.__ctR234V126='real-regressions-baseline-preserving-authority'",
 "window.__ctV126Home='instant-payload-state+nonblocking-single-tmdb-refresh'",
 "window.__ctV126Discover='r232-target-sections-only-top10-untouched'",
 "window.__ctV126Sports='r123-layout-preserved-event-driven'",
 "window.__ctV126Watchlist='full-logical-count+single-modal+visible-poster-enrichment'",
 "window.__ctR229V123='sports-card-single-action-zone-no-floating-actions'",
 "window.__ctR232V124='final-web-consolidation-preserve-v123-sports'",
 ".ct124-card{width:200px!important;min-width:200px!important;max-width:200px!important",
 ".ct123-actions{margin-top:auto!important",
 "const allowed=new Set(['indicacao do dia','da sua watchlist','100 novos'])",
 "try{window.__ctV124Discover?.()}catch{}",
 "try{window.__ctV123SportsNow?.()}catch{}",
 "requestAnimationFrame(()=>void refreshHome126())",
 "ct172HydrateHomeEpisodes=async function(){return false}",
 "function rows126(d,kind)",
 "data-ct126-watchlist",
 "data-ct126-watch-modal",
 "requested_media_ids:ids",
 "/functions/v1/ct-enrich-media-user?priority=visible-posters"
];
for(const x of must)if(!js.includes(x))throw new Error('missing '+x);

const banned=[
 "window.__ctR233V125='system-stability-event-driven-no-competing-observers'",
 '.ct125-media-card',
 'await revalidateHome233()',
 'setInterval(sync,700)',
 'new MutationObserver(sync117)',
 'new MutationObserver(sync119)',
 'new MutationObserver(sync121)',
 "new MutationObserver(queue).observe(q('#app')||document.documentElement,{subtree:true,childList:true,characterData:true})",
 'setInterval(sync,350)',
 'setInterval(sync,1200)',
 'setInterval(queue,1200)',
 'setInterval(guard,500)',
 "setInterval(()=>void sync(false).catch(()=>{}),1500)"
];
for(const x of banned)if(js.includes(x))throw new Error('legacy/broken authority survived: '+x);

for(const v of ['117','118','119','120','121','122','124']){
 const active=`e.target.closest?.('[data-ct${v}-watchlist]')`;
 if(js.includes(active))throw new Error('legacy Watchlist click authority survived: '+active);
}
const rowsStart=runtime.indexOf('function rows126(d,kind)');
const rowsEnd=runtime.indexOf('\n}',rowsStart);
const rowsBody=runtime.slice(rowsStart,rowsEnd+2);
if(rowsStart<0||rowsBody.includes('mediaId126(x)>0')||rowsBody.includes('tmdb_id>0'))throw new Error('r126 Watchlist rows are still dropping local entries');

const discoverStart=runtime.indexOf('function runDiscover126()');
const discoverEnd=runtime.indexOf('function queueDiscover126()',discoverStart);
const discoverBody=runtime.slice(discoverStart,discoverEnd);
if(discoverStart<0||discoverBody.includes("qa('button,a',root)")||discoverBody.includes('ct125-media-card'))throw new Error('Discover became generic again');
if(!discoverBody.includes('allowed.has(heading)'))throw new Error('Discover target-section guard missing');

const homePaintStart=runtime.indexOf('const base=paintHome;');
const homePaintEnd=runtime.indexOf('/* Deliberately do NOT wrap renderHome',homePaintStart);
const homePaint=runtime.slice(homePaintStart,homePaintEnd);
if(!homePaint.includes('immediateHome126();')||!homePaint.includes('requestAnimationFrame(()=>void refreshHome126())'))throw new Error('Home is not immediate + background');
if(homePaint.includes('await refreshHome126'))throw new Error('Home remote refresh blocks paint');

if(!html.includes('app-v234.js')||!html.includes('r234-official-1.0.26')||html.includes('app-v232.js'))throw new Error('HTML identity mismatch');
if(!sw.includes("const CACHE='ct-web-1.0.26-r234';"))throw new Error('SW cache identity mismatch');
const r=JSON.parse(release);
if(r.version!=='1.0.26'||r.revision!=='r234-official-1.0.26'||r.base!=='r232-official-1.0.24')throw new Error('release identity mismatch');

console.log('TEST_R234_OK baseline-preserved top10-untouched home-nonblocking sports-r123 watchlist-full-single-authority');
