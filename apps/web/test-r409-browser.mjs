import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
if(process.env.CT_R409_SKIP_BUILD!=='1')await import('./build-r409.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const runtime=(await Promise.all(['01','02','03','04c1','04c2','04c3','04c4','04c5','04c6','04c7','04c8'].map(i=>readFile(resolve('runtime-r409-part'+i+'.txt'),'utf8')))).join('').replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head><style>body{margin:0}.history{height:1200px}[data-home-view] section{display:block}.hidden{display:none!important}</style></head><body>
<div data-home><div class="home-tabs"><button class="active" data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div><div data-home-view="series"><section class="history" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>1</small></div><div class="ct274-history-stack"><div class="media-row ct274-media-card" data-media="tv:10"><div class="ct274-row-copy"><b>Show</b><small class="ct274-meta">S01E03</small><small class="ct274-sub">Assistido 1x</small></div></div></div></section><section data-ct406-bucket="continue"><div class="panel-head"><h3>Assistir a seguir</h3></div><div class="stack"><div class="media-row ct274-media-card" data-media="tv:10" data-ct274-tmdb="10" data-ct274-season="1" data-ct274-episode="4"><div class="ct274-row-copy"><b>Show</b><small class="ct274-meta">S01E04 • Ep: Quatro</small><small class="ct274-sub">2 episódios disponíveis para ver</small></div><button type="button" data-ct279-watch="episode" data-tmdb="10" data-season="1" data-episode="4" data-title="Show">✓</button></div></div></section></div><div data-home-view="movies" hidden class="hidden"><section data-ct406-movie-watch><h3>Assistir a seguir / Watchlist</h3></section></div></div>
<div id="discover" style="display:none"><button class="active" data-ct319-tab="foryou">Pra você</button><div data-ct319-content></div></div>
<script>
var currentRoute='home',route=()=>currentRoute,session={access_token:'x'},homeCache={history_episodes:[]},profileCache=null,discoverCache=new Map(),toast=()=>{};
var seriesState=[{tmdb_id:10,media_type:'tv',title:'Show',home_bucket:'continue',watched_episodes:3,available_episodes:2,next_season_number:1,next_episode_number:4,next_episode_title:'Quatro'}];
window.__ctR406={getSeries:()=>seriesState,setSeries:(v)=>{seriesState=v;return v},loadSeries:async()=>seriesState};
var ensureMedia=async()=>({id:99,title:'Show'});
var ct274SeasonData=async()=>({episodes:[{episode_number:4,name:'Quatro',air_date:'2026-09-20',vote_average:7},{episode_number:5,name:'Cinco',air_date:'2026-09-27',vote_average:8}]});
var ct274HistoryRows=(eps)=>eps.map(x=>'<div class="media-row ct274-media-card"><div class="ct274-row-copy"><b>'+x.media_title+'</b><small class="ct274-meta">S01E04</small></div></div>').join('');
var ct288Card=x=>'<article data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id+'"><b>'+x.title+'</b></article>';
window.__ctR365={persistDirect:async()=>true};
var watchPersistResolve;var watchPersist=new Promise(r=>watchPersistResolve=r);
var rpc=async(name,args)=>{if(name==='cinetracker_mark_watch_v0994')return watchPersist;if(name==='cinetracker_home_history_v324')return{history_episodes:[{media_title:'Show',tmdb_id:10,season_number:1,episode_number:4}]};if(name==='cinetracker_discover_foryou_v396')throw new Error('primary fail');const m=(type,id,title,kind)=>({media_type:type,media_kind:kind,tmdb_id:id,title});if(name==='cinetracker_discover_watch_unseen_v396')return[m(args.p_kind==='movie'?'movie':'tv',20+(args.p_kind==='series'?1:args.p_kind==='anime'?2:0),'W-'+args.p_kind,args.p_kind==='anime'?'anime':null),m(args.p_kind==='movie'?'movie':'tv',30+(args.p_kind==='series'?1:args.p_kind==='anime'?2:0),'W2-'+args.p_kind,args.p_kind==='anime'?'anime':null)];if(name==='cinetracker_discover_fresh_v387')return[m(args.p_kind==='movie'?'movie':'tv',40+(args.p_kind==='series'?1:args.p_kind==='anime'?2:0),'F-'+args.p_kind,args.p_kind==='anime'?'anime':null),m(args.p_kind==='movie'?'movie':'tv',50+(args.p_kind==='series'?1:args.p_kind==='anime'?2:0),'F2-'+args.p_kind,args.p_kind==='anime'?'anime':null)];throw new Error(name)};
</script><script>${runtime}</script><script>
setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 window.__ctR409.alignHome('series',true);
 await new Promise(r=>setTimeout(r,80));
 const main=document.querySelector('[data-ct406-bucket="continue"]');
 ok(main.getBoundingClientRect().top>=0&&main.getBoundingClientRect().top<100,'Home not aligned to Assistir a seguir');
 const button=document.querySelector('[data-ct279-watch]');
 const pending=window.__ctR409.markWatched(button);
 ok(seriesState[0].watched_episodes===4,'watched not optimistic before RPC');
 ok(seriesState[0].available_episodes===1,'count not optimistic before RPC');
 ok(seriesState[0].next_episode_number===5,'next episode not advanced before RPC');
 ok(document.querySelectorAll('[data-ct409-optimistic-history]').length===1,'history not optimistic before RPC');
 watchPersistResolve({ok:true});
 await pending;
 ok(seriesState[0].watched_episodes===4,'watched changed after reconcile');
 ok(seriesState[0].available_episodes===1,'count changed after reconcile');
 ok(seriesState[0].next_episode_number===5,'next episode changed after reconcile');
 currentRoute='discover';document.querySelector('[data-home]').style.display='none';document.querySelector('#discover').style.display='block';
 await window.__ctR409.loadForYou(true);
 const root=document.querySelector('[data-ct409-foryou]');
 ok(root,'ForYou missing');
 ok(root.querySelectorAll('[data-ct409-action="swap"]').length===7,'Trocar missing');
 ok(root.querySelectorAll('[data-ct409-action]').length===18,'actions incomplete');
 ok([...root.querySelectorAll('[data-ct409-action="swap"]')].every(x=>x.textContent.includes('Trocar')),'Trocar labels missing');
 ok(!document.body.innerText.includes('Buscando indicação'),'loading stuck');
 document.documentElement.dataset.ct409probe='1'
}catch(e){document.documentElement.dataset.ct409err=String(e.message||e)}},300);
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=6500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));if(!/data-ct409probe="1"/.test(out))throw new Error((out.match(/data-ct409err="([^"]*)"/)||[])[1]||'r409 probe failed');console.log('R409_BROWSER_OK');
