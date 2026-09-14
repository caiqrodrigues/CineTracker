import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('dist'),js=await readFile(resolve(dist,'app-v269.js'),'utf8'),css=await readFile(resolve(dist,'app-v269.css'),'utf8');
const runtime=js.match(/\/\* CT269_HOME_RECOVERY_START \*\/[\s\S]*?\/\* CT269_HOME_RECOVERY_END \*\//)?.[0]||'';
if(!runtime)throw new Error('R269 browser missing Home recovery runtime');
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r269-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const file=resolve(dir,'index.html');
const safe=s=>s.replaceAll('</script>','<\\/script>');
await writeFile(file,`<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#031019;color:#fff;font:14px sans-serif}.home-list{width:760px}.home-section{margin:12px}.stack{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}.media-row{position:relative;min-height:76px;border:1px solid #28546b;border-radius:12px;padding:10px;box-sizing:border-box;background:#071923}.panel-head{display:flex;justify-content:space-between}.legacy-watch-wrap{width:44px}.legacy-watch{width:44px;height:36px;border:1px solid #2d6a89;border-radius:10px;background:#0b3145;color:#bfeaff}
${css.replaceAll('</style>','<\\/style>')}</style></head><body>
<div data-home id="home">
 <div data-home-view="series" class="home-list">
  <section class="home-section" id="histE"><div class="panel-head"><h3>Histórico recente</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum episódio recente.</div></div></section>
  <section class="home-section" id="continue"><div class="panel-head"><h3>Assistir a seguir</h3><small>2</small></div><div class="stack" id="seriesStack">
   <div class="media-row" data-media="tv:10" id="seriesRow1"><div><b>Reacher</b><small>S04E07</small></div></div>
   <div class="legacy-watch-wrap" id="orphanWrap"><button class="legacy-watch" id="orphan" aria-label="Marcar como assistido">✓</button></div>
   <div class="media-row" data-media="tv:11" id="seriesRow2"><div><b>Lanternas</b><small>S01E04</small></div></div>
  </div></section>
 </div>
 <div data-home-view="movies" class="home-list hidden">
  <section class="home-section" id="histM"><div class="panel-head"><h3>Filmes vistos</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum filme recente.</div></div></section>
  <section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3><small>1</small></div><div class="stack"><div class="media-row" data-media="movie:20"><b>Watchlist</b></div></div></section>
 </div>
</div>
<script>
window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__errs.push(String(e.reason)));
let homeCache={history_episodes:[],history_movies:[]};
const route=()=> 'home',localDay=()=> '2026-09-14';
const mediaRow=(x,meta='')=>'<div class="media-row" data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+Number(x.tmdb_id||0)+'"><b>'+(x.media_title||x.title||x.name||'Histórico')+'</b><small>'+meta+'</small></div>';
const movieRow255=x=>'<article class="ct255-home-movie-card" data-ct255-movie="'+Number(x.tmdb_id||0)+'"><button data-media="movie:'+Number(x.tmdb_id||0)+'"><b>'+(x.media_title||x.title||'Filme histórico')+'</b></button></article>';
const rpc=async(name)=>{if(name!=='cinetracker_home_live_v0997_r3')throw new Error('RPC inesperado '+name);return {history_episodes:[{tmdb_id:101,media_title:'Episódio Histórico',season_number:2,episode_number:3}],history_movies:[{tmdb_id:202,media_title:'Filme Histórico',watched_at:'2026-09-13T18:00:00Z'}]}};
let paintHome=()=>{},renderHome=async()=>{};
</script>
<script>${safe(runtime)}</script>
<script>
(async()=>{await window.__ctR269Test.loadHistory(true);window.__ctR269Test.repairHome();setTimeout(()=>{const row=document.querySelector('#seriesRow1'),action=document.querySelector('#orphan'),wrap=document.querySelector('#orphanWrap'),rr=row.getBoundingClientRect(),ar=action.getBoundingClientRect(),cs=getComputedStyle(action);document.body.dataset.actionParent=String(action.parentElement===row);document.body.dataset.orphanWrapperGone=String(!wrap?.isConnected);document.body.dataset.actionPosition=cs.position;document.body.dataset.actionRight=String(Math.abs((rr.right-ar.right)-12)<3);document.body.dataset.actionCentered=String(Math.abs(((ar.top+ar.bottom)/2)-((rr.top+rr.bottom)/2))<3);document.body.dataset.actionInside=String(ar.left>=rr.left&&ar.right<=rr.right&&ar.top>=rr.top&&ar.bottom<=rr.bottom);document.body.dataset.seriesHistory=String(document.querySelectorAll('#histE .media-row').length);document.body.dataset.movieHistory=String(document.querySelectorAll('#histM .ct255-home-movie-card,#histM .media-row').length);document.body.dataset.seriesEmpty=String(!!document.querySelector('#histE .empty'));document.body.dataset.movieEmpty=String(!!document.querySelector('#histM .empty'));document.body.dataset.historySource=String(document.querySelector('#histE').dataset.ct269HistorySource==='r3'&&document.querySelector('#histM').dataset.ct269HistorySource==='r3');document.body.dataset.cacheMerged=String(homeCache.history_episodes.length===1&&homeCache.history_movies.length===1);document.body.dataset.done='1';document.body.dataset.errors=__errs.join('|')},120)})()
</script></body></html>`,'utf8');
try{
 const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'profile')}`,'--window-size=900,900','--virtual-time-budget=2600','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,maxBuffer:12*1024*1024,stdio:['ignore','pipe','pipe']});
 for(const x of['data-done="1"','data-action-parent="true"','data-orphan-wrapper-gone="true"','data-action-position="absolute"','data-action-right="true"','data-action-centered="true"','data-action-inside="true"','data-series-history="1"','data-movie-history="1"','data-series-empty="false"','data-movie-empty="false"','data-history-source="true"','data-cache-merged="true"'])if(!out.includes(x))throw new Error('R269 browser missing '+x);
 const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R269 browser errors '+errors);
 console.log('R269_BROWSER_OK history-restored-from-r3 series-watch-moved-inside-row-right');
}finally{await rm(dir,{recursive:true,force:true})}
