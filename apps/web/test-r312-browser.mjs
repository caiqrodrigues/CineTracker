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
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR312Test;ok(T,'r312 test bridge unavailable');
 ok(T.jwtExpired312(new Error('JWT expired'))===true,'JWT expired not recognized');
 ok(T.jwtExpired312(new Error('ordinary failure'))===false,'ordinary error misclassified as JWT');

 history.replaceState({},'','/discover');
 const shell=document.createElement('main');shell.innerHTML=T.shellHtml312();document.body.appendChild(shell);
 ok(shell.querySelectorAll('[data-ct312-tab]').length===8,'Discover does not keep canonical eight tabs');
 const content=shell.querySelector('[data-ct312-content]');content.innerHTML='<div class="loader">Carregando títulos…</div>';
 ok(shell.querySelectorAll('[data-ct312-tab]').length===8,'Discover tabs disappeared while content loads');

 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',overview:'Descrição completa de '+title+' que precisa permanecer legível abaixo do filme sem corte.',vote_average:8.4,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setDiscover('trending','all');T.setPersonal({seen:['movie:1'],watch:['tv:2']});
 const clean=T.filterPublic312([media(1,'movie','Já visto'),media(2,'tv','Na Watchlist'),media(3,'movie','Elegível')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'seen/watchlist survived final public Discover barrier');
 const holder=document.createElement('div');holder.innerHTML=T.card312(clean[0],false);document.body.appendChild(holder);
 const card=holder.querySelector('.ct312-card'),body=holder.querySelector('.ct312-card-body'),actions=holder.querySelector('.ct312-actions');
 ok(card&&actions&&card.querySelector('.ct312-open').nextElementSibling===actions,'actions are not fixed below card');
 ok(actions.querySelectorAll('[data-ct312-action]').length===2,'Watchlist + Visto not both visible');
 ok(actions.querySelector('[data-ct312-action="watchlist"]').textContent.trim()==='+ Watchlist','Watchlist button missing');
 for(const b of actions.querySelectorAll('button'))ok(getComputedStyle(b).position==='static','Discover action floats/changes position');
 const bs=getComputedStyle(body);ok(bs.overflow==='visible','card metadata wrapper still clips');
 const titleStyle=getComputedStyle(body.querySelector('b')),metaStyle=getComputedStyle(body.querySelector('small'));ok(titleStyle.whiteSpace==='normal'&&titleStyle.overflow==='visible','movie title is clipped');ok(metaStyle.whiteSpace==='normal'&&metaStyle.overflow==='visible','movie metadata is clipped');
 ok((titleStyle.webkitLineClamp||'unset')==='unset'||(titleStyle.webkitLineClamp||'none')==='none','movie title still line-clamped');
 holder.remove();

 const st={
   watchPools:{movie:[media(11,'movie','WM1'),media(12,'movie','WM2')],series:[media(13,'tv','WS1'),media(14,'tv','WS2')],anime:[media(15,'tv','WA1'),media(16,'tv','WA2')]},
   freshPools:{movie:[media(21,'movie','FM1'),media(22,'movie','FM2')],series:[media(23,'tv','FS1'),media(24,'tv','FS2')],anime:[media(25,'tv','FA1'),media(26,'tv','FA2')]},
   watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[media(31,'movie','Daily1'),media(32,'movie','Daily2')],dailyIndex:0
 };
 window.__ctR309Test.setForYouState(st);T.setDiscover('foryou','all');ok(T.paintForYou312(st),'compact Pra Você did not paint');
 ok(content.querySelectorAll('.ct312-fy-slot').length===6,'Pra Você is not exact 3+3');
 ok(content.querySelectorAll('.ct312-daily .ct312-card').length===1,'daily card missing');
 const fyPanels=[...content.querySelectorAll('.ct312-foryou>.panel')];ok(fyPanels.length===3,'Pra Você blocks missing');
 ok(fyPanels.every(x=>parseFloat(getComputedStyle(x).paddingTop)<=12),'Pra Você giant panel padding returned');
 ok([...content.querySelectorAll('.ct312-swap')].every(x=>parseFloat(getComputedStyle(x).height)<=31),'Trocar buttons are giant');

 shell.remove();
 history.replaceState({},'','/profile');
 const profile=document.createElement('main');profile.innerHTML='<div data-profile><section class="panel"><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><button class="stat ct311-stat-unified" data-ct299-history="all"><small>Eventos assistidos</small><b>68</b></button></div></section><section class="panel"><div class="panel-head"><h2>Atores Favoritos</h2><small>17</small></div><div class="row"><article class="card"><button data-person="1">Antigo</button></article></div></section><section class="panel"><div class="stats"><button class="stat ct311-stat-unified" data-watchlist-kind="tv"><small>Séries Watchlist</small><b>500</b></button><button class="stat ct311-stat-unified" data-watchlist-kind="movie"><small>Filmes Watchlist</small><b>1000</b></button></div></section></div>';document.body.appendChild(profile);
 const root=profile.querySelector('[data-profile]');
 ok(T.ensureStadium312(root,3),'stadium button was not created');
 const stadium=[...root.querySelectorAll('.stat,[data-stat],button')].find(x=>x.textContent.includes('Jogos no Estádio'));
 const events=[...root.querySelectorAll('.stat,[data-stat],button')].find(x=>x.textContent.includes('Eventos assistidos'));
 ok(stadium&&stadium.dataset.ct299History==='stadium','stadium click contract missing');
 ok(stadium.className===events.className,'stadium button is not identical to Eventos assistidos');
 T.patchActors312(root,[{tmdb_person_id:3896,actor_name:'Liam Neeson',profile_path:'/liam.jpg'},{tmdb_person_id:2,actor_name:'Outro Ator',profile_path:null}]);
 ok(root.textContent.includes('Liam Neeson'),'new favorite actor did not refresh Profile');
 ok(root.querySelector('.panel-head small').textContent==='2'||[...root.querySelectorAll('.panel-head small')].some(x=>x.textContent==='2'),'favorite actor count not refreshed');
 profile.remove();

 history.replaceState({},'','/sports');
 const sports=document.createElement('main');sports.innerHTML='<div data-ct255-sports><div class="ct255-sport-filters"><button>global old</button></div><section class="panel ct255-sports-feed"><div class="panel-head"><h2>Próximos</h2><small>4</small></div><div class="ct255-sport-grid"></div></section></div>';document.body.appendChild(sports);
 sport255.tab='next';sport255.sport='all';sport255.payload={sports:[{slug:'football',icon:'⚽',name:'Futebol'},{slug:'basketball',icon:'🏀',name:'Basquete'},{slug:'tennis',icon:'🎾',name:'Tênis'},{slug:'volleyball',icon:'🏐',name:'Vôlei'}]};
 ok(window.__ctR312.sportsInline(),'inline sports filter failed');
 ok(!sports.querySelector('.ct255-sport-filters'),'old global sports filter survived');
 const filter=sports.querySelector('.ct312-sport-filter');ok(filter&&filter.closest('.panel-head'),'sports filter is not beside Próximos');
 ok(filter.querySelectorAll('[data-ct312-sport-filter]').length===5,'not all payload sports + Todos were rendered');
 ok(filter.textContent.includes('Futebol')&&filter.textContent.includes('Basquete')&&filter.textContent.includes('Tênis')&&filter.textContent.includes('Vôlei'),'payload sports missing');
 sport255.tab='previous';window.__ctR312.sportsInline();ok(sports.querySelector('.ct312-sport-filter'),'Anteriores lost inline filter');
 sport255.tab='watched';window.__ctR312.sportsInline();ok(!sports.querySelector('.ct312-sport-filter'),'inline filter leaked into Assistidos');
 sports.remove();

 document.documentElement.dataset.ct312done='1';
 document.documentElement.dataset.ct312discover='1';
 document.documentElement.dataset.ct312profile='1';
 document.documentElement.dataset.ct312sports='1';
 document.documentElement.dataset.ct312auth='1';
 document.documentElement.dataset.ct312errors=String(window.__ct312Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct312probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct312Errors||[]) }},4000)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/profile'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.replace(/^\/+/,''),file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=11000','--dump-dom',`http://127.0.0.1:${port}/`],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct312done="1"/.test(out)){const m=out.match(/data-ct312probe="([^"]*)"/);throw new Error('R312_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1500))}
for(const a of ['discover','profile','sports','auth'])if(!new RegExp('data-ct312'+a+'="1"').test(out))throw new Error('R312_BROWSER missing '+a);
const em=out.match(/data-ct312errors="([^"]*)"/);if(em?.[1])throw new Error('R312_BROWSER page errors '+em[1]);
console.log('R312_BROWSER_OK persistent Discover + hard personal barrier + compact Pra Você + stadium/live actors + inline sports filters');
