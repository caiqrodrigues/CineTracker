import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
const patch=(await readFile(resolve(root,'apps/web/runtime-r232-v124-web-final.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-v124',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const data={rows:[
 {media_type:'movie',tmdb_id:1,title:'Movie A',release_year:2024,poster_path:'/a.jpg',genre_ids:[28],added_at:'2026-09-01T00:00:00Z'},
 {media_type:'movie',tmdb_id:2,title:'Movie B',release_year:2020,poster_path:'/b.jpg',genre_ids:[53],added_at:'2026-08-01T00:00:00Z'},
 {media_type:'tv',tmdb_id:3,title:'Series A',release_year:2022,poster_path:'/c.jpg',genre_ids:[80],added_at:'2026-07-01T00:00:00Z'}
]};
const pools={movie:[{media_type:'movie',tmdb_id:99,title:'Absolut',release_date:'2025-05-01',genre_ids:[878,53]}],series:[],anime:[]};
const html=`<!doctype html><html><body><div id="app">
<div data-page="discover" data-discover><div id="legend">REGRA ATIVA Personalizado · respeita histórico, progresso e Watchlist</div><section><h2>100% novos</h2><button id="loose">↻</button><article id="dcard"><img src="x"><b>Absolut</b><small>Filme · ★ 8.1</small><button>＋</button></article><div id="empty">Sem item elegível</div></section></div>
<div class="event-grid"><article id="sport" class="ct123-sports-card"><div class="ct123-actions"><button class="ct123-action secondary">Eventos</button><button class="ct123-action primary">✓ Assistido</button></div></article></div>
<div data-profile><section><div class="panel-head"><h2>Estatísticas</h2><button>Recolher</button></div></section><button class="stat" data-ct122-watchlist="series"><small>Séries Watchlist</small><b>564</b></button><button class="stat" data-ct122-watchlist="movie"><small>Filmes Watchlist</small><b>1.358</b></button></div>
</div><script>
window.setInterval=()=>0;window.MutationObserver=class{observe(){}};let profileCache={dashboard:[]};
function mediaTmdb(x){return Number(x?.tmdb_id||0)}function mediaType(x){return x?.media_type==='movie'?'movie':'tv'}
window.__ctV121FullWatchlist=async()=>(${JSON.stringify(data)});window.__ctV118LastPools=${JSON.stringify(pools)};
window.__ctV122MetadataRun=async()=>{};async function safeTmdb(){return {}}function go(p){document.body.dataset.go=p}
</script><script>${patch}</script><script>(async()=>{try{
 await window.__ctV124Sync();await new Promise(r=>setTimeout(r,120));
 document.body.dataset.legend=String(!!document.querySelector('#legend'));
 document.body.dataset.empty=document.querySelector('#empty')?.textContent||'';
 document.body.dataset.loose=String(!!document.querySelector('#loose')?.closest('.ct122-media-actions'));
 document.body.dataset.meta=document.querySelector('#dcard .ct122-card-meta')?.textContent||'';
 document.body.dataset.mc=document.querySelector('[data-ct124-watchlist="movie"] b')?.textContent||'';
 document.body.dataset.sc=document.querySelector('[data-ct124-watchlist="series"] b')?.textContent||'';
 document.body.dataset.sport=Array.from(document.querySelectorAll('#sport .ct123-action')).map(x=>x.textContent.trim()).join('|');
 const m=await window.__ctV124OpenWatchlist('series');await new Promise(r=>setTimeout(r,50));
 document.body.dataset.rows=String(m.querySelectorAll('.ct124-wl-row').length);
 document.body.dataset.rowtext=m.querySelector('.ct124-wl-row')?.textContent||'';
 document.body.dataset.count=m.querySelector('[data-ct124-count]')?.textContent||'';
 m.querySelector('.ct124-wl-row')?.click();await new Promise(r=>setTimeout(r,20));
 document.body.dataset.path=document.body.dataset.go||'';
 }catch(e){document.body.dataset.err=String(e?.stack||e)}finally{document.body.dataset.done='1'}})()</script></body></html>`;
await writeFile(file,html);
let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=1600','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
const must=['data-done="1"','data-legend="false"','data-empty="Sem item elegível"','data-loose="true"','data-meta="2025 · Ficção científica, Suspense"','data-mc="2"','data-sc="1"','data-sport="Eventos|✓ Assistido"','data-rows="1"','data-count="1"','data-path="/series/3"'];
for(const m of must)if(!out.includes(m))throw new Error('V124 missing '+m+'\n'+out.slice(-5000));
if(!out.includes('Series A'))throw new Error('V124 Watchlist row missing Series A');
if(out.includes('data-err='))throw new Error('V124 runtime error');
console.log('V124_WEB_FINAL_BROWSER_OK discover=semantic-empty+metadata+actions profile=exact-counts+modal+navigate sports=v123-preserved');
