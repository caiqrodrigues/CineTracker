import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('dist'),js=await readFile(resolve(dist,'app-v272.js'),'utf8'),css=await readFile(resolve(dist,'app-v272.css'),'utf8');
const producerMatch=js.match(/function ct272HistoryReady\(p,histE,histM\)\{[\s\S]*?\nfunction profileRows/);
if(!producerMatch)throw new Error('R272 browser missing canonical producer');
const producer=producerMatch[0].replace(/\nfunction profileRows$/,'');
const watchAction=js.match(/function ct266WatchAction\(kind,tmdb,s=0,e=0,title=''\)\{[\s\S]*?\n\}/)?.[0]||'';
const watchAttach=js.match(/function ct266AttachWatch\(el,kind,tmdb,s=0,e=0,title=''\)\{[\s\S]*?\n\}/)?.[0]||'';
if(!watchAction||!watchAttach)throw new Error('R272 browser missing direct watched producer');
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r272-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const safe=s=>s.replaceAll('</script>','<\\/script>'),page=resolve(dir,'index.html');
await writeFile(page,`<!doctype html><html><head><meta charset="utf-8"><style>${css.replaceAll('</style>','<\\/style>')}body{margin:0;padding:12px}.home-section{margin:8px 0}.stack{display:flex;flex-direction:column;gap:8px}.media-row{min-height:72px;width:100%;display:flex;align-items:center;box-sizing:border-box;border:1px solid transparent}</style></head><body>
<button id="probe">probe</button><div id="churn"></div><div data-home></div>
<script>
window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__errs.push(String(e.reason)));
const $=(s,r=document)=>r.querySelector(s);const esc=v=>String(v??'').replace(/[&<>"']/g,'');const esc263=esc;
const mediaRow=(x,meta='')=>'<div class="media-row" data-media="'+String(x.media_type==='movie'?'movie':'tv')+':'+String(x.tmdb_id||0)+'"><div><b>'+esc(x.media_title||x.title||'Item')+'</b><small>'+esc(meta)+'</small></div><span class="badge">›</span></div>';
let homeCache=null;window.__ctHomeHistoryPending=true;
</script><script>${safe(producer)}</script><script>${safe(watchAction+'\n'+watchAttach)}</script>
<script>
const probeEl=document.querySelector('#probe'),churnEl=document.querySelector('#churn');let clicks=0;probeEl.addEventListener('click',()=>clicks++);
try{
 homeCache={__ctHistoryAuthoritative:false,__ctFastHomeCache:true,series:[{tmdb_id:1,media_type:'tv',title:'Reacher',home_bucket:'continue',watched_episodes:4,released_episodes:5,total_episodes:5}],movie_watchlist:[{tmdb_id:7,title:'Filme futuro',release_year:2026}],history_episodes:[],history_movies:[]};
 paintHome();
 const series=document.querySelector('[data-home-view="series"]'),movies=document.querySelector('[data-home-view="movies"]');
 document.body.dataset.pendingSeriesFirst=String(series.querySelector(':scope > .home-section')?.dataset.ct272History==='episodes');
 document.body.dataset.pendingMoviesFirst=String(movies.querySelector(':scope > .home-section')?.dataset.ct272History==='movies');
 document.body.dataset.pendingLoading=String(document.querySelectorAll('[data-ct272-history-loading]').length===2);
 document.body.dataset.pendingNoFalseEmpty=String(!document.body.textContent.includes('Nenhum episódio recente.')&&!document.body.textContent.includes('Nenhum filme recente.'));
 window.__ctHomeHistoryPending=false;
 homeCache={__ctHistoryAuthoritative:true,__ctFastHomeCache:false,series:[{tmdb_id:1,media_type:'tv',title:'Reacher',home_bucket:'continue',watched_episodes:4,released_episodes:5,total_episodes:5}],movie_watchlist:[{tmdb_id:7,title:'Filme futuro',release_year:2026}],history_episodes:[{tmdb_id:1,media_title:'Reacher visto',season_number:3,episode_number:7,watched_at:'2026-09-14T12:00:00Z'}],history_movies:[{tmdb_id:99,media_title:'Harry Potter visto',watched_at:'2026-09-14T11:00:00Z'}]};
 paintHome();
 const s2=document.querySelector('[data-home-view="series"]'),m2=document.querySelector('[data-home-view="movies"]');
 const continueSec=[...s2.querySelectorAll(':scope > .home-section')].find(x=>x.querySelector('h3')?.textContent==='Assistir a seguir'),row=continueSec?.querySelector('.media-row');
 ct266AttachWatch(row,'episode',1,3,8,'Reacher');const action=row?.querySelector(':scope > .ct266-watch-action');
 const rr=row?.getBoundingClientRect(),ar=action?.getBoundingClientRect(),st=action?getComputedStyle(action):null;
 document.body.dataset.historySeriesFirst=String(s2.querySelector(':scope > .home-section')?.dataset.ct272History==='episodes');
 document.body.dataset.historyMoviesFirst=String(m2.querySelector(':scope > .home-section')?.dataset.ct272History==='movies');
 document.body.dataset.historySeries=String(s2.querySelector('[data-ct272-history="episodes"]')?.textContent.includes('Reacher visto'));
 document.body.dataset.historyMovies=String(m2.querySelector('[data-ct272-history="movies"]')?.textContent.includes('Harry Potter visto'));
 document.body.dataset.historyCounts=String(s2.querySelector('[data-ct272-history="episodes"] small')?.textContent==='1'&&m2.querySelector('[data-ct272-history="movies"] small')?.textContent==='1');
 document.body.dataset.watchParent=String(action?.parentElement===row);
 document.body.dataset.watchPosition=String(st?.position||'');
 document.body.dataset.watchInside=String(!!rr&&!!ar&&ar.left>=rr.left-1&&ar.right<=rr.right+1&&ar.top>=rr.top-1&&ar.bottom<=rr.bottom+1);
 for(let i=0;i<500;i++){const n=document.createElement('i');n.textContent=String(i);churnEl.appendChild(n);n.remove()}for(let i=0;i<100;i++)probeEl.click();
 setTimeout(()=>{document.body.dataset.clicks=String(clicks);document.body.dataset.timer='fired';document.body.dataset.errors=__errs.join('|');document.body.dataset.done='1'},120);
}catch(e){__errs.push(String(e?.stack||e));document.body.dataset.errors=__errs.join('|');document.body.dataset.done='1'}
</script></body></html>`,'utf8');
try{for(const width of [420,1200]){const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'p'+width)}`,`--window-size=${width},900`,'--virtual-time-budget=2600','--dump-dom','file://'+page],{encoding:'utf8',timeout:30000,maxBuffer:14*1024*1024,stdio:['ignore','pipe','pipe']});const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R272 browser '+width+' errors '+errors);for(const x of['data-done="1"','data-pending-series-first="true"','data-pending-movies-first="true"','data-pending-loading="true"','data-pending-no-false-empty="true"','data-history-series-first="true"','data-history-movies-first="true"','data-history-series="true"','data-history-movies="true"','data-history-counts="true"','data-watch-parent="true"','data-watch-position="absolute"','data-watch-inside="true"','data-clicks="100"','data-timer="fired"'])if(!out.includes(x))throw new Error('R272 browser '+width+' missing '+x)}console.log('R272_BROWSER_OK producer-history-first r5-data direct-watch responsive mobile+desktop')}finally{await rm(dir,{recursive:true,force:true})}
