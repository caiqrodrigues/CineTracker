import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('dist'),js=await readFile(resolve(dist,'app-v270.js'),'utf8'),css=await readFile(resolve(dist,'app-v270.css'),'utf8');
const r269=js.match(/\/\* CT269_HOME_RECOVERY_START \*\/[\s\S]*?\/\* CT269_HOME_RECOVERY_END \*\//)?.[0]||'';
const r270=js.match(/\/\* CT270_HOME_REAL_DOM_START \*\/[\s\S]*?\/\* CT270_HOME_REAL_DOM_END \*\//)?.[0]||'';
if(!r269||!r270)throw new Error('R270 browser missing Home runtimes');
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r270-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});
const safe=s=>s.replaceAll('</script>','<\\/script>');
const page=resolve(dir,'index.html');
await writeFile(page,`<!doctype html><html><head><meta charset="utf-8"><style>${css.replaceAll('</style>','<\\/style>')}
body{margin:0;padding:12px}.home-section{margin:8px 0}.stack{display:flex;flex-direction:column;gap:8px}.media-row{position:relative;display:flex;align-items:center;min-height:72px;width:100%;box-sizing:border-box;border:1px solid transparent}.row-wrap{width:100%}.legacy-watch-wrap{display:block;width:100%}
</style></head><body>
<div data-home id="home">
 <div data-home-view="series" id="seriesView">
  <section class="home-section" id="seriesPending"><div class="panel-head"><h3>Assistir a seguir</h3></div>
   <div class="stack">
    <div class="media-row" data-media="tv:1" id="row1"><div><b>Reacher</b><small>S03 E08</small></div></div>
    <span class="ct266-watch-action" data-ct266-watch="episode" id="action1">✓</span>
   </div>
   <div class="row-wrap"><div class="media-row" data-media="tv:2" id="row2"><div><b>Lanternas</b><small>S01 E06</small></div></div></div>
   <div class="legacy-watch-wrap" id="legacyWrap"><span class="ct266-watch-action" data-ct266-watch="episode" id="action2">✓</span></div>
  </section>
  <section class="home-section" id="histE"><div class="panel-head"><h3>Histórico recente</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum episódio recente.</div></div></section>
 </div>
 <div data-home-view="movies" id="moviesView">
  <section class="home-section" id="moviesNext"><div class="panel-head"><h3>Assistir a seguir</h3></div><div class="stack"><div class="media-row" data-media="movie:7"><b>Filme futuro</b></div></div></section>
  <section class="home-section" id="histM"><div class="panel-head"><h3>Filmes vistos</h3><small>0</small></div><div class="stack"><div class="empty">Nenhum filme recente.</div></div></section>
 </div>
</div>
<script>
window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__errs.push(String(e.reason)));
window.route=()=> 'home';window.__ctHomeHistoryPending=true;window.homeCache={__ctHistoryAuthoritative:false,history_episodes:[],history_movies:[]};
window.mediaRow=(x,sub)=>'<div class="media-row" data-media="tv:'+String(x.tmdb_id||0)+'"><b>'+String(x.media_title||x.title||'Histórico')+'</b><small>'+String(sub||'')+'</small></div>';
window.movieRow255=x=>'<div class="media-row" data-media="movie:'+String(x.tmdb_id||0)+'"><b>'+String(x.media_title||x.title||'Filme visto')+'</b></div>';
</script>
<script>${safe(r269)}</script><script>${safe(r270)}</script>
<script>
setTimeout(()=>{
 const s=document.querySelector('#seriesView'),m=document.querySelector('#moviesView');
 document.body.dataset.shellSeriesFirst=String(s.querySelector(':scope > .home-section')?.id==='histE');
 document.body.dataset.shellMoviesFirst=String(m.querySelector(':scope > .home-section')?.id==='histM');
 document.body.dataset.shellVisible=String(!document.querySelector('#histE').hidden&&!document.querySelector('#histM').hidden);
 document.body.dataset.shellLoading=String(document.querySelectorAll('[data-ct270-history-loading]').length===2);
 window.homeCache={__ctHistoryAuthoritative:true,history_episodes:[{tmdb_id:1,media_title:'Reacher visto',title:'Episódio visto',season_number:3,episode_number:7,watched_at:'2026-09-14T12:00:00Z'}],history_movies:[{tmdb_id:99,media_title:'Harry Potter visto',title:'Harry Potter visto',watched_at:'2026-09-14T11:00:00Z'}]};
 window.__ctR270Test.adoptCanonicalHistory(window.homeCache);window.__ctR270Test.repairHome();
 setTimeout(()=>{
  const r1=document.querySelector('#row1'),r2=document.querySelector('#row2'),a1=document.querySelector('#action1'),a2=document.querySelector('#action2');
  const check=(r,a,prefix)=>{const rr=r.getBoundingClientRect(),ar=a.getBoundingClientRect(),st=getComputedStyle(a);document.body.dataset[prefix+'Parent']=String(a.parentElement===r);document.body.dataset[prefix+'Inside']=String(ar.left>=rr.left-1&&ar.right<=rr.right+1&&ar.top>=rr.top-1&&ar.bottom<=rr.bottom+1);document.body.dataset[prefix+'Right']=String(Math.abs((rr.right-ar.right)-10)<=3);document.body.dataset[prefix+'Center']=String(Math.abs(((ar.top+ar.bottom)/2)-((rr.top+rr.bottom)/2))<=3);document.body.dataset[prefix+'Width']=String(Math.abs(ar.width-28)<=1);document.body.dataset[prefix+'Position']=st.position};
  check(r1,a1,'a1');check(r2,a2,'a2');
  document.body.dataset.wrapperGone=String(!document.querySelector('#legacyWrap'));
  document.body.dataset.historySeries=String(document.querySelector('#histE').textContent.includes('Reacher visto')&&!document.querySelector('#histE').textContent.includes('Nenhum episódio'));
  document.body.dataset.historyMovies=String(document.querySelector('#histM').textContent.includes('Harry Potter visto')&&!document.querySelector('#histM').textContent.includes('Nenhum filme'));
  document.body.dataset.historyCounts=String(document.querySelector('#histE .panel-head small').textContent==='1'&&document.querySelector('#histM .panel-head small').textContent==='1');
  document.body.dataset.historyFirst=String(s.querySelector(':scope > .home-section')?.id==='histE'&&m.querySelector(':scope > .home-section')?.id==='histM');
  document.body.dataset.done='1';document.body.dataset.errors=window.__errs.join('|');
 },120);
},120);
</script></body></html>`,'utf8');
try{
 for(const width of [420,1200]){
  const profile=resolve(dir,'profile-'+width);
  const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`,`--window-size=${width},900`,'--virtual-time-budget=2600','--dump-dom','file://'+page],{encoding:'utf8',timeout:30000,maxBuffer:12*1024*1024,stdio:['ignore','pipe','pipe']});
  for(const x of['data-done="1"','data-shell-series-first="true"','data-shell-movies-first="true"','data-shell-visible="true"','data-shell-loading="true"','data-a1-parent="true"','data-a1-inside="true"','data-a1-right="true"','data-a1-center="true"','data-a1-width="true"','data-a1-position="absolute"','data-a2-parent="true"','data-a2-inside="true"','data-a2-right="true"','data-a2-center="true"','data-a2-width="true"','data-a2-position="absolute"','data-wrapper-gone="true"','data-history-series="true"','data-history-movies="true"','data-history-counts="true"','data-history-first="true"'])if(!out.includes(x))throw new Error('R270 browser '+width+' missing '+x);
  const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R270 browser '+width+' errors '+errors);
 }
 console.log('R270_BROWSER_OK latest-video r5-history real-dom-watch mobile+desktop');
}finally{await rm(dir,{recursive:true,force:true})}
