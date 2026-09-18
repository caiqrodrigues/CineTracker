import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r312.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct312Errors=[];addEventListener('error',e=>__ct312Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct312Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR312Test,A=window.__ctR312;ok(T&&A,'r312 runtime unavailable');
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/poster.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8.4,genre_ids:type==='tv'?[35]:[28]});

 // Public Discover must fail the personal exclusion test before markup.
 T.setPersonal({seen:['movie:1'],watch:['tv:2']});
 const clean=T.filterPublic312([media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Título elegível e comprido para validar duas linhas')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'seen/watchlist item survived public Discover');
 const box=document.createElement('div');box.innerHTML='<section class="panel ct312-public"><div class="ct312-scroll"><div class="ct312-rail">'+T.card312(clean[0])+'</div></div></section>';document.body.appendChild(box);
 const item=box.querySelector('.ct312-discover-item'),poster=box.querySelector('.ct312-poster'),copy=box.querySelector('.ct312-copy'),actions=box.querySelector('.ct312-actions'),scroll=box.querySelector('.ct312-scroll');
 ok(item&&poster&&copy&&actions,'complete Discover item missing');
 ok(item.offsetHeight>poster.offsetHeight+45,'title/meta/actions are clipped under poster');
 ok(item.querySelector('.ct312-media').nextElementSibling===actions,'actions are not fixed below card copy');
 ok(actions.querySelectorAll('[data-ct312-action]').length===2,'Watchlist + Visto actions missing');
 ok(getComputedStyle(actions).display==='grid','Discover action row unstable');
 ok([...actions.querySelectorAll('.chip')].every(x=>getComputedStyle(x).position==='static'),'Discover action floats over card');
 ok(getComputedStyle(copy.querySelector('b')).whiteSpace==='normal','title cannot wrap');
 ok(scroll.clientHeight>=item.offsetHeight-2,'horizontal scroll viewport clips card copy/actions');
 box.remove();

 // Cached revisit must not re-fetch or return to a loading-only state.
 history.replaceState({},'','/discover');
 const host=document.createElement('div');host.dataset.ct263DiscoverContent='1';document.body.appendChild(host);
 const D=window.__ctR288R263?.discover263;ok(D,'discover state missing');D.tab='trending';D.type='all';
 let sourceCalls=0,personalCalls=0;
 A.setTestBridge({
   personal:async()=>{personalCalls++;return{at:Date.now(),seen:new Set(['movie:11']),watch:new Set(['tv:12'])}},
   source:async()=>{sourceCalls++;return[media(11,'movie','Visto'),media(12,'tv','Watch'),media(13,'movie','Elegível')]}
 });
 await A.buildPublic('trending',false);await new Promise(r=>setTimeout(r,20));
 ok(host.querySelectorAll('[data-ct312-item]').length===1,'public build did not filter before paint');
 await A.buildPublic('trending',false);await new Promise(r=>setTimeout(r,20));
 ok(sourceCalls===1,'cached tab revisit refetched catalog');
 ok(!/Carregando títulos/.test(host.textContent),'cached tab revisit showed loading state');
 host.remove();

 // Pra Você must use compact horizontal cards instead of giant thirds.
 const fy=document.createElement('div');fy.innerHTML='<div data-ct309-foryou><section class="ct309-fy-block"><div class="ct309-fy-grid">'+[1,2,3].map(i=>'<div class="ct309-slot"><div class="ct288-card"><div class="ct288-copy"><b>Título '+i+' bem comprido para duas linhas</b><small>2026 · Filme · ★ 8.0</small></div></div><div class="ct309-actions"><button class="chip">Watchlist</button><button class="chip">Visto</button><button class="chip ct309-swap">Trocar</button></div></div>').join('')+'</div></section></div>';document.body.appendChild(fy);
 const grid=fy.querySelector('.ct309-fy-grid'),slots=[...fy.querySelectorAll('.ct309-slot')];
 ok(getComputedStyle(grid).display==='flex','Pra Você is still giant 3-column grid');
 ok(slots.every(x=>x.getBoundingClientRect().width<=180),'Pra Você slot is still giant');
 ok(slots.every(x=>x.querySelector('.ct309-actions').getBoundingClientRect().width<=180),'Pra Você buttons still span page thirds');
 ok(getComputedStyle(fy.querySelector('.ct288-copy b')).whiteSpace==='normal','Pra Você title remains clipped to one line');
 fy.remove();

 // Profile producer must create the stadium button in the same visual contract.
 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats"><button type="button" class="stat ct117-watchlist-stat" data-ct117-watchlist-stat="tv"><small>Séries Watchlist</small><b>572</b></button><button type="button" class="stat ct117-watchlist-stat" data-ct117-watchlist-stat="movie"><small>Filmes Watchlist</small><b>1371</b></button></div></section><section class="panel" data-profile-sports-panel><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Tempo assistido</small><b>10h</b></div><button type="button" class="stat ct312-stat-button" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></button><button type="button" class="stat ct312-stat-button" data-ct299-history="stadium"><small>Jogos no Estádio</small><b>1</b></button></div></section></div>';document.body.appendChild(p);
 const ev=p.querySelector('[data-ct299-history="all"]'),stad=p.querySelector('[data-ct299-history="stadium"]'),series=p.querySelector('[data-ct117-watchlist-stat="tv"]'),movies=p.querySelector('[data-ct117-watchlist-stat="movie"]');
 ok(stad&&stad.tagName==='BUTTON','Jogos no Estádio is not a button');
 for(const x of [stad,series,movies]){const a=getComputedStyle(ev),b=getComputedStyle(x);for(const k of ['display','minHeight','borderRadius','backgroundColor','cursor'])ok(a[k]===b[k],'Profile control visual mismatch '+k)}
 p.remove();

 // Sports heading filter: all payload sports, only in Próximos/Anteriores.
 history.replaceState({},'','/sports');
 window.__ctR312SportsCatalog=[
  {slug:'soccer',name:'Futebol',icon:'⚽'},{slug:'basketball',name:'Basquete',icon:'🏀'},{slug:'ice_hockey',name:'Hóquei',icon:'🏒'},
  {slug:'tennis',name:'Tênis',icon:'🎾'},{slug:'volleyball',name:'Vôlei',icon:'🏐'},{slug:'handball',name:'Handebol',icon:'🤾'},
  {slug:'rugby',name:'Rugby',icon:'🏉'},{slug:'baseball',name:'Beisebol',icon:'⚾'},{slug:'formula_1',name:'Fórmula 1',icon:'🏎️'}
 ];window.__ctR312SportSelected='all';
 const s=document.createElement('div');s.innerHTML='<div data-ct255-sports><div class="ct255-sports-tabs"><button class="ct255-sports-tab active" data-ct255-sport-tab="next">Próximos</button><button class="ct255-sports-tab" data-ct255-sport-tab="previous">Anteriores</button></div><div class="ct255-sport-filters"><button>legado</button></div><section class="panel ct255-sports-feed"><div class="panel-head"><h2>Próximos</h2><small>20</small></div><div class="ct255-sport-grid"></div></section></div>';document.body.appendChild(s);
 ok(A.decorateSportsFilters(),'Sports filter decorator failed');
 const rail=s.querySelector('.ct312-sport-filter-rail');ok(rail,'Sports filter not placed in feed heading');
 ok(rail.previousElementSibling?.tagName==='H2','Sports filter is not next to Próximos heading');
 ok(rail.querySelectorAll('[data-ct255-sport-filter]').length===10,'not all system sports plus Todos were rendered');
 ok(getComputedStyle(s.querySelector('.ct255-sport-filters')).display==='none','legacy global sports filter remains visible');
 s.remove();

 document.documentElement.dataset.ct312done='1';
 document.documentElement.dataset.ct312discover='1';
 document.documentElement.dataset.ct312foryou='1';
 document.documentElement.dataset.ct312profile='1';
 document.documentElement.dataset.ct312sports='1';
 document.documentElement.dataset.ct312errors=String(window.__ct312Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct312probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct312Errors||[]) }},3800)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=10000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct312done="1"/.test(out)){const m=out.match(/data-ct312probe="([^"]*)"/);throw new Error('R312_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['discover','foryou','profile','sports'])if(!new RegExp('data-ct312'+a+'="1"').test(out))throw new Error('R312_BROWSER missing '+a);
const em=out.match(/data-ct312errors="([^"]*)"/);if(em?.[1])throw new Error('R312_BROWSER page errors '+em[1]);
console.log('R312_BROWSER_OK latest video: unclipped Discover + cached tabs + compact For You + stadium button + all-sports heading filter');
