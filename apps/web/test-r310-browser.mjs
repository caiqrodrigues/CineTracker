import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r310.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct310Errors=[];addEventListener('error',e=>__ct310Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct310Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR310Test;ok(T,'r310 test bridge unavailable');
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01'});
 const terra=media(991,'tv','Terra da Máfia'),other=media(992,'movie','Outro');
 T.setWatch(['tv:991']);
 let clean=T.filterBrowse310([terra,other],'trending',{seen:new Set(),watch:new Set()},T.watch);
 ok(clean.length===1&&clean[0].tmdb_id===992,'canonical Watchlist title survived filtered browse');

 const browse=document.createElement('div');browse.innerHTML='<div data-ct310-fixture><article class="ct288-card ct291-has-footer" data-ct288-card="tv:991"><button data-media="tv:991">Terra da Máfia</button><div class="ct291-card-footer"><button>legacy</button></div></article><article class="ct288-card ct291-has-footer" data-ct288-card="movie:992"><button data-media="movie:992">Outro</button><div class="ct295-card-footer"><button>legacy</button></div></article></div>';document.body.appendChild(browse);
 T.decorateBrowse310(browse,T.watch);
 const saved=browse.querySelector('[data-ct288-card="tv:991"]'),normal=browse.querySelector('[data-ct288-card="movie:992"]');
 ok(saved.querySelector('[data-ct310-action="watchlist"]').textContent.trim()==='✓ Watchlist','saved Watchlist label lies about state');
 ok(normal.querySelector('[data-ct310-action="watchlist"]').textContent.trim()==='+ Watchlist','unsaved Watchlist label wrong');
 ok(saved.querySelectorAll('[data-ct310-action]').length===2&&normal.querySelectorAll('[data-ct310-action]').length===2,'two visible actions not produced');
 ok(!browse.querySelector('.ct291-card-footer')&&!browse.querySelector('.ct295-card-footer'),'legacy action footer survived');
 browse.remove();

 const tabs=document.createElement('div');tabs.innerHTML='<div data-ct288-discover><div class="ct251-tabs"><button data-ct251-discover-tab="top10">Top 10</button><button data-ct251-discover-tab="releases">Lançamentos</button></div><div data-ct288-tabs><button data-ct263-discover-tab="foryou">Pra você</button><button data-ct263-discover-tab="top10">Top 10</button><button data-ct263-discover-tab="trending">Em alta</button><button data-ct263-discover-tab="popular">Populares</button><button data-ct263-discover-tab="new">Novidades</button><button data-ct263-discover-tab="anticipated">Mais Aguardados</button><button data-ct263-discover-tab="top">Mais bem avaliados</button><button data-ct263-discover-tab="calendar">Calendário</button><button data-ct263-discover-tab="top10">Top 10</button><button data-ct263-discover-tab="releases">Lançamentos</button></div></div>';document.body.appendChild(tabs);
 T.sanitizeTabs310();const keys=[...tabs.querySelectorAll('[data-ct288-tabs] [data-ct263-discover-tab]')].map(x=>x.dataset.ct263DiscoverTab);
 ok(keys.join('|')==='foryou|top10|trending|popular|new|anticipated|top|calendar','canonical Discover rail changed');
 ok(!tabs.querySelector('.ct251-tabs'),'legacy Discover rail survived');
 tabs.remove();

 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Eventos assistidos</small><b>59</b></div><div class="stat"><small>Jogos no Estádio</small><b>1</b></div></div></section><section class="panel actors-scroll ct306-actor-rail"><div class="panel-head"><h2>Atores Favoritos</h2></div><div class="row ct305-actor-rail"><article class="card"><button data-person="1">A</button></article><article class="card"><button data-person="2">B</button></article><article class="card"><button data-person="3">C</button></article><article class="card"><button data-person="4">D</button></article></div></section></div>';document.body.appendChild(p);
 ok(T.sportsHistoryCount(Array.from({length:68},(_,i)=>({id:i+1,is_watched:true})))===68,'sports canonical count fixture');
 T.patchProfileSportsCount(68);ok(p.querySelector('.stat b').textContent==='68','Profile stayed on stale 59');
 const section=p.querySelector('section.actors-scroll'),rail=section.querySelector('.row');T.actorBottomScroll310();const proxy=section.querySelector('.ct310-actor-scroll');
 ok(proxy&&rail.nextElementSibling===proxy,'actor scrollbar proxy is not below cards');
 ok(!section.classList.contains('ct306-actor-rail')&&!section.classList.contains('actors-scroll'),'outer actor scroller authority survived');
 ok(!rail.classList.contains('ct305-actor-rail')&&rail.classList.contains('ct310-actor-rail'),'real actor rail authority wrong');
 const railStyle=getComputedStyle(rail),proxyStyle=getComputedStyle(proxy);
 ok(railStyle.scrollbarWidth==='none','native actor rail scrollbar still visible');
 ok(proxyStyle.overflowX==='auto','bottom actor scrollbar is not scrollable');
 p.remove();

 history.replaceState({},'','/');
 const f=document.createElement('footer');f.textContent='CineTracker • v1.0.57 • r309-official-1.0.100';document.body.appendChild(f);T.footer310();
 ok(f.textContent.includes('v1.0.101')&&f.textContent.includes('r310-official-1.0.101'),'footer did not migrate from v1.0.57/r309');
 f.remove();

 await new Promise(r=>setTimeout(r,2600));
 ok(!document.body.textContent.includes('Lançamentos'),'delayed Lançamentos reappeared after 2.6s');

 document.documentElement.dataset.ct310done='1';
 document.documentElement.dataset.ct310watch='1';
 document.documentElement.dataset.ct310tabs='1';
 document.documentElement.dataset.ct310profile='1';
 document.documentElement.dataset.ct310actors='1';
 document.documentElement.dataset.ct310footer='1';
 document.documentElement.dataset.ct310errors=String(window.__ct310Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct310probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct310Errors||[]) }},3800)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),path=u.pathname;if(path==='/'||path==='/profile'||path==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=path.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=9000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct310done="1"/.test(out)){const m=out.match(/data-ct310probe="([^"]*)"/);throw new Error('R310_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['watch','tabs','profile','actors','footer'])if(!new RegExp('data-ct310'+a+'="1"').test(out))throw new Error('R310_BROWSER missing '+a);
const em=out.match(/data-ct310errors="([^"]*)"/);if(em?.[1])throw new Error('R310_BROWSER page errors '+em[1]);
console.log('R310_BROWSER_OK new video reproduced: Watchlist exclusion, delayed tabs, 68-vs-59 Profile, actor bottom scrollbar, footer');
