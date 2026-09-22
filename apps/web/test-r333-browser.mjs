import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r333.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR333,XT=window.__ctR333Test,T=window.__ctR321Test;
 ok(X&&XT&&T,'r333 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.124','web version stale');

 const cit=X.normalizeSeries({watched_episodes:13,released_episodes:13,available_episodes:1,home_bucket:'continue',last_season_number:2,last_episode_number:7,next_season_number:2,next_episode_number:7});
 ok(cit.available_episodes===0&&cit.home_bucket==='up_to_date'&&!cit.next_episode_number,'Citadel-like stale availability survived');
 const stu=X.normalizeSeries({watched_episodes:9,released_episodes:6,total_episodes:10,available_episodes:1,home_bucket:'continue',last_season_number:1,last_episode_number:9,next_season_number:1,next_episode_number:6});
 ok(stu.released_episodes===9&&stu.available_episodes===0&&stu.home_bucket==='up_to_date'&&!stu.next_episode_number,'Stuart-like stale availability survived');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home><div class="home-tabs"><button class="active" data-home-tab="series">Séries</button></div><div data-home-view="series"><section data-ct274-history="episodes" class="is-collapsed"><div class="panel-head"><h3>Histórico</h3><button data-ct275-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack" style="max-height:0;overflow:auto"><div>antigo</div><div>recente</div></div></div></section><section class="home-section"><div class="panel-head"><h3>Assistir a seguir</h3></div></section></div></div></div>';
 X.normalizeHome();
 ok(!document.querySelector('[data-ct275-history-toggle]'),'history toggle survived');
 ok(document.querySelector('[data-ct274-history]').classList.contains('is-open'),'history did not become natural-flow content');
 ok(getComputedStyle(document.querySelector('.ct274-history-stack')).overflow==='visible','history kept inner scroller');
 ok(document.querySelector('.ct274-history-stack').lastElementChild.textContent==='recente','history DOM order changed');

 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><div class="ct319-tab-shell"><button data-ct319-prev>‹</button><div data-ct319-tabs><button data-ct319-tab="foryou">Pra você</button></div><button data-ct319-next>›</button><button data-ct319-filter>☷</button></div><div data-ct319-types hidden></div><div data-ct319-content></div></div></div>';
 T.setDiscover('foryou','all');
 X.normalizeDiscover();
 ok(!document.querySelector('[data-ct319-prev]')&&!document.querySelector('[data-ct319-next]')&&!document.querySelector('[data-ct319-filter]'),'obsolete Discover controls survived');
 const types=document.querySelector('[data-ct319-types]');ok(types&&!types.hidden,'ForYou filters hidden');
 const labels=[...types.querySelectorAll('button')].map(b=>b.textContent.trim()).join('|');
 ok(labels.includes('Todos')&&labels.includes('Filmes')&&labels.includes('Séries')&&labels.includes('Animes'),'ForYou filters incomplete');

 const actions=window.__ctR329Test?.actions329?.({media_type:'movie',tmdb_id:1,title:'Teste'},{saved:false,swap:'daily',canSwap:true})||'';
 const box=document.createElement('div');box.innerHTML=actions;document.body.appendChild(box);
 const btns=[...box.querySelectorAll('button')];ok(btns.length===3,'ForYou did not render three actions');
 ok(btns.map(b=>b.textContent).join('|').includes('Trocar'),'Trocar action missing');
 ok(new Set(btns.map(b=>Math.round(b.getBoundingClientRect().top))).size===1,'ForYou actions wrapped');

 T.setTestBridge({
   topPage:async(provider,page)=>({
     movies:Array.from({length:10},(_,i)=>({media_type:'movie',tmdb_id:(page-1)*10+i+1,id:(page-1)*10+i+1,title:'M'+((page-1)*10+i+1),poster_path:'/x.jpg'})),
     series:Array.from({length:10},(_,i)=>({media_type:'tv',tmdb_id:100+(page-1)*10+i+1,id:100+(page-1)*10+i+1,name:'S'+((page-1)*10+i+1),poster_path:'/x.jpg'}))
   }),
   exact:async items=>({
     blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=8)||(x.tmdb_id>=101&&x.tmdb_id<=108)).map(x=>x.media_type+':'+x.tmdb_id),
     watch_keys:[],seen_keys:[],not_interested_keys:[]
   })
 });
 const top=await window.__ctR321.topRaw(8,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not refill to ten after exclusions');
 ok(top.movies[0].tmdb_id===9&&top.movies[2].tmdb_id===11,'Top10 movie ranking did not continue after blocked first page');
 ok(top.series[0].tmdb_id===109&&top.series[2].tmdb_id===111,'Top10 series ranking did not continue after blocked first page');

 ok(typeof X.warmSports==='function','sports warmup API missing');
 document.documentElement.dataset.ct333done='1';
}catch(e){document.documentElement.dataset.ct333probe='fail:'+String(e?.stack||e)}},4800)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=15000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct333done="1"/.test(out)){const m=out.match(/data-ct333probe="([^"]*)"/);throw new Error('R333_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R333_BROWSER_OK Home natural history + direct filters + three actions + Top10 refill + sports warmup');
