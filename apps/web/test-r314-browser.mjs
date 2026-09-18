import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r314.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct314Errors=[];addEventListener('error',e=>__ct314Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct314Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR314Test;ok(T,'r314 test bridge unavailable');
 const media=(id,type,title,date='2026-10-01')=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',release_date:type==='movie'?date:'',first_air_date:type==='tv'?date:'',vote_average:8.2});

 // Public barrier: exact watched + exact Watchlist + alias are gone before markup.
 T.setDiscover('trending','all');T.setPersonal({seen:['movie:1'],watch:['tv:2'],blocked:['movie:4'],aliases:['movie|mesmo titulo|2026']});
 const publicRows=[media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Elegível'),media(4,'movie','Bloqueado'),media(5,'movie','Mesmo Título')];
 const clean=T.filterPublic314(publicRows);ok(clean.length===1&&clean[0].tmdb_id===3,'public Discover leaked seen/Watchlist/exclusion');

 // Calendar: cards stay normal width, horizontally scrollable, metadata not clipped and actions fixed below.
 const host=document.createElement('div');host.innerHTML='<div data-ct314-discover><div data-ct314-content></div></div>';document.body.appendChild(host);
 T.setDiscover('calendar','all');T.setPersonal({seen:[],watch:['movie:101'],blocked:[],aliases:[]});
 const calendar=Array.from({length:12},(_,i)=>media(101+i,i%2?'tv':'movie','Título calendário muito longo '+(i+1),'2026-10-03'));
 ok(T.paintCalendar314(calendar),'calendar paint failed');
 const day=host.querySelector('.ct314-calendar-day'),rail=host.querySelector('.ct314-calendar-rail'),items=[...host.querySelectorAll('.ct314-calendar-rail .ct314-item')];
 ok(day&&rail&&items.length===12,'calendar grouping/items missing');
 ok(getComputedStyle(rail).overflowX==='auto','calendar has no native horizontal scroll');
 ok(items.every(x=>x.getBoundingClientRect().width>=150),'calendar generated narrow sliver cards');
 const first=items[0],actions=first.querySelector('.ct314-actions');ok(actions&&first.lastElementChild===actions,'calendar actions are not below card');
 const ab=[...actions.querySelectorAll('.chip')];ok(ab.length===2,'calendar Watchlist/Visto controls missing');
 ok(Math.abs(ab[0].getBoundingClientRect().top-ab[1].getBoundingClientRect().top)<2,'calendar buttons are not aligned side by side');
 const copy=first.querySelector('.ct288-copy');if(copy){const cs=getComputedStyle(copy);ok(cs.overflow==='visible'&&cs.maxHeight==='none','calendar title/metadata still clipped')}

 // Pra Você: one compact panel, 1+3+3, no giant buttons.
 const w1=media(201,'movie','W Filme'),w2=media(202,'movie','W Filme 2'),ws1=media(203,'tv','W Série'),ws2=media(204,'tv','W Série 2'),wa1=media(205,'tv','W Anime'),wa2=media(206,'tv','W Anime 2');
 const f1=media(211,'movie','Novo Filme'),f2=media(212,'movie','Novo Filme 2'),fs1=media(213,'tv','Nova Série'),fs2=media(214,'tv','Nova Série 2'),fa1=media(215,'tv','Novo Anime'),fa2=media(216,'tv','Novo Anime 2'),d1=media(217,'movie','Indicação'),d2=media(218,'movie','Indicação 2');
 window.__ctR309Test.setForYouState({watchPools:{movie:[w1,w2],series:[ws1,ws2],anime:[wa1,wa2]},freshPools:{movie:[f1,f2],series:[fs1,fs2],anime:[fa1,fa2]},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[d1,d2],dailyIndex:0,complete:true});
 T.setDiscover('foryou','all');ok(T.paintForYou314(),'For You paint failed');
 ok(host.querySelectorAll('.ct314-foryou-panel').length===1,'For You split into multiple panels');
 ok(host.querySelectorAll('.ct314-foryou-panel .ct314-item').length===7,'For You is not exact 1+3+3');
 const fyBtns=[...host.querySelectorAll('.ct314-foryou-panel .ct314-actions .chip')];ok(fyBtns.length>=14,'For You actions missing');
 ok(fyBtns.every(b=>b.getBoundingClientRect().height<=30.5),'For You giant button returned');
 ok(host.querySelectorAll('.ct314-fy-section').length===3,'For You sections wrong');
 host.remove();

 // Profile: four identical whole-card controls; Sports panel has Recolher and is actually collapsible.
 history.replaceState({},'','/profile');
 const profile=document.createElement('main');profile.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Estatísticas</h2></div><div class="stats"><div class="stat ct299-clickable-stat" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></div><div class="stat legacy-stadium" data-ct299-history="stadium"><small>Jogos no Estádio</small><b>1</b><span class="stat-arrow">›</span></div><div class="stat old-watch" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>566</b><span class="open-arrow">›</span></div><div class="stat old-watch" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1362</b><span class="profile-card-arrow">›</span></div></div></section><section class="panel sports-panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Tempo assistido</small><b>10h</b></div><div class="stat"><small>Eventos assistidos</small><b>68</b></div><div class="stat"><small>Jogos no Estádio</small><b>1</b></div></div></section></div>';document.body.appendChild(profile);
 const pr=profile.querySelector('[data-profile]');ok(T.normalizeStats314(pr),'Profile stat normalization failed');ok(T.ensureSportsCollapse314(pr),'Sports collapse missing');
 const target=[...pr.querySelectorAll('.ct314-stat')];ok(target.length>=4,'four canonical stats missing');
 const named=['Eventos assistidos','Jogos no Estádio','Séries Watchlist','Filmes Watchlist'].map(l=>target.find(x=>x.textContent.includes(l))).filter(Boolean);ok(named.length===4,'canonical Profile targets missing');ok(named.every(x=>x.className===named[0].className),'Profile statistic versions differ');
 ok(!pr.querySelector('.stat-arrow,.open-arrow,.profile-card-arrow'),'Profile arrow/version signal survived');
 ok(pr.querySelector('[data-ct299-history="stadium"]')&&pr.querySelector('[data-watchlist-kind="tv"]')&&pr.querySelector('[data-watchlist-kind="movie"]'),'Profile click contracts lost');
 const collapse=pr.querySelector('[data-ct314-sports-collapse]');ok(collapse&&/Recolher/.test(collapse.textContent),'Esportes assistidos has no Recolher');
 collapse.click();await new Promise(r=>setTimeout(r,20));ok(pr.querySelector('.ct314-sports-panel').classList.contains('ct314-collapsed'),'Sports panel did not collapse');
 collapse.click();await new Promise(r=>setTimeout(r,20));ok(!pr.querySelector('.ct314-sports-panel').classList.contains('ct314-collapsed'),'Sports panel did not expand');
 profile.remove();

 // F1 backup sanitizer: watched-record summary can never remain inside Hub.
 const f=document.createElement('div');f.innerHTML='<section data-ct255-f1><div class="ct255-f1-head"><span>F1 Hub</span></div><section class="panel watched-record"><small>Seu registro</small><h3>Fórmula 1 assistida</h3><article>Spanish Grand Prix · Desmarcar assistido</article></section><div class="ct255-f1-content">Conteúdo oficial</div></section>';document.body.appendChild(f);
 T.removeF1WatchSummary314(f);ok(!f.textContent.includes('Seu registro')&&!f.textContent.includes('Fórmula 1 assistida'),'F1 watched-record summary survived sanitizer');ok(f.textContent.includes('Conteúdo oficial'),'F1 official content was removed');f.remove();

 document.documentElement.dataset.ct314done='1';document.documentElement.dataset.ct314discover='1';document.documentElement.dataset.ct314calendar='1';document.documentElement.dataset.ct314foryou='1';document.documentElement.dataset.ct314profile='1';document.documentElement.dataset.ct314f1='1';document.documentElement.dataset.ct314errors=String(window.__ct314Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct314probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct314Errors||[]) }},4200)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=11000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct314done="1"/.test(out)){const m=out.match(/data-ct314probe="([^"]*)"/);throw new Error('R314_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['discover','calendar','foryou','profile','f1'])if(!new RegExp('data-ct314'+a+'="1"').test(out))throw new Error('R314_BROWSER missing '+a);
const em=out.match(/data-ct314errors="([^"]*)"/);if(em?.[1])throw new Error('R314_BROWSER page errors '+em[1]);
console.log('R314_BROWSER_OK new video: hard barrier + sane Calendar + compact For You + Profile Recolher + no F1 watched summary');
