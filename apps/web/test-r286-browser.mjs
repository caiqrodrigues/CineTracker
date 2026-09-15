import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
await import('./build-r286-official.mjs');
const runtime=await readFile(resolve('runtime-r286-related-actions.js'),'utf8');
let bin='';for(const x of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}
if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r286-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});
const page=resolve(dir,'index.html'),safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(page,`<!doctype html><html><head><meta charset="utf-8"></head><body>
<section class="ct169-detail-section" id="related"><div class="ct169-section-head"><h2>Títulos semelhantes</h2><span>4</span></div><div class="ct169-related-row">
 <article class="ct169-related-card ct170-related-card" id="movie-open"><button class="ct169-related-open" data-media="movie:101"><span class="poster">Filme 101</span></button><div class="ct169-related-actions"><button data-ct169-related-watch="movie:101">＋ Watchlist</button><button data-ct169-related-seen="movie:101">✓ Visto</button></div></article>
 <article class="ct169-related-card ct170-related-card" id="tv-open"><button class="ct169-related-open" data-media="tv:202"><span>Série 202</span></button><div class="ct169-related-actions"><button data-ct169-related-watch="tv:202">＋ Watchlist</button><button data-ct169-related-seen="tv:202">✓ Visto</button></div></article>
 <article class="ct169-related-card ct170-related-card" id="movie-watch"><button class="ct169-related-open" data-media="movie:303">Filme 303</button><div class="ct169-related-actions"><button data-ct169-related-watch="movie:303">＋ Watchlist</button><button data-ct169-related-seen="movie:303">✓ Visto</button></div></article>
 <article class="ct169-related-card ct170-related-card" id="tv-seen"><button class="ct169-related-open" data-media="tv:404">Série 404</button><div class="ct169-related-actions"><button data-ct169-related-watch="tv:404">＋ Watchlist</button><button data-ct169-related-seen="tv:404">✓ Visto</button></div></article>
</div></section>
<script>
window.__errors=[];window.__nav=[];window.__watch=[];window.__seen=[];window.__legacy=0;
addEventListener('error',e=>__errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__errors.push(String(e.reason||e)));
function go(path){__nav.push(path)}
async function addWatchlist(type,id){__watch.push(type+':'+id);await new Promise(r=>setTimeout(r,15))}
async function markSeen(type,id){__seen.push(type+':'+id);await new Promise(r=>setTimeout(r,15))}
function toast(){}
document.addEventListener('click',e=>{if(e.target.closest?.('.ct169-related-card'))window.__legacy++},true);
</script><script>${safe(runtime)}</script><script>
(async()=>{
 const fire=el=>{el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch'}));el.dispatchEvent(new MouseEvent('click',{bubbles:true}))};
 fire(document.querySelector('#movie-open .poster'));
 fire(document.querySelector('#tv-open .ct169-related-open'));
 fire(document.querySelector('#movie-watch [data-ct169-related-watch]'));
 fire(document.querySelector('#tv-seen [data-ct169-related-seen]'));
 await new Promise(r=>setTimeout(r,80));
 document.body.dataset.nav=__nav.join('|');document.body.dataset.watch=__watch.join('|');document.body.dataset.seen=__seen.join('|');
 document.body.dataset.movieOpen=String(__nav.filter(x=>x==='/movie/101').length===1);
 document.body.dataset.tvOpen=String(__nav.filter(x=>x==='/series/202').length===1);
 document.body.dataset.watchOnce=String(__watch.filter(x=>x==='movie:303').length===1);
 document.body.dataset.seenOnce=String(__seen.filter(x=>x==='tv:404').length===1);
 document.body.dataset.watchRemoved=String(!document.querySelector('#movie-watch'));
 document.body.dataset.seenRemoved=String(!document.querySelector('#tv-seen'));
 document.body.dataset.count=String(document.querySelector('#related .ct169-section-head span')?.textContent||'');
 document.body.dataset.legacyBlocked=String(__legacy===0);
 document.body.dataset.errors=__errors.join('|');document.body.dataset.done='1';
})();
</script></body></html>`,'utf8');
try{
 for(const width of[420,1200]){
  const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking',`--window-size=${width},900`,'--virtual-time-budget=900','--dump-dom','file://'+page],{encoding:'utf8',timeout:30000,maxBuffer:10*1024*1024,stdio:['ignore','pipe','pipe']});
  for(const x of['data-done="1"','data-movie-open="true"','data-tv-open="true"','data-watch-once="true"','data-seen-once="true"','data-watch-removed="true"','data-seen-removed="true"','data-count="2"','data-legacy-blocked="true"'])if(!out.includes(x))throw new Error('R286_BROWSER '+width+' missing '+x+' '+(out.match(/<body[^>]*>/)?.[0]||''));
  const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R286_BROWSER '+width+' errors '+errors);
 }
 console.log('R286_BROWSER_OK movie+series open watchlist seen exactly-once legacy-blocked mobile+desktop');
}finally{await rm(dir,{recursive:true,force:true})}
