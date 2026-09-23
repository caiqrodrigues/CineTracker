import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r337.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v337.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',diag+'</head>');
const probe=`<script>setTimeout(async()=>{document.documentElement.dataset.ct337step='start';try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR337,R=window.__ctR336,T=window.__ctR336Test;
 if(!(X&&R&&T))throw new Error('r337 bridges unavailable '+(window.__ctDiagErrors||[]).join(' || '));
 ok(window.__ctOfficialVersion==='1.0.128','web version stale');

 document.documentElement.dataset.ct337step='home';history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home><div class="home-tabs"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series"><section data-ct274-history="episodes"><div class="ct274-history-stack">hist</div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div></section></div><div data-home-view="movies" class="hidden" hidden><section data-ct274-history="movies"><div class="ct274-history-stack">hist</div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3></div></section></div></div></div>';
 X.rememberHome('movies');
 document.querySelector('[data-home-tab="series"]').classList.add('active');document.querySelector('[data-home-tab="movies"]').classList.remove('active');
 document.querySelector('[data-home-view="series"]').hidden=false;document.querySelector('[data-home-view="series"]').classList.remove('hidden');document.querySelector('[data-home-view="movies"]').hidden=true;document.querySelector('[data-home-view="movies"]').classList.add('hidden');
 X.armHome('movies');await new Promise(r=>setTimeout(r,90));
 ok(document.querySelector('[data-home-tab="movies"]').classList.contains('active'),'stale repaint won over desired Filmes');
 ok(!document.querySelector('[data-home-view="movies"]').hidden,'movie view not restored');
 ok(document.querySelector('[data-home-view="movies"] .home-section:not([data-ct274-history])').dataset.ct337HomeAnchor==='1','movie anchor missing');

 document.documentElement.dataset.ct337step='foryou';history.replaceState({},'','/discover');document.body.innerHTML='<div id="app"><div data-ct319-content></div></div>';
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.1,release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 window.__ctR309Test.setForYouState({watchPools:{movie:[media(201,'movie','Watch A'),media(204,'movie','Watch B')],series:[media(202,'tv','Watch Series'),media(205,'tv','Watch Series B')],anime:[media(203,'tv','Watch Anime',{genre_ids:[16],origin_country:['JP']}),media(206,'tv','Watch Anime B',{genre_ids:[16],origin_country:['JP']})]},freshPools:{movie:[media(10,'movie','Fresh A'),media(11,'movie','Fresh B')],series:[media(20,'tv','Fresh Series'),media(21,'tv','Fresh Series B')],anime:[media(30,'tv','Fresh Anime',{genre_ids:[16],origin_country:['JP']}),media(31,'tv','Fresh Anime B',{genre_ids:[16],origin_country:['JP']})]},dailyPool:[media(40,'movie','Daily A'),media(41,'movie','Daily B')],watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0});
 window.__ctR288R263.discover263.tab='foryou';R.paintForYou();
 const actionRow=document.querySelector('[data-ct336-section="fresh"] .ct336-actions-three'),buttons=[...actionRow.querySelectorAll(':scope > button')];
 ok(buttons.length===3,'three actions missing');ok(new Set(buttons.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'actions wrapped');
 ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'&&b.getBoundingClientRect().width>45),'actions unreadable');
 const seriesBefore=document.querySelector('[data-ct336-slot="fresh:series"]').textContent,movieBefore=document.querySelector('[data-ct336-slot="fresh:movie"]').textContent;
 R.swapForYou('fresh:movie');
 ok(document.querySelector('[data-ct336-slot="fresh:movie"]').textContent!==movieBefore,'movie swap did not rotate');
 ok(document.querySelector('[data-ct336-slot="fresh:series"]').textContent===seriesBefore,'movie swap changed series');

 document.documentElement.dataset.ct337step='search';document.body.innerHTML='<div id="app"><div data-global-results></div></div>';
 X.setTestBridge({standard:async()=>[{id:501,media_type:'movie',title:'Nome X',poster_path:'/m.jpg'},{id:502,media_type:'tv',name:'Nome X',poster_path:'/t.jpg'},{id:503,media_type:'person',name:'Nome X',profile_path:'/p.jpg'}],catalog:async()=>[{show_tmdb_id:113962,show_name:'Série Pai',name:'Nome X',season_number:3,episode_number:8,poster_path:'/e.jpg'}]});
 R.setTestBridge({targets:async()=>[]});
 await Promise.race([X.globalSearch('Nome X'),new Promise((_,rej)=>setTimeout(()=>rej(new Error('search timeout')),2500))]);
 const txt=document.querySelector('[data-global-results]').textContent;
 ok(txt.includes('Nome X')&&txt.includes('Série Pai')&&txt.includes('T03E08'),'episode exact-name result missing');
 ok(document.querySelector('[data-media="movie:501"]'),'movie result missing');ok(document.querySelector('[data-media="tv:502"]'),'series result missing');ok(document.querySelector('[data-person="503"]'),'person result missing');

 document.documentElement.dataset.ct337step='done';document.documentElement.dataset.ct337done='1';
}catch(e){document.documentElement.dataset.ct337probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},5600)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=20000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct337done="1"/.test(out)){const m=out.match(/data-ct337probe="([^"]*)"/),st=out.match(/data-ct337step="([^"]*)"/);throw new Error('R337_BROWSER '+(m?.[1]||('probe did not finish step='+(st?.[1]||'none'))))}
console.log('R337_BROWSER_OK exact episode search + Home desired tab + same-kind readable ForYou actions');
