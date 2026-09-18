import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r309.mjs');
let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct309Errors=[];addEventListener('error',e=>__ct309Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct309Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 ok(window.__ctR309&&window.__ctR309Test,'r309 runtime unavailable');
 const media=(id,type,kind,title,year='2025')=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.4,release_date:year+'-01-01',first_air_date:year+'-01-01',media_kind:kind,genre_ids:kind==='anime'?[16,10759]:[35],original_language:kind==='anime'?'ja':'en'});
 const watch=[
   media(101,'movie','movie','WM1'),media(111,'movie','movie','WM2'),
   media(102,'tv','series','WS1'),media(112,'tv','series','WS2'),
   media(103,'tv','anime','WA1'),media(113,'tv','anime','WA2')
 ];
 const fresh=[
   media(201,'movie','movie','FM1'),media(202,'movie','movie','Daily1'),media(203,'movie','movie','Daily2'),
   media(204,'tv','series','FS1'),media(214,'tv','series','FS2'),
   media(205,'tv','anime','FA1'),media(215,'tv','anime','FA2')
 ];
 const state=__ctR309Test.composeForYou(watch,fresh,null,{trust:true});
 ok(state.complete===true,'1+3+3 composition incomplete');
 __ctR309Test.setForYouState(state);
 const shell=document.createElement('div');shell.innerHTML=__ctR309Test.forYouMarkup();document.body.appendChild(shell);
 ok(shell.querySelectorAll('.ct309-fy-block').length===2,'missing Watchlist/Fresh blocks');
 const blocks=[...shell.querySelectorAll('.ct309-fy-block')];
 for(const b of blocks)ok([...b.querySelectorAll('.ct309-slot h3')].map(x=>x.textContent.trim()).join('|')==='Filme|Série|Anime','category order not exact');
 ok(shell.querySelectorAll('.ct309-slot').length===6,'3+3 slots missing');
 ok(shell.querySelectorAll('[data-ct309-action="watchlist"]').length===7,'Watchlist action/state not present on all seven cards');
 ok(shell.querySelectorAll('[data-ct309-action="seen"]').length===7,'Visto action not present on all seven cards');
 ok(shell.querySelector('[data-ct309-swap="daily"]'),'daily Trocar missing');
 const actionRow=shell.querySelector('.ct309-actions');ok(getComputedStyle(actionRow).display==='grid','actions are not visibly laid out');
 shell.remove();

 const duplicate=[media(301,'movie','movie','Next Time','2026'),media(302,'movie','movie','Next Time','2026'),media(303,'movie','movie','Outro','2026')];
 const clean=__ctR309Test.filterBrowse(duplicate,'calendar',{seen:new Set(),watch:new Set()});
 ok(clean.length===2,'visual duplicate Next Time survived final dedupe');

 const d=document.createElement('div');d.innerHTML='<div data-ct288-discover><div class="ct257-discover-tabs"><button>legado</button></div><div data-ct288-tabs><button data-ct263-discover-tab="foryou">Pra você</button><button data-ct263-discover-tab="top10">Top 10</button><button data-ct263-discover-tab="trending">Em alta</button><button data-ct263-discover-tab="popular">Populares</button><button data-ct263-discover-tab="new">Novidades</button><button data-ct263-discover-tab="releases">Lançamentos</button><button data-ct263-discover-tab="anticipated">Mais Aguardados</button><button data-ct263-discover-tab="top">Mais bem avaliados</button><button data-ct263-discover-tab="calendar">Calendário</button><button data-ct263-discover-tab="top10">Top 10</button></div></div>';document.body.appendChild(d);
 __ctR309Test.canonicalDiscoverTabs();
 const rail=d.querySelector('[data-ct288-tabs]'),keys=[...rail.querySelectorAll('[data-ct263-discover-tab]')].map(x=>x.dataset.ct263DiscoverTab);
 ok(keys.join('|')==='foryou|top10|trending|popular|new|anticipated|top|calendar','Discover tab rail still duplicated/contains Lançamentos');
 ok(!d.querySelector('.ct257-discover-tabs'),'legacy duplicate tab rail survived');
 d.remove();

 const browse=document.createElement('div');browse.innerHTML='<div><article class="ct288-card ct291-card ct291-has-footer" data-ct288-card="movie:401"><button data-media="movie:401">Card</button><button class="ct288-state">+</button><div class="ct291-card-footer"><button>old</button></div></article></div>';document.body.appendChild(browse);
 __ctR309Test.decorateBrowse(browse);
 const card=browse.querySelector('[data-ct288-card]');
 ok(card.querySelectorAll('[data-ct309-action]').length===2,'browse card does not show both actions');
 ok(!card.classList.contains('ct291-has-footer'),'legacy fixed-height card class survived');
 ok(!card.querySelector('.ct291-card-footer')&&!card.querySelector('.ct288-state'),'legacy one-button action survived');
 browse.remove();

 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats"><button class="stat"><small>Séries Watchlist</small><b>575</b><span class="ct117-stat-chevron">›</span></button><button class="stat"><small>Filmes Watchlist</small><b>1370</b><span class="stat-link-icon">›</span></button></div></section><section class="panel actor-outer ct306-actor-rail ct257-local-x"><div class="panel-head"><h2>Atores Favoritos</h2></div><div class="row"><article class="card"><button data-person="1"><div class="poster"></div><b>A</b></button></article><article class="card"><button data-person="2"><div class="poster"></div><b>B</b></button></article><article class="card"><button data-person="3"><div class="poster"></div><b>C</b></button></article></div></section></div>';document.body.appendChild(p);
 __ctR309Test.cleanProfile309();
 ok(!p.querySelector('.ct117-stat-chevron')&&!p.querySelector('.stat-link-icon'),'Watchlist chevron survived visible profile');
 const section=p.querySelector('.actor-outer'),actorRail=section.querySelector('.row');
 ok(actorRail.classList.contains('ct309-actor-rail'),'actual actor-card parent is not the scroll rail');
 ok(!section.classList.contains('ct306-actor-rail')&&!section.classList.contains('ct257-local-x'),'outer actor section still owns horizontal scrolling');
 ok(getComputedStyle(actorRail).overflowX==='auto','actor scrollbar is not on the card rail');
 ok(getComputedStyle(section).overflowX==='hidden','outer actor section can still show an upper scrollbar');
 p.remove();

 document.documentElement.dataset.ct309done='1';
 document.documentElement.dataset.ct309foryou='1';
 document.documentElement.dataset.ct309dedupe='1';
 document.documentElement.dataset.ct309tabs='1';
 document.documentElement.dataset.ct309actions='1';
 document.documentElement.dataset.ct309profile='1';
 document.documentElement.dataset.ct309errors=String(window.__ct309Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct309probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct309Errors||[]) }},4200)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/', 'http://127.0.0.1'),path=u.pathname;
  if(path==='/'||path==='/profile'||path==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}
  const safe=path.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
  const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body);
 }catch{res.writeHead(404);res.end('not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=10000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct309done="1"/.test(out)){const m=out.match(/data-ct309probe="([^"]*)"/);throw new Error('R309_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['foryou','dedupe','tabs','actions','profile'])if(!new RegExp('data-ct309'+a+'="1"').test(out))throw new Error('R309_BROWSER missing '+a);
const em=out.match(/data-ct309errors="([^"]*)"/);if(em?.[1])throw new Error('R309_BROWSER page errors '+em[1]);
console.log('R309_BROWSER_OK video failures reproduced: exact 1+3+3, no duplicates/tabs, two actions, actor scrollbar below');
