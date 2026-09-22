import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r335.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v335.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',diag+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR335,T=window.__ctR321Test,R=window.__ctR321;
 if(!(X&&T&&R))throw new Error('r335 bridges unavailable '+(window.__ctDiagErrors||[]).join(' || '));
 ok(window.__ctOfficialVersion==='1.0.126','web version stale');

 // HOME: both histories are normal page content above their landing sections.
 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
 '<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series"><section class="home-section ct274-history is-collapsed" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct274-history-stack"><div data-at="old">antigo</div><div data-at="new">recente</div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div><div style="height:120px">seguir</div></section></div>'+
 '<div data-home-view="movies" class="hidden" hidden><section class="home-section ct274-history is-collapsed" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct274-history-stack"><div data-at="old">Tron: O Legado</div><div data-at="new">Na Zona Cinzenta</div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3></div><div style="height:120px">watchlist</div></section></div>'+
 '</div></div>';
 X.normalizeHistory();
 ok(!document.querySelector('[data-ct275-history-toggle],[data-ct324-history-toggle]'),'history button survived');
 const mh=document.querySelector('[data-ct274-history="movies"]');
 ok(mh.querySelector('.ct274-history-stack').lastElementChild.dataset.at==='new','newest movie is not nearest the landing anchor');
 ok(getComputedStyle(mh.querySelector('.ct274-history-stack')).overflow==='visible','Home history kept nested scrolling');

 X.rememberHomeTab('movies',1800);X.applyHomeTab('movies');X.applyHomeTab('series');
 await new Promise(r=>setTimeout(r,30));
 ok(document.querySelector('[data-home-tab="movies"]').classList.contains('active'),'stale repaint switched Filmes back to Séries');
 ok(!document.querySelector('[data-home-view="movies"]').classList.contains('hidden'),'movie view hidden after stale series request');
 X.alignHome('movies');
 ok(document.querySelector('[data-home-view="movies"] .home-section:not([data-ct274-history])').dataset.ct335HomeAnchor==='1','movie landing anchor not applied');

 // DISCOVER: temporary top filters disappear completely and do not come back.
 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><div class="ct319-tab-shell"><div data-ct319-tabs><button data-ct319-tab="foryou">Pra você</button><button data-ct319-tab="trending">Em alta</button></div><button data-ct319-filter>Filtro</button></div><div data-ct319-types class="open"><button>Todos</button><button>Filmes</button><button>Séries</button><button>Animes</button></div><div data-ct319-content></div></div>'+
 '<div data-ct309-foryou><div class="ct309-slot" data-ct309-slot="fresh:movie"><div class="ct309-actions" style="width:176px"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button></div></div></div></div>';
 T.setDiscover('foryou','all');X.normalizeDiscover();
 const types=document.querySelector('[data-ct319-types]');
 ok(types.hidden&&types.children.length===0,'top filter strip survived');
 ok(getComputedStyle(types).display==='none','top filter strip still occupies layout');
 ok(!document.querySelector('[data-ct319-filter]'),'old filter trigger survived');
 X.normalizeActions();
 const row=document.querySelector('.ct309-actions'),btns=[...row.querySelectorAll(':scope > button')];
 ok(btns.length===3,'Trocar button was not restored');
 ok(btns[2].textContent.includes('Trocar'),'third action is not Trocar');
 ok(new Set(btns.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'ForYou actions wrapped');
 ok(btns.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'ForYou action text wraps');
 for(let i=0;i<40;i++)X.normalizeDiscover();
 ok(row.querySelectorAll(':scope > button').length===3,'normalization duplicated actions');
 ok(types.children.length===0,'normalization recreated top filters');

 // STRICT PRA VOCE: r309 may supply pools, but final DOM must be r329 after exact filtering.
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.1,release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 const watchState={
  watchPools:{movie:[media(201,'movie','Watch Movie')],series:[media(202,'tv','Watch Series')],anime:[media(203,'tv','Watch Anime',{genre_ids:[16],origin_country:['JP']})]},
  freshPools:{movie:[media(10,'movie','Seen Movie'),media(11,'movie','Movie 11'),media(12,'movie','Movie 12'),media(13,'movie','Movie 13'),media(14,'movie','Movie 14'),media(15,'movie','Movie 15')],
    series:[media(21,'tv','Series 21'),media(22,'tv','Series 22'),media(23,'tv','Series 23')],
    anime:[media(31,'tv','Anime 31',{genre_ids:[16],origin_country:['JP']}),media(32,'tv','Anime 32',{genre_ids:[16],origin_country:['JP']}),media(33,'tv','Anime 33',{genre_ids:[16],origin_country:['JP']})]},
  dailyPool:[media(16,'movie','Daily 16')],watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0
 };
 window.__ctR309Test.setForYouState(watchState);
 T.setTestBridge({
  exact:async items=>({
   blocked_keys:items.filter(x=>x.tmdb_id===10||x.tmdb_id===201||x.tmdb_id===202||x.tmdb_id===203).map(x=>x.media_type+':'+x.tmdb_id),
   watch_keys:['movie:201','tv:202','tv:203'],seen_keys:['movie:10'],not_interested_keys:[]
  }),
  source:async tab=>[media(tab==='popular'?402:401,'movie',tab)]
 });
 document.querySelector('[data-ct319-content]').innerHTML='';
 await R.loadForYou(false);
 const finalFy=document.querySelector('[data-ct329-foryou]');
 ok(finalFy,'final r329 ForYou renderer missing');
 ok(!finalFy.textContent.includes('Seen Movie'),'seen title leaked into ForYou');
 for(const a of finalFy.querySelectorAll('.ct329-actions'))ok(a.querySelectorAll(':scope > button').length===3,'final ForYou row does not have three actions');

 // QUICK TAB CHANGES: no stale loader/old tab repaint.
 T.setDiscover('trending','all');await R.loadPublic('trending',true);
 T.setDiscover('popular','all');await R.loadPublic('popular',true);
 ok(document.querySelector('[data-ct319-content]').textContent.includes('popular'),'latest Discover tab did not finish');
 ok(!document.querySelector('[data-ct319-loadline]:not([hidden])'),'Discover load line stuck after tab change');

 // TOP 10: blocked Harry-Potter-like IDs on page 1 must be skipped and refilled to 10.
 T.setTestBridge({
  topPage:async(provider,page)=>({
   movies:Array.from({length:10},(_,i)=>media((page-1)*10+i+1,'movie','M'+((page-1)*10+i+1))),
   series:Array.from({length:10},(_,i)=>media(100+(page-1)*10+i+1,'tv','S'+((page-1)*10+i+1)))
  }),
  exact:async items=>({
   blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=8)||(x.tmdb_id>=101&&x.tmdb_id<=108)).map(x=>x.media_type+':'+x.tmdb_id),
   watch_keys:[],seen_keys:[],not_interested_keys:[]
  })
 });
 const top=await R.topRaw(8,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not refill to 10+10 after exclusions');
 ok(top.movies.every(x=>x.tmdb_id>8),'blocked movies survived Top10 audit');
 ok(top.series.every(x=>x.tmdb_id>108),'blocked series survived Top10 audit');

 document.documentElement.dataset.ct335done='1';
}catch(e){document.documentElement.dataset.ct335probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},5400)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct335done="1"/.test(out)){const m=out.match(/data-ct335probe="([^"]*)"/);throw new Error('R335_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R335_BROWSER_OK Home anchor/tab lock + no top filters + final ForYou + tab stability + Top10 refill');
