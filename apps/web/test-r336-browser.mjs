import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r336.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v336.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',diag+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR336,T=window.__ctR336Test,R=window.__ctR321;
 if(!(X&&T&&R))throw new Error('r336 bridges unavailable '+(window.__ctDiagErrors||[]).join(' || '));
 ok(window.__ctOfficialVersion==='1.0.127','web version stale');

 // HOME: histories remain normal content above each landing section; tab click always lands on the chosen next section.
 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
 '<div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div>'+
 '<div data-home-view="series"><section data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct274-history-stack"><div data-at="old">antigo</div><div data-at="new">recente</div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div><div style="height:120px">seguir</div></section></div>'+
 '<div data-home-view="movies" class="hidden" hidden><section data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct274-history-stack"><div data-at="old">Me Time</div><div data-at="new">Na Zona Cinzenta</div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3></div><div style="height:120px">watchlist</div></section></div>'+
 '</div></div>';
 X.normalizeHistory();
 ok(!document.querySelector('[data-ct275-history-toggle],[data-ct324-history-toggle]'),'history button survived');
 ok(document.querySelector('[data-ct274-history="movies"] .ct274-history-stack').lastElementChild.dataset.at==='new','newest movie is not nearest anchor');
 document.querySelector('[data-home-tab="movies"]').click();
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 ok(document.querySelector('[data-home-tab="movies"]').classList.contains('active'),'Filmes did not stay active');
 ok(!document.querySelector('[data-home-view="movies"]').hidden,'movie view not visible');
 ok(document.querySelector('[data-home-view="movies"] .home-section:not([data-ct274-history])').dataset.ct336HomeAnchor==='1','movie landing anchor missing');
 ok(document.querySelector('[data-ct274-history="movies"]').dataset.ct336History==='above-anchor','movie history not in normal flow');

 // FOR YOU: exact action contracts, no wrap, filters inside section.
 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-content></div></div>';
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.1,release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[media(201,'movie','Watch A'),media(204,'movie','Watch B')],series:[media(202,'tv','Watch Series'),media(205,'tv','Watch Series B')],anime:[media(203,'tv','Watch Anime',{genre_ids:[16],origin_country:['JP']}),media(206,'tv','Watch Anime B',{genre_ids:[16],origin_country:['JP']})]},
  freshPools:{movie:[media(10,'movie','Fresh A'),media(11,'movie','Fresh B')],series:[media(20,'tv','Fresh Series'),media(21,'tv','Fresh Series B')],anime:[media(30,'tv','Fresh Anime',{genre_ids:[16],origin_country:['JP']}),media(31,'tv','Fresh Anime B',{genre_ids:[16],origin_country:['JP']})]},
  dailyPool:[media(40,'movie','Daily A'),media(41,'movie','Daily B')],watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0
 });
 window.__ctR288R263.discover263.tab='foryou';
 X.paintForYou();
 const fy=document.querySelector('[data-ct336-foryou]');ok(fy,'r336 ForYou missing');
 ok(fy.querySelectorAll('[data-ct336-fy-kind]').length===4,'ForYou filters missing');
 const watchRow=fy.querySelector('[data-ct336-section="watch"] .ct336-actions');
 ok(watchRow.querySelectorAll(':scope > button').length===2,'Watchlist row must have two actions');
 ok(!watchRow.textContent.includes('Watchlist')&&watchRow.textContent.includes('Visto')&&watchRow.textContent.includes('Trocar'),'Watchlist actions wrong');
 for(const row of fy.querySelectorAll('.ct336-actions-three'))ok(row.querySelectorAll(':scope > button').length===3,'fresh/daily row must have three actions');
 for(const row of fy.querySelectorAll('.ct336-actions')){
  const buttons=[...row.querySelectorAll(':scope > button')];
  ok(new Set(buttons.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'actions wrapped');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'action text wraps');
 }
 const firstFresh=fy.querySelector('[data-ct336-slot="fresh:movie"] .ct288-copy b')?.textContent||fy.querySelector('[data-ct336-slot="fresh:movie"] b')?.textContent;
 T.optimisticRotate336('watchlist','movie:10');
 const afterFresh=document.querySelector('[data-ct336-slot="fresh:movie"] .ct288-copy b')?.textContent||document.querySelector('[data-ct336-slot="fresh:movie"] b')?.textContent;
 ok(firstFresh!==afterFresh&&afterFresh.includes('Fresh B'),'Watchlist action did not replace card immediately');
 X.swapForYou('fresh:series');
 ok((document.querySelector('[data-ct336-slot="fresh:series"]')?.textContent||'').includes('Fresh Series B'),'Trocar did not replace immediately');
 document.querySelector('[data-ct336-fy-kind="movie"]').click();
 ok(document.querySelector('[data-ct336-foryou]').dataset.ct336Filter==='movie','movie filter state not applied');
 ok(document.querySelector('[data-ct336-slot="fresh:series"]').hidden,'series did not hide under movie filter');
 ok(!document.querySelector('[data-ct336-slot="fresh:movie"]').hidden,'movie hidden under movie filter');

 // SEARCH: one query may simultaneously return movie, series, person and episode by exact/fuzzy episode title.
 document.body.innerHTML='<div id="app"><div data-global-results></div></div>';
 X.setTestBridge({
  standard:async()=>[
   {id:501,media_type:'movie',title:'The Unraveling',poster_path:'/m.jpg'},
   {id:502,media_type:'tv',name:'The Unraveling',poster_path:'/t.jpg'},
   {id:503,media_type:'person',name:'The Unraveling',profile_path:'/p.jpg'}
  ],
  localEpisodes:async()=>[],
  targets:async()=>[{tmdb_id:113962,series_title:'Lioness',poster_path:'/l.jpg',season_numbers:[3]}],
  season:async()=>({episodes:[{name:'The Unravelling',season_number:3,episode_number:8,air_date:'2026-09-20',still_path:'/e.jpg'}]})
 });
 await X.globalSearch('The Unraveling');
 const txt=document.querySelector('[data-global-results]').textContent;
 ok(txt.includes('The Unravelling')&&txt.includes('Lioness')&&txt.includes('T03E08'),'episode-name search failed');
 ok(document.querySelector('[data-media="movie:501"]'),'movie result missing');
 ok(document.querySelector('[data-media="tv:502"]'),'series result missing');
 ok(document.querySelector('[data-person="503"]'),'person result missing');
 ok(document.querySelector('.ct336-episode-result[data-media="tv:113962"]'),'episode result does not open parent series');

 document.documentElement.dataset.ct336done='1';
}catch(e){document.documentElement.dataset.ct336probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},5600)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=20000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct336done="1"/.test(out)){const m=out.match(/data-ct336probe="([^"]*)"/);throw new Error('R336_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R336_BROWSER_OK episode search + Home landing + ForYou filters/actions/immediate rotation');
