import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd()),patch=(await readFile(resolve(root,'apps/web/runtime-r220-v114-watchlist-stats-icons.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v114-browser';await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const pre=`<script>
const mediaTmdb=x=>Number(x?.tmdb_id||x?.id||0),mediaType=x=>x?.media_type==='movie'?'movie':'tv';
let ct186ContextValue={},ct186ContextAt=1,ct186LocalBlocked=new Set(),ct166SwapIndex={},ct186ForYouData={};
const c={dash:[
 {tmdb_id:11,media_type:'movie',media_kind:'movie',title:'Sparse Movie',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:22,media_type:'tv',media_kind:'series',title:'Sparse Series',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:33,media_type:'tv',media_kind:'anime',title:'Sparse Anime',is_watchlist:true,raw_tmdb:{}},
 {tmdb_id:44,media_type:'movie',media_kind:'movie',title:'Started',is_watchlist:true,is_seen:true,raw_tmdb:{}}
]};
async function ct186Context(){return c} function ct186WatchPools(){return{movie:[],series:[],anime:[]}} function ct186WatchEligible(){return true}
window.__ctV113Quality=x=>Number(x.vote_average)>7.8&&Number(String(x.release_date||x.first_air_date).slice(0,4))>1990&&!(x.genre_ids||[]).some(g=>[18,99,10766].includes(Number(g)));
window.__ctV113MemoryBlocked=()=>false;
async function safeTmdb(path){const id=Number(path.split('/').pop()),tv=path.includes('/tv/');return{id,vote_average:8.7,poster_path:'/p.jpg',release_date:tv?undefined:'2020-01-01',first_air_date:tv?'2021-01-01':undefined,genres:[{id:tv&&id===33?16:35}],origin_country:tv&&id===33?['JP']:['US']}}
async function addWatchlist(){return true} let swapCalls=0;window.__ctR237SwapNow=()=>{swapCalls++;return true};
async function rpc(){return{}} function paintDiscover(){} function ct186PaintCurrent(){}
</script>`;
const html=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="app">
<div data-profile>
<section class="panel ct-r180-stats-panel"><div class="panel-head"><h2>Estatísticas</h2><button data-ct-r180-stats-toggle><span>Recolher</span><b>⌃</b></button></div><div data-ct-r180-stats-body><div class="stats"><div class="stat">A</div></div></div></section>
<section class="panel"><div class="panel-head"><h2>Estatísticas de esportes</h2><button>Recolher</button></div><div class="stats"><div class="stat">B</div></div></section>
</div>
<section id="ct-f1-v111"><div class="ct111-f1-head"><h2>F1 Hub</h2><button data-ct113-f1-toggle>Recolher</button><div class="ct111-f1-tabs"><button data-ct113-f1-grid>Grid de largada</button></div></div><div data-ct111-f1-body>GRID</div></section>
<div class="ct166-slot" data-ct241-slot-key="fresh:movie"><div data-media="movie:999"></div><button>Trocar</button><button id="add">＋ Watchlist</button></div>
</div>${pre}<script>${patch}</script><script>(async()=>{try{
 const cc=await ct186Context(true),p=ct186WatchPools(cc);document.body.dataset.wm=String(p.movie?.[0]?.tmdb_id||0);document.body.dataset.ws=String(p.series?.[0]?.tmdb_id||0);document.body.dataset.wa=String(p.anime?.[0]?.tmdb_id||0);document.body.dataset.started=String(p.movie?.some(x=>Number(x.tmdb_id)===44));
 await addWatchlist('movie',999);document.body.dataset.swap=String(swapCalls);
 await new Promise(r=>setTimeout(r,80));window.__ctV114SyncStats();const main=document.querySelector('[data-ct-r180-stats-body]'),sports=[...document.querySelectorAll('[data-ct114-stats-group="sports"]')][0],st=document.querySelector('[data-ct-r180-stats-toggle]'),f1=document.querySelector('[data-ct113-f1-toggle]');
 document.body.dataset.unified=document.querySelector('[data-profile]').dataset.ct114StatsUnified||'0';document.body.dataset.statsIcon=/^[⌃⌄]$/.test(st.textContent.trim())?'1':'0';document.body.dataset.f1Icon=/^[⌃⌄]$/.test(f1.textContent.trim())?'1':'0';document.body.dataset.grid=String(!!document.querySelector('[data-ct113-f1-grid]'));
 main.classList.add('hidden');window.__ctV114SyncStats();document.body.dataset.sportsHidden=String(sports?.classList.contains('ct114-stats-hidden'));
 }catch(e){document.body.dataset.err=String(e.message||e)}finally{document.body.dataset.done='1'}})()</script></body></html>`;
await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser']){try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1800','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(out)break}catch{}}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const must of ['data-done="1"','data-wm="11"','data-ws="22"','data-wa="33"','data-started="false"','data-swap="1"','data-unified="1"','data-stats-icon="1"','data-f1-icon="1"','data-grid="true"','data-sports-hidden="true"'])if(!out.includes(must))throw new Error('V114 contract missing '+must+'\n'+out.slice(-7000));
if(out.includes('data-err='))throw new Error('V114 browser runtime error');
console.log('V114_BROWSER_OK watchlist=sparse-enriched movie+series+anime add=instant-swap stats=web-unified icon-only f1=icon-only grid=preserved');
