import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r327.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR327,T=window.__ctR321Test;
 ok(X&&T,'r327 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.118','web version stale');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
  '<div data-home-view="series"><section data-ct274-history="episodes" class="home-section is-collapsed"><div class="ct275-history-head"><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack"><div>ANTIGO</div><div>RECENTE</div></div></div></section><section class="home-section" id="series-normal">NORMAL SERIES</section></div>'+
  '<div data-home-view="movies" class="hidden"><section data-ct274-history="movies" class="home-section is-collapsed"><div class="ct275-history-head"><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack"><div>ANTIGO M</div><div>RECENTE M</div></div></div></section><section class="home-section" id="movies-normal">NORMAL MOVIES</section></div>'+
  '</div></div>';
 let seriesCalls=0,movieCalls=0;
 document.querySelector('#series-normal').scrollIntoView=()=>seriesCalls++;
 document.querySelector('#movies-normal').scrollIntoView=()=>movieCalls++;
 X.normalizeHomeHistory();X.resetHomePosition('series');
 const hs=document.querySelector('[data-ct274-history="episodes"] .ct274-history-stack');
 ok(seriesCalls===1,'Home series normal anchor not selected');
 ok(getComputedStyle(hs).overflowY!=='auto'&&getComputedStyle(hs).overflowY!=='scroll','Home history still has inner scroll');
 ok(getComputedStyle(document.querySelector('[data-ct275-history-toggle]')).display==='none','Home history toggle still visible');
 document.querySelector('[data-home-view="series"]').classList.add('hidden');document.querySelector('[data-home-view="movies"]').classList.remove('hidden');
 X.resetHomePosition('movies');ok(movieCalls===1,'Home movie tab did not reset to own normal anchor');

 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><button data-ct319-fy-kind="all">Todos</button><button data-ct319-fy-kind="movie">Filmes</button><button data-ct319-fy-kind="series">Séries</button><button data-ct319-fy-kind="anime">Animes</button><div data-ct309-foryou><section class="ct309-daily">daily</section><div class="ct309-slot" data-ct309-slot="fresh:movie"><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap">↻ Trocar</button></div></div><div class="ct309-slot" data-ct309-slot="fresh:series">series</div><div class="ct309-slot" data-ct309-slot="fresh:anime">anime</div></div></div></div>';
 window.__ctR319Test.state.fyKind='movie';X.applyForYouFilter();
 const acts=[...document.querySelectorAll('.ct309-actions .chip')],tops=acts.map(b=>Math.round(b.getBoundingClientRect().top));
 ok(new Set(tops).size===1,'Pra voce buttons break line');
 ok(getComputedStyle(document.querySelector('[data-ct309-slot="fresh:series"]')).display==='none','ForYou series filter failed');
 ok(getComputedStyle(document.querySelector('[data-ct309-slot="fresh:anime"]')).display==='none','ForYou anime filter failed');
 ok(getComputedStyle(document.querySelector('[data-ct309-slot="fresh:movie"]')).display!=='none','ForYou movie filter hid movie');
 ok(X.providerAllowed({provider_name:'Mubi'})===false&&X.providerAllowed({provider_name:'Looke'})===false&&X.providerAllowed({provider_name:'Netflix'})===true,'provider exclusion failed');

 const grid=document.createElement('div');grid.className='ct319-top-row';grid.style.width='900px';
 for(let i=0;i<10;i++){const el=document.createElement('div');el.className='ct319-item';el.innerHTML='<div class="ct288-card"><div class="card-body"><b>Card '+i+'</b></div></div>';grid.appendChild(el)}
 document.body.appendChild(grid);grid.getBoundingClientRect();
 ok(getComputedStyle(grid).display==='grid','Top10 not grid');
 ok(getComputedStyle(grid).gridTemplateColumns.split(' ').length===10,'Top10 does not expose ten columns');

 T.setTestBridge({
  topPage:async(provider,page)=>({
   movies:Array.from({length:10},(_,i)=>({id:(page-1)*10+i+1,tmdb_id:(page-1)*10+i+1,media_type:'movie',title:'M'+((page-1)*10+i+1),poster_path:'/x.jpg'})),
   series:Array.from({length:10},(_,i)=>({id:100+(page-1)*10+i+1,tmdb_id:100+(page-1)*10+i+1,media_type:'tv',name:'S'+((page-1)*10+i+1),poster_path:'/x.jpg'}))
  }),
  exact:async items=>({blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=7)||(x.tmdb_id>=101&&x.tmdb_id<=107)).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:[],seen_keys:[],not_interested_keys:[]})
 });
 const top=await T.topRaw321(8,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not refill to ten eligible');
 ok(top.movies.every(x=>x.tmdb_id>7),'blocked movie survived Top10');
 ok(top.series.every(x=>x.tmdb_id>107),'blocked series survived Top10');

 document.documentElement.dataset.ct327done='1';
}catch(e){document.documentElement.dataset.ct327probe='fail:'+String(e?.stack||e)}},200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=9000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct327done="1"/.test(out)){const m=out.match(/data-ct327probe="([^"]*)"/);throw new Error('R327_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R327_BROWSER_OK Home reveal-by-scroll + ForYou single-row filters + Top10 ten eligible');
