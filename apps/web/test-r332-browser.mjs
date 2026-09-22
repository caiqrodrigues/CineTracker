import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r332.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR332,T=window.__ctR321Test;
 ok(X&&T,'r332 bridge unavailable');
 ok(window.__ctOfficialVersion==='1.0.123','version stale');

 /* Home history is real page content above the anchor; no history toggle survives. */
 history.replaceState({},'','/home');
 document.querySelector('#app').innerHTML='<div data-home><div class="home-tabs" style="height:38px"><button class="chip active" data-home-tab="series">Séries</button><button class="chip" data-home-tab="movies">Filmes</button></div><div data-home-view="series" class="home-list"><section class="home-section ct274-history is-collapsed" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="stack ct274-history-stack"><div>ANTIGO</div><div>MAIS RECENTE</div></div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div><div class="stack"><div>Reacher</div></div></section></div><div data-home-view="movies" class="home-list hidden"><section class="home-section ct274-history" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3></div><div class="ct275-history-shell"><div class="stack ct274-history-stack"><div>Filme antigo</div><div>Filme recente</div></div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3></div></section></div></div>';
 X.normalizeHistory();
 const hist=document.querySelector('[data-ct274-history="episodes"]');
 ok(hist.classList.contains('is-open')&&!hist.classList.contains('is-collapsed'),'history did not normalize open in page flow');
 ok(!hist.querySelector('[data-ct275-history-toggle],[data-ct324-history-toggle]'),'history button survived');
 ok(getComputedStyle(hist.querySelector('.ct274-history-stack')).overflowY!=='auto'&&getComputedStyle(hist.querySelector('.ct274-history-stack')).overflowY!=='scroll','history still has inner scroller');
 ok(X.homeAnchor('series')?.querySelector('h3')?.textContent==='Assistir a seguir','series initial anchor wrong');
 ok(X.homeAnchor('movies')?.querySelector('h3')?.textContent.includes('Assistir a seguir'),'movies initial anchor wrong');

 /* Episode pointer cannot point behind the consolidated watched state. */
 const reacher={last_season_number:4,last_episode_number:4,next_season_number:4,next_episode_number:3,released_episodes:32,watched_episodes:28,home_bucket:'continue'};
 X.repairStaleNext(reacher);
 ok(reacher.next_season_number===4&&reacher.next_episode_number===5,'Reacher stale pointer not advanced past S04E04');
 ok(reacher.available_episodes===4,'Reacher availability changed incorrectly');

 /* ForYou: one audited owner, blocked title absent, filters visible, three compact actions on one row. */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><button data-ct319-filter></button><div data-ct319-types></div><div data-ct319-content data-ct315-content data-ct263-discover-content></div></div>';
 try{window.__ctR288R263.discover263.tab='foryou'}catch{}
 T.setDiscover('foryou','all');
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.1,release_date:'2024-01-01',first_air_date:'2024-01-01',...extra});
 const watchState={
  watchPools:{
   movie:[media(614696,'movie','#Alive')],
   series:[media(64464,'tv','11.22.63')],
   anime:[media(100436,'tv','Akudama Drive',{genre_ids:[16],origin_country:['JP'],original_language:'ja'})]
  },
  freshPools:{
   movie:[1,2,3,4,5].map(i=>media(80000+i,'movie','Filme Livre '+i)),
   series:[media(236235,'tv','Magnatas do Crime',{original_name:'The Gentlemen'}),...([1,2,3].map(i=>media(81000+i,'tv','Série Livre '+i)))],
   anime:[1,2,3].map(i=>media(82000+i,'tv','Anime Livre '+i,{genre_ids:[16],origin_country:['JP'],original_language:'ja'}))
  },
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[media(83001,'movie','Daily Livre'),media(83002,'movie','Daily Livre 2')],dailyIndex:0,
  initial:{watch:{},fresh:{},daily:null},complete:true
 };
 window.__ctR309Test.setForYouState(watchState);
 T.setTestBridge({exact:async items=>({
  blocked_keys:items.filter(x=>x.tmdb_id===236235).map(x=>x.media_type+':'+x.tmdb_id),
  seen_keys:items.filter(x=>x.tmdb_id===236235).map(x=>x.media_type+':'+x.tmdb_id),
  watch_keys:items.filter(x=>[614696,64464,100436].includes(x.tmdb_id)).map(x=>x.media_type+':'+x.tmdb_id),
  not_interested_keys:[]
 })});
 const fyResult=await Promise.race([window.__ctR321.loadForYou(false),new Promise((_,rej)=>setTimeout(()=>rej(new Error('ForYou audit froze')),2500))]);
 ok(fyResult!==false,'ForYou audited load failed');
 X.normalizeForYou();
 const fy=document.querySelector('[data-ct329-foryou][data-ct332-final="1"]');
 ok(fy,'r329 final ForYou owner missing');
 ok(!fy.textContent.includes('Magnatas do Crime'),'blocked UpToDate title leaked into 100% novos');
 const actions=[...fy.querySelectorAll('.ct329-actions')];
 ok(actions.length>=3,'ForYou action rows missing');
 for(const row of actions){
  const buttons=[...row.querySelectorAll('button')];ok(buttons.length===3,'ForYou row does not have three actions');
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));ok(new Set(tops).size===1,'ForYou actions wrapped');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'ForYou action text may wrap');
 }
 const filters=document.querySelector('[data-ct319-types]');
 ok(filters&&filters.querySelectorAll('[data-ct328-fy-kind]').length===4,'ForYou filters missing');
 window.__ctR319Test.state.fyKind='movie';window.__ctR329.applyFilter();
 ok([...fy.querySelectorAll('[data-ct329-kind="series"]')].every(x=>x.hidden),'series visible under movie filter');
 ok([...fy.querySelectorAll('[data-ct329-kind="anime"]')].every(x=>x.hidden),'anime visible under movie filter');
 ok([...fy.querySelectorAll('[data-ct329-kind="movie"]')].some(x=>!x.hidden),'movie filter hid all movies');
 T.setTestBridge(null);

 document.documentElement.dataset.ct332done='1';
}catch(e){document.documentElement.dataset.ct332probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=390,844','--virtual-time-budget=17000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct332done="1"/.test(out)){const m=out.match(/data-ct332probe="([^"]*)"/);throw new Error('R332_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R332_BROWSER_OK Home anchor + Reacher pointer + audited r329 ForYou');
