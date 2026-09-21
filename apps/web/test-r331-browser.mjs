import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r331.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR331,XT=window.__ctR331Test,R=window.__ctR319Test,T=window.__ctR321Test,R309=window.__ctR309Test,R325=window.__ctR325Test;
 ok(X&&XT&&R&&T&&R309&&R325,'r331 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.122','version stale');

 /* HOME: history is loaded above the viewport; no toggle/nested scroll; anchor is first normal section. */
 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
  '<div class="home-tabs"><button data-home-tab="series">Séries</button><button data-home-tab="movies">Filmes</button></div>'+
  '<div data-home-view="series" class="home-list">'+
   '<section data-ct274-history="episodes" class="home-section is-collapsed"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver Histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack">'+Array.from({length:50},(_,i)=>'<div style="height:32px">hist '+i+'</div>').join('')+'</div></div></section>'+
   '<section class="home-section" data-probe-target style="min-height:700px"><h3>Assistir a seguir</h3></section>'+
  '</div>'+
  '<div data-home-view="movies" class="home-list hidden"><section data-ct274-history="movies" class="home-section"><div class="ct275-history-shell"><div class="ct274-history-stack"><div style="height:900px">movies history</div></div></div></section><section class="home-section"><h3>Assistir a seguir / Watchlist</h3></section></div>'+
 '</div></div>';
 X.normalizeHomeHistory();const sec=document.querySelector('[data-ct274-history="episodes"]'),stack=sec.querySelector('.ct274-history-stack');
 ok(!sec.querySelector('[data-ct275-history-toggle]'),'Home history toggle survived');
 ok(getComputedStyle(stack).overflowY==='visible','Home history still has nested scroll');
 ok(getComputedStyle(stack).maxHeight==='none','Home history still bounded');
 ok(X.homeAnchorTarget()?.querySelector('h3')?.textContent==='Assistir a seguir','Home anchor is not first normal section');
 X.beginHomeAnchor(700);await new Promise(r=>setTimeout(r,120));
 ok(window.scrollY>500,'Home did not start below history');
 ok(Math.abs(document.querySelector('[data-probe-target]').getBoundingClientRect().top)<=30,'Home target not anchored near viewport top');

 /* PRA VOCE: v327-style filtered draft plus persistent filters and exactly 3 one-row actions. */
 history.replaceState({},'','/discover');
 const shell=R.shell319();
 document.body.innerHTML='<div id="app">'+shell+'</div>';
 R.setDiscover('foryou','all');R.state.fyKind='all';R.state.filterOpen=false;
 const movie=(id,title)=>({id,tmdb_id:id,media_type:'movie',title,original_title:title,poster_path:'/m'+id+'.jpg',release_date:'2024-01-01',vote_average:8});
 const series=(id,title,anime=false)=>({id,tmdb_id:id,media_type:'tv',name:title,original_name:title,poster_path:'/t'+id+'.jpg',first_air_date:'2024-01-01',vote_average:8,genre_ids:anime?[16]:[18],original_language:anime?'ja':'en'});
 const watch={movie:[movie(614696,'#Alive')],series:[series(64464,'11.22.63')],anime:[series(100436,'Akudama Drive',true)]};
 const fresh={movie:[movie(277834,'Moana'),movie(2001,'M1'),movie(2002,'M2'),movie(2003,'M3'),movie(2004,'M4'),movie(2005,'M5')],series:[series(3001,'S1'),series(3002,'S2'),series(3003,'S3')],anime:[series(4001,'A1',true),series(4002,'A2',true),series(4003,'A3',true)]};
 R309.setForYouState({watchPools:watch,freshPools:fresh,watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:fresh.movie,dailyIndex:0,initial:{watch:{movie:watch.movie[0],series:watch.series[0],anime:watch.anime[0]},fresh:{movie:fresh.movie[0],series:fresh.series[0],anime:fresh.anime[0]},daily:fresh.movie[0]},complete:true});
 T.setTestBridge({exact:async items=>({
  blocked_keys:items.filter(x=>[277834,614696,64464,100436].includes(x.tmdb_id)).map(x=>x.media_type+':'+x.tmdb_id),
  watch_keys:['movie:614696','tv:64464','tv:100436'],
  seen_keys:['movie:277834'],
  not_interested_keys:[]
 })});
 await window.__ctR321.loadForYou(false);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));X.settleForYou();
 const fy=document.querySelector('[data-ct309-foryou]');ok(fy,'Pra voce did not render');
 ok(![...fy.querySelectorAll('[data-ct288-card]')].some(c=>c.dataset.ct288Card==='movie:277834'),'seen Moana survived Pra voce rules');
 const filters=[...document.querySelectorAll('[data-ct331-fy-kind]')];ok(filters.length===4,'Pra voce visible filters missing');
 ok(filters.map(b=>b.textContent.trim()).join('|')==='Todos|Filmes|Séries|Animes','Pra voce filter labels wrong');
 const rows=[...fy.querySelectorAll('.ct309-daily-card,.ct309-slot')].filter(c=>c.querySelector('[data-ct288-card]'));
 ok(rows.length>=7,'Pra voce cards incomplete');
 for(const c of rows){
  const buttons=[...c.querySelectorAll(':scope > .ct309-actions > .chip')];ok(buttons.length===3,'Pra voce card does not have 3 actions');
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));ok(new Set(tops).size===1,'Pra voce buttons wrap to another line');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'Pra voce action text wraps');
 }
 R.state.fyKind='movie';X.applyForYouFilter();
 ok(!fy.querySelector('[data-ct309-slot="fresh:movie"]').hidden,'movie filter hid movie');
 ok(fy.querySelector('[data-ct309-slot="fresh:series"]').hidden,'movie filter failed to hide series');
 ok(fy.querySelector('[data-ct309-slot="fresh:anime"]').hidden,'movie filter failed to hide anime');

 /* EPISODE RELEASE: recent latest release marks the series NOVO even if first unseen is older. */
 R325.setTestBridge({
  show:async()=>({number_of_episodes:32,status:'Returning Series',last_episode_to_air:{season_number:4,episode_number:7,air_date:'2026-09-20'},seasons:[{season_number:1,episode_count:8},{season_number:2,episode_count:8},{season_number:3,episode_count:8},{season_number:4,episode_count:8}]}),
  firstUnseen:async()=>({season_number:4,episode_number:5,name:'A Ponte',air_date:'2026-08-26',vote_average:7})
 });
 const reacher=await R325.reconcileOne325({tmdb_id:108978,watched_episodes:28,released_episodes:28,total_episodes:32,home_bucket:'continue'});
 ok(reacher.__ct325NewEpisode===true,'recent Reacher release was not marked NOVO');
 ok(reacher.next_season_number===4&&reacher.next_episode_number===5,'first unseen Reacher episode changed unexpectedly');
 ok(reacher.released_episodes>=31,'released episode count did not follow current show metadata');

 document.documentElement.dataset.ct331done='1';
}catch(e){document.documentElement.dataset.ct331probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct331done="1"/.test(out)){const m=out.match(/data-ct331probe="([^"]*)"/);throw new Error('R331_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R331_BROWSER_OK Home anchor + strict Pra voce + inline actions + episode release truth');
