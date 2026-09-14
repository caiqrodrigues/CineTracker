import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const dist=resolve('dist'),js=await readFile(resolve(dist,'app-v272.js'),'utf8'),css=await readFile(resolve(dist,'app-v272.css'),'utf8');
for(const marker of["window.__ctR272='canonical-home-producer+r5-history+direct-watch'",'function ct272HistoryReady(p,histE,histM)','function ct266WatchAction(','function ct266AttachWatch('])if(!js.includes(marker))throw new Error('R272 browser missing shipped code '+marker);
const producerStart=js.indexOf('function ct272HistoryReady('),producerEnd=js.indexOf('function profileRows(',producerStart);
if(producerStart<0||producerEnd<0||producerEnd<=producerStart)throw new Error('R272 browser cannot isolate canonical Home producer');
const producer=js.slice(producerStart,producerEnd);
const watchStart=js.indexOf('function ct266WatchAction('),attachStart=js.indexOf('function ct266AttachWatch(',watchStart),watchEnd=js.indexOf('\nfunction ',attachStart+'function ct266AttachWatch('.length);
if(watchStart<0||attachStart<0||watchEnd<0||watchEnd<=attachStart)throw new Error('R272 browser cannot isolate r266 direct-watch functions');
const watchCode=js.slice(watchStart,watchEnd);
if(producer.includes('paintHome263Base')||watchCode.includes('paintHome263Base'))throw new Error('R272 browser extraction leaked legacy wrappers');
let bin='';for(const c of['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}if(!bin)throw new Error('Chromium unavailable');
const dir='/tmp/ct-r272-browser';await rm(dir,{recursive:true,force:true});await mkdir(dir,{recursive:true});const safe=s=>s.replaceAll('</script>','<\\/script>'),page=resolve(dir,'index.html');
await writeFile(page,`<!doctype html><html><head><meta charset="utf-8"><style>${css.replaceAll('</style>','<\\/style>')}body{margin:0;padding:12px}.home-section{margin:8px 0}.stack{display:flex;flex-direction:column;gap:8px}.media-row{min-height:72px;width:100%;display:flex;align-items:center;box-sizing:border-box}</style></head><body><button id="probe">probe</button><div id="churn"></div><div data-home></div><script>
window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message||e.error)));addEventListener('unhandledrejection',e=>__errs.push(String(e.reason)));
const $=(s,r=document)=>r?.querySelector?.(s)||null;const esc=v=>String(v??'').replace(/[&<>"']/g,'');const esc263=esc;
const mediaRow=(x,meta='')=>'<div class="media-row" data-media="'+String(x?.media_type==='movie'?'movie':'tv')+':'+String(x?.tmdb_id||0)+'"><div><b>'+esc(x?.media_title||x?.title||'Item')+'</b><small>'+esc(meta)+'</small></div><span class="badge">›</span></div>';
let homeCache=null;window.__ctHomeHistoryPending=true;
</script><script>${safe(producer)}</script><script>${safe(watchCode)}</script><script>
try{
 const probe=document.querySelector('#probe'),churn=document.querySelector('#churn');let clicks=0;probe.addEventListener('click',()=>clicks++);
 homeCache={__ctHistoryAuthoritative:false,__ctFastHomeCache:true,series:[{tmdb_id:1,media_type:'tv',title:'Reacher',home_bucket:'continue',watched_episodes:4,released_episodes:5,total_episodes:5}],movie_watchlist:[{tmdb_id:7,media_type:'movie',title:'Filme futuro',release_year:2026}],history_episodes:[],history_movies:[]};window.__ctHomeHistoryPending=true;paintHome();
 let series=document.querySelector('[data-home-view="series"]'),movies=document.querySelector('[data-home-view="movies"]'),pendingHistE=series?.querySelector('[data-ct272-history="episodes"]'),pendingHistM=movies?.querySelector('[data-ct272-history="movies"]');
 document.body.dataset.pendingSeriesFirst=String(series?.querySelector(':scope > .home-section')?.dataset.ct272History==='episodes');
 document.body.dataset.pendingMoviesFirst=String(movies?.querySelector(':scope > .home-section')?.dataset.ct272History==='movies');
 document.body.dataset.pendingLoading=String(document.querySelectorAll('[data-ct272-history-loading]').length===2);
 document.body.dataset.pendingNoFalseEmpty=String(!pendingHistE?.textContent.includes('Nenhum episódio recente.')&&!pendingHistM?.textContent.includes('Nenhum filme recente.'));
 homeCache={__ctHistoryAuthoritative:true,__ctFastHomeCache:false,series:[{tmdb_id:1,media_type:'tv',title:'Reacher',home_bucket:'continue',watched_episodes:4,released_episodes:5,total_episodes:5}],movie_watchlist:[{tmdb_id:7,media_type:'movie',title:'Filme futuro',release_year:2026}],history_episodes:[{id:11,tmdb_id:1,media_title:'Reacher visto',title:'Episódio visto',season_number:3,episode_number:7,watched_at:'2026-09-14T12:00:00Z'}],history_movies:[{id:22,tmdb_id:99,media_title:'Harry Potter visto',title:'Harry Potter visto',watched_at:'2026-09-14T11:00:00Z'}]};window.__ctHomeHistoryPending=false;paintHome();
 series=document.querySelector('[data-home-view="series"]');movies=document.querySelector('[data-home-view="movies"]');
 const continueSec=[...(series?.querySelectorAll(':scope > .home-section')||[])].find(x=>x.querySelector('h3')?.textContent==='Assistir a seguir'),row=continueSec?.querySelector('.media-row');
 ct266AttachWatch(row,'episode',1,3,8,'Reacher');const action=row?.querySelector(':scope > [data-ct266-watch]');const rr=row?.getBoundingClientRect(),ar=action?.getBoundingClientRect(),st=action?getComputedStyle(action):null;
 document.body.dataset.historySeriesFirst=String(series?.querySelector(':scope > .home-section')?.dataset.ct272History==='episodes');
 document.body.dataset.historyMoviesFirst=String(movies?.querySelector(':scope > .home-section')?.dataset.ct272History==='movies');
 document.body.dataset.historySeries=String(!!series?.querySelector('[data-ct272-history="episodes"]')?.textContent.includes('Reacher visto'));
 document.body.dataset.historyMovies=String(!!movies?.querySelector('[data-ct272-history="movies"]')?.textContent.includes('Harry Potter visto'));
 document.body.dataset.historyCounts=String(series?.querySelector('[data-ct272-history="episodes"] small')?.textContent==='1'&&movies?.querySelector('[data-ct272-history="movies"] small')?.textContent==='1');
 document.body.dataset.watchParent=String(action?.parentElement===row);document.body.dataset.watchPosition=String(st?.position||'');document.body.dataset.watchInside=String(!!rr&&!!ar&&ar.left>=rr.left-1&&ar.right<=rr.right+1&&ar.top>=rr.top-1&&ar.bottom<=rr.bottom+1);
 for(let i=0;i<500;i++){const n=document.createElement('i');n.textContent=String(i);churn.appendChild(n);n.remove()}for(let i=0;i<100;i++)probe.click();
 setTimeout(()=>{document.body.dataset.clicks=String(clicks);document.body.dataset.timer='fired';document.body.dataset.errors=window.__errs.join('|');document.body.dataset.done='1'},120);
}catch(e){window.__errs.push(String(e?.stack||e));document.body.dataset.errors=window.__errs.join('|');document.body.dataset.done='1'}
</script></body></html>`,'utf8');
try{for(const width of [420,1200]){const out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${resolve(dir,'p'+width)}`,`--window-size=${width},900`,'--virtual-time-budget=1800','--dump-dom','file://'+page],{encoding:'utf8',timeout:20000,maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']});const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'';if(errors)throw new Error('R272 browser '+width+' errors '+errors);for(const x of['data-done="1"','data-pending-series-first="true"','data-pending-movies-first="true"','data-pending-loading="true"','data-pending-no-false-empty="true"','data-history-series-first="true"','data-history-movies-first="true"','data-history-series="true"','data-history-movies="true"','data-history-counts="true"','data-watch-parent="true"','data-watch-position="absolute"','data-watch-inside="true"','data-clicks="100"','data-timer="fired"'])if(!out.includes(x))throw new Error('R272 browser '+width+' missing '+x)}console.log('R272_BROWSER_OK exact-producer exact-r266-watch history-first responsive mobile+desktop')}finally{await rm(dir,{recursive:true,force:true})}
