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
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR312Test,R=window.__ctR312;ok(T&&R,'r312 unavailable');

 // AUTH: exact failed call retries once after one refresh.
 let refreshes=0,attempts=0;
 T.setBridge({skipProactive:true,refreshAuth:async()=>{refreshes++;return true}});
 const authResult=await T.authRetry312(async()=>{attempts++;if(attempts===1)throw new Error('JWT expired');return 'sports-ok'});
 ok(authResult==='sports-ok'&&attempts===2&&refreshes===1,'JWT expired did not refresh once + retry same request');

 // DISCOVER: normalize all identity shapes and block seen/Watchlist before markup.
 const media=(id,type,title,overview='Sinopse completa para validar que o conteúdo inferior do card não fica cortado pelo scroll horizontal.')=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/poster.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8.5,overview});
 T.setPersonal({seen:['tmdb-movie-101','tv:202'],watch:['movie:303','tmdb-tv-404']});
 const dirty=[media(101,'movie','Já visto A'),media(202,'tv','Já visto B'),media(303,'movie','Watchlist A'),media(404,'tv','Watchlist B'),media(505,'movie','Título elegível extremamente comprido que precisa aparecer corretamente')];
 const clean=T.filterPublic312(dirty,T.personal);ok(clean.length===1&&clean[0].tmdb_id===505,'seen/watchlist leaked through normalized exclusion');

 const wrap=document.createElement('div');wrap.innerHTML='<section class="panel ct312-public"><div class="ct312-public-rail">'+T.card312(clean[0])+'</div></section>';document.body.appendChild(wrap);
 const card=wrap.querySelector('.ct312-media-card'),title=wrap.querySelector('.ct312-title'),meta=wrap.querySelector('.ct312-meta'),rail=wrap.querySelector('.ct312-public-rail'),actions=wrap.querySelector('.ct312-actions');
 ok(card&&title&&meta&&actions,'owned Discover card incomplete');
 ok(getComputedStyle(title).whiteSpace==='normal'&&getComputedStyle(title).overflow==='visible','Discover title is clipped');
 ok(getComputedStyle(meta).whiteSpace==='normal'&&getComputedStyle(meta).overflow==='visible','Discover metadata is clipped');
 ok(getComputedStyle(card).overflow==='visible','Discover card lower content is clipped');
 ok(actions.querySelectorAll('[data-ct312-action]').length===2,'Watchlist/Visto actions missing');
 ok([...actions.querySelectorAll('button')].every(x=>getComputedStyle(x).position==='static'),'Discover buttons float over card');
 const details=wrap.querySelector('.ct312-overview');ok(details,'full overview affordance missing');details.open=true;await new Promise(r=>requestAnimationFrame(()=>r()));
 ok(rail.scrollHeight<=rail.clientHeight+2,'horizontal rail created vertical clipping/scroll');
 wrap.remove();

 // Cached revisit: second paint must not refetch or show a new loader.
 history.replaceState({},'','/discover');
 const host=document.createElement('div');host.dataset.ct263DiscoverContent='1';document.body.appendChild(host);
 const dstate=window.__ctR288R263?.discover263;ok(dstate,'discover state unavailable');dstate.tab='trending';
 let sourceCalls=0;
 T.setBridge({skipProactive:true,personal:async()=>({at:Date.now(),seen:new Set(),watch:new Set()}),sourceRows:async()=>{sourceCalls++;return [media(606,'movie','Cache Test')]}});
 await R.buildPublic('trending',false);ok(sourceCalls===1&&host.querySelector('[data-ct312-public="trending"]'),'first public build failed');
 const before=host.innerHTML;const pending=R.buildPublic('trending',false);
 ok(!host.querySelector('.ct312-loading'),'cached revisit flashed loader');
 await pending;ok(sourceCalls===1&&host.innerHTML===before,'cached revisit refetched/repainted inconsistently');
 host.remove();

 // PRA VOCÊ: one panel, exact 1+3+3, compact actions.
 const mk=(id,type,kind,title)=>({id,tmdb_id:id,media_type:type,media_kind:kind,title,poster_path:'/p.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01',vote_average:8});
 const state={watchPools:{movie:[mk(1,'movie','movie','WM')],series:[mk(2,'tv','series','WS')],anime:[mk(3,'tv','anime','WA')]},freshPools:{movie:[mk(4,'movie','movie','FM')],series:[mk(5,'tv','series','FS')],anime:[mk(6,'tv','anime','FA')]},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[mk(7,'movie','movie','Daily'),mk(8,'movie','movie','Daily2')],dailyIndex:0};
 window.__ctR309Test?.setForYouState?.(state);
 const fy=document.createElement('div');fy.dataset.ct263DiscoverContent='1';document.body.appendChild(fy);dstate.tab='foryou';T.paintForYou312();
 const fyRoot=fy.querySelector('.ct312-foryou');ok(fyRoot&&fy.querySelectorAll('.ct312-foryou').length===1,'Pra Você is split into multiple panels');
 ok(fyRoot.querySelectorAll('.ct312-media-card').length===7,'Pra Você is not exact 1+3+3');
 const swaps=[...fyRoot.querySelectorAll('.ct312-mini-swap')];ok(swaps.length===7&&swaps.every(x=>parseFloat(getComputedStyle(x).height)<=30),'Pra Você has giant Trocar buttons');
 const fyButtons=[...fyRoot.querySelectorAll('.ct312-actions .chip')];ok(fyButtons.length===14&&fyButtons.every(x=>parseFloat(getComputedStyle(x).height)<=30),'Pra Você has giant action buttons');
 fy.remove();

 // PROFILE: stadium receives the same visual owner and an actual history click contract.
 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel"><div class="stats"><div class="stat ct311-stat-unified"><small>Eventos assistidos</small><b>68</b></div><div class="stat ct311-stat-unified"><small>Jogos no Estádio</small><b>1</b></div><div class="stat ct311-stat-unified" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>575</b></div><div class="stat ct311-stat-unified" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1370</b></div></div></section></div>';document.body.appendChild(p);
 ok(T.profileContracts312(p.querySelector('[data-profile]')),'Profile contracts not applied');
 const stats=[...p.querySelectorAll('.ct312-profile-stat')];ok(stats.length===4,'four Profile stats are not single-owner');
 const stadium=stats.find(x=>/Jogos no Estádio/.test(x.textContent));ok(stadium?.dataset.ct299History==='stadium'&&stadium.getAttribute('role')==='button'&&stadium.tabIndex===0,'Jogos no Estádio has no button/click contract');
 const sig=stats.map(x=>[getComputedStyle(x).display,getComputedStyle(x).borderRadius,getComputedStyle(x).backgroundColor,getComputedStyle(x).cursor].join('|'));ok(sig.every(x=>x===sig[0]),'Profile statistics do not share identical visual version');
 p.remove();

 // Favorite actor must invalidate persistent Profile cache immediately.
 localStorage.setItem('cinetracker:preload:r163:profile',JSON.stringify({at:Date.now(),value:{favorite_actors:[{actor_name:'Old'}]}}));
 document.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'favorite-actor-r312',id:3896}}));
 await Promise.resolve();ok(localStorage.getItem('cinetracker:preload:r163:profile')===null,'favorite actor left stale persistent Profile cache');

 // SPORTS: every payload sport becomes one inline filter option; selecting changes state without fetching payload.
 history.replaceState({},'','/sports');
 const sports=[{slug:'football',name:'Futebol',icon:'⚽'},{slug:'basketball',name:'Basquete',icon:'🏀'},{slug:'tennis',name:'Tênis',icon:'🎾'},{slug:'volleyball',name:'Vôlei',icon:'🏐'},{slug:'american_football',name:'Futebol Americano',icon:'🏈'},{slug:'hockey',name:'Hóquei',icon:'🏒'}];
 const catalog=T.sportsCatalog312({sports,events:[]});ok(catalog.length===sports.length&&sports.every(s=>catalog.some(x=>x.slug===s.slug)),'not all CineTracker sports are in filter');
 const sf=document.createElement('div');sf.innerHTML=T.sportsFilterMarkup312({sports,events:[]});document.body.appendChild(sf);
 ok(sf.querySelectorAll('[data-ct312-sport-filter]').length===sports.length+1,'sports filter missing Todos or a system sport');
 ok(T.selectSport312('basketball',false)==='basketball','interactive sports filter did not change selected sport');
 sf.remove();

 T.setBridge(null);
 document.documentElement.dataset.ct312done='1';
 document.documentElement.dataset.ct312auth='1';
 document.documentElement.dataset.ct312discover='1';
 document.documentElement.dataset.ct312foryou='1';
 document.documentElement.dataset.ct312profile='1';
 document.documentElement.dataset.ct312sports='1';
 document.documentElement.dataset.ct312errors=String(window.__ct312Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct312probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct312Errors||[]) }},4200)</script>`;

const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct312done="1"/.test(out)){const m=out.match(/data-ct312probe="([^"]*)"/);throw new Error('R312_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1600))}
for(const a of ['auth','discover','foryou','profile','sports'])if(!new RegExp('data-ct312'+a+'="1"').test(out))throw new Error('R312_BROWSER missing '+a);
const em=out.match(/data-ct312errors="([^"]*)"/);if(em?.[1])throw new Error('R312_BROWSER page errors '+em[1]);
console.log('R312_BROWSER_OK JWT retry + non-clipped filtered Discover + instant cache + compact Pra Você + stadium click + actor cache + all-sports filter');
