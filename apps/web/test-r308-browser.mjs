import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r308.mjs');

let bin='';
for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');

const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const track=`<script>window.__ct308Errors=[];addEventListener('error',e=>__ct308Errors.push(String(e.message||e.error||e)));addEventListener('unhandledrejection',e=>__ct308Errors.push(String(e.reason||e)));</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};
 ok(window.__ctR308&&window.__ctR308Test,'r308 runtime unavailable');

 const media=(id,type,kind,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.3,release_date:'2025-01-01',first_air_date:'2025-01-01',genre_ids:kind==='anime'?[16,10759]:[35],original_language:kind==='anime'?'ja':'en'});
 const watch=[media(101,'movie','movie','Watch Movie'),media(102,'tv','series','Watch Series'),media(103,'tv','anime','Watch Anime')];
 const fresh=[media(201,'movie','movie','Fresh Movie'),media(202,'movie','movie','Daily A'),media(203,'movie','movie','Daily B'),media(204,'tv','series','Fresh Series'),media(205,'tv','anime','Fresh Anime')];
 const model=__ctR308Test.composeExact(watch,fresh,{trust:true});
 ok(model.complete===true,'exact composition is incomplete');
 ok(__ctR308Test.category(model.watch.movie)==='movie','watch movie slot');
 ok(__ctR308Test.category(model.watch.series)==='series','watch series slot');
 ok(__ctR308Test.category(model.watch.anime)==='anime','watch anime slot');
 ok(__ctR308Test.category(model.fresh.movie)==='movie','fresh movie slot');
 ok(__ctR308Test.category(model.fresh.series)==='series','fresh series slot');
 ok(__ctR308Test.category(model.fresh.anime)==='anime','fresh anime slot');
 ok(model.dailyPool.length===2,'daily needs a real swap pool');

 const shell=document.createElement('div');shell.innerHTML=__ctR308Test.forYouMarkup(model);document.body.appendChild(shell);
 const blocks=shell.querySelectorAll('.ct308-fy-block');ok(blocks.length===2,'missing Watchlist/100% novos blocks');
 for(const block of blocks){const labels=[...block.querySelectorAll('.ct308-slot h3')].map(x=>x.textContent.trim());ok(labels.join('|')==='Filme|Série|Anime','3+3 category order drift')}
 ok(shell.querySelector('[data-ct308-swap="daily"]'),'daily Trocar missing');
 ok(shell.querySelectorAll('.ct308-fy-block .ct308-slot').length===6,'exact 3+3 slots missing');
 ok([...shell.querySelectorAll('[data-ct308-action]')].every(x=>x.classList.contains('chip')),'Discover actions do not use system chip style');
 ok(shell.querySelectorAll('[data-ct308-action="seen"]').length===7,'Visto action must exist on all seven recommendations');
 ok(shell.querySelectorAll('[data-ct308-action="watchlist"]').length===7,'Watchlist state/action must exist on all seven recommendations');
 shell.remove();

 const rows=[media(301,'movie','movie','Seen'),media(302,'tv','series','Watchlist'),media(303,'movie','movie','Eligible')];
 const block=x=>Number(x.tmdb_id)!==303;
 for(const tab of ['trending','popular','new','anticipated','top']){
   const clean=__ctR308Test.filterPersonal(rows,tab,block);ok(clean.length===1&&clean[0].tmdb_id===303,tab+' leaked seen/watchlist');
 }
 for(const tab of ['calendar','foryou','top10'])ok(__ctR308Test.filterPersonal(rows,tab,block).length===3,tab+' must be exempt from general exclusion');

 const f1=document.createElement('div');f1.innerHTML='<div class="ct255-f1-tabs"><button data-ct255-f1tab="overview">Visão geral</button><button data-ct255-f1tab="calendar">Calendário</button><button data-ct255-f1tab="standings">Classificações</button><button data-ct255-f1tab="drivers">Pilotos</button><button data-ct255-f1tab="teams">Equipes</button><button data-ct255-f1tab="circuits">Circuitos</button></div>';document.body.appendChild(f1);
 __ctR308Test.normalizeF1Tabs();
 ok(!f1.querySelector('[data-ct255-f1tab="drivers"]'),'Pilotos survived r308 normalization');
 ok(!f1.querySelector('[data-ct255-f1tab="teams"]'),'Equipes survived r308 normalization');
 ok(f1.querySelectorAll('button').length===4,'F1 must expose exactly four tabs');
 f1.remove();

 const opened=[];__ctR308.setTestBridge({openRace:s=>opened.push(s)});
 const race=document.createElement('button');race.type='button';race.className='ct301-f1-event';race.setAttribute('data-ct301-f1-event','');race.dataset.eventId='2026-16';race.dataset.season='2026';race.innerHTML='<b>16. Grande Prêmio</b>';document.body.appendChild(race);race.click();
 await new Promise(r=>setTimeout(r,40));
 ok(opened.length===1,'calendar race click not captured');
 ok(opened[0].eventId==='2026-16'&&opened[0].round===16&&opened[0].season===2026,'calendar click opened wrong race/round');
 race.remove();__ctR308.setTestBridge(null);

 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><div class="ct-r238-profile-grid"><button class="stat"><small>Séries Watchlist</small><b>7</b><span class="stat-link-icon">›</span></button><button class="stat"><small>Filmes Watchlist</small><b>9</b><button class="profile-card-arrow">Abrir</button></button><button class="stat"><small>Eventos assistidos</small><b>3</b></button></div></div>';document.body.appendChild(p);
 __ctR308Test.stabilizeProfile();
 const watchStats=[...p.querySelectorAll('.stat')].filter(x=>/watchlist/i.test(x.textContent));
 ok(watchStats.length===2&&watchStats.every(x=>x.classList.contains('ct308-watchlist-stat')),'semantic Watchlist stats not stabilized');
 ok(!p.querySelector('.stat-link-icon')&&!p.querySelector('.profile-card-arrow'),'visible Watchlist click indicator remains');
 const pseudo=getComputedStyle(watchStats[0],'::after').content;ok(pseudo==='none'||pseudo==='normal'||pseudo==='""','Watchlist pseudo click indicator remains: '+pseudo);
 p.remove();

 document.documentElement.dataset.ct308done='1';
 document.documentElement.dataset.ct308exact='1';
 document.documentElement.dataset.ct308filter='1';
 document.documentElement.dataset.ct308f1='1';
 document.documentElement.dataset.ct308profile='1';
 document.documentElement.dataset.ct308errors=String(window.__ct308Errors.join(' | '));
}catch(e){document.documentElement.dataset.ct308probe=String(e?.stack||e)+' | pageErrors='+String(window.__ct308Errors||[])}},3800)</script>`;
const html=base.replace('</head>',track+'</head>').replace('</body>',probe+'</body>');

const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/', 'http://127.0.0.1'),path=u.pathname;
  if(path==='/'||path==='/discover'||path==='/profile'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}
  const safe=path.replace(/^\/+/,''),file=resolve(dist,safe);
  if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
  const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body);
 }catch{res.writeHead(404);res.end('not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const port=server.address().port;
const args=['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=9000','--dump-dom',`http://127.0.0.1:${port}/`];
const child=spawn(bin,args,{stdio:['ignore','pipe','pipe']});let out='',err='';
child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-2000));
if(!/data-ct308done="1"/.test(out)){
 const m=out.match(/data-ct308probe="([^"]*)"/);throw new Error('R308_BROWSER '+(m?.[1]||'probe did not finish')+' stderr='+err.slice(-1200));
}
for(const attr of ['ct308exact','ct308filter','ct308f1','ct308profile'])if(!new RegExp('data-'+attr+'="1"').test(out))throw new Error('R308_BROWSER missing '+attr);
const em=out.match(/data-ct308errors="([^"]*)"/);if(em?.[1])throw new Error('R308_BROWSER page errors '+em[1]);
console.log('R308_BROWSER_OK exact 1+3+3 + personal browse exclusion + F1 round click + stable Profile');
