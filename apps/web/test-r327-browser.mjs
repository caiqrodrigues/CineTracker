import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r327.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v327.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR327,XT=window.__ctR327Test,R309=window.__ctR309Test,R319=window.__ctR319Test;
 ok(X&&XT&&R309&&R319,'r327 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.118','web version stale');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
  '<div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div>'+
  '<div data-home-view="series" class="home-list">'+
   '<section class="home-section ct274-history is-collapsed" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver Histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack"><div style="height:1300px">OLD TO NEW · newest at bottom</div></div></div></section>'+
   '<section class="home-section" id="continue-series" style="height:900px"><h3>Assistir a seguir</h3></section>'+
  '</div>'+
  '<div data-home-view="movies" class="home-list hidden">'+
   '<section class="home-section ct274-history is-collapsed" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack"><div style="height:1200px">OLD TO NEW MOVIES</div></div></div></section>'+
   '<section class="home-section" id="watch-movies" style="height:900px"><h3>Assistir a seguir / Watchlist</h3></section>'+
  '</div></div></div>';
 XT.normalizeHomeHistory327();XT.anchorHome327();
 const hs=document.querySelector('[data-ct274-history="episodes"]'),stack=hs.querySelector('.ct274-history-stack');
 ok(!hs.querySelector('[data-ct275-history-toggle]'),'Home toggle still present');
 ok(getComputedStyle(stack).overflowY==='visible','Home history still has inner scroll');
 ok(getComputedStyle(stack).maxHeight==='none','Home history still capped');
 ok(window.scrollY>1000,'Home did not anchor below full history');
 ok(Math.abs(document.querySelector('#continue-series').getBoundingClientRect().top-10)<40,'Home anchor target not at initial viewport');

 history.replaceState({},'','/discover');
 const shell=R319.shell319();
 document.body.innerHTML='<div id="app">'+shell+'</div>';
 const media=(id,type,kind)=>({id,tmdb_id:id,media_type:type,media_kind:kind,title:'T'+id,name:'T'+id,poster_path:'/p.jpg',genre_ids:kind==='anime'?[16]:[18],original_language:kind==='anime'?'ja':'en',origin_country:kind==='anime'?['JP']:['US']});
 R309.setForYouState({
  watchPools:{movie:[media(1,'movie','movie')],series:[media(2,'tv','series')],anime:[media(3,'tv','anime')]},
  freshPools:{movie:[media(4,'movie','movie')],series:[media(5,'tv','series')],anime:[media(6,'tv','anime')]},
  dailyPool:[media(7,'movie','movie')],dailyIndex:0,
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  initial:{watch:{movie:media(1,'movie','movie'),series:media(2,'tv','series'),anime:media(3,'tv','anime')},fresh:{movie:media(4,'movie','movie'),series:media(5,'tv','series'),anime:media(6,'tv','anime')},daily:media(7,'movie','movie')},complete:true
 });
 document.querySelector('[data-ct319-content]').innerHTML=window.__ctR309Test.forYouMarkup?window.__ctR309Test.forYouMarkup(window.__ctR309Test.state):'<div data-ct309-foryou><section class="ct309-daily"><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap" data-ct309-swap="daily">↻ Trocar</button></div></section><section><div class="ct309-slot" data-ct309-slot="fresh:movie">M</div><div class="ct309-slot" data-ct309-slot="fresh:series">S</div><div class="ct309-slot" data-ct309-slot="fresh:anime">A</div></section></div>';
 if(!document.querySelector('[data-ct309-foryou]'))document.querySelector('[data-ct319-content]').innerHTML='<div data-ct309-foryou><section class="ct309-daily"><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap" data-ct309-swap="daily">↻ Trocar</button></div></section><div class="ct309-slot" data-ct309-slot="fresh:movie">M</div><div class="ct309-slot" data-ct309-slot="fresh:series">S</div><div class="ct309-slot" data-ct309-slot="fresh:anime">A</div></div>';
 X.compactActions(document);
 const row=document.querySelector('[data-ct309-foryou] .ct309-actions'),buttons=[...row.querySelectorAll('.chip')];
 ok(buttons.length===3,'Pra voce actions missing');
 ok(!row.querySelector('.ct309-swap'),'legacy swap class survived');
 const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));
 ok(new Set(tops).size===1,'Pra voce actions still wrap');
 ok(getComputedStyle(row).display==='flex','Pra voce row is not flex');

 const filter=document.querySelector('[data-ct319-filter]');
 X.handleDiscover(filter);
 const types=document.querySelector('[data-ct319-types]');
 ok(types.hidden===false,'ForYou filter bar did not open');
 ok(types.querySelectorAll('[data-ct319-fy-kind]').length===4,'ForYou filter options incomplete');
 const seriesBtn=types.querySelector('[data-ct319-fy-kind="series"]');
 X.handleDiscover(seriesBtn);
 ok(R319.state.fyKind==='series','ForYou series filter state not set');
 const movieSlot=document.querySelector('[data-ct309-slot$=":movie"]'),seriesSlot=document.querySelector('[data-ct309-slot$=":series"]'),daily=document.querySelector('.ct309-daily');
 ok(getComputedStyle(movieSlot).display==='none','movie slot survived series filter');
 ok(getComputedStyle(seriesSlot).display!=='none','series slot hidden by series filter');
 ok(getComputedStyle(daily).display==='none','movie daily survived series filter');

 document.documentElement.dataset.ct327done='1';
}catch(e){document.documentElement.dataset.ct327probe='fail:'+String(e?.stack||e)}},5600)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct327done="1"/.test(out)){const m=out.match(/data-ct327probe="([^"]*)"/);throw new Error('R327_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R327_BROWSER_OK r276 Home anchor + flex actions + working ForYou filters');
