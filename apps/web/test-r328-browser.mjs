import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r328.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR328,T=window.__ctR321Test;
 ok(X&&T,'r328 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.119','web version stale');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home>'+
  '<div data-home-view="series"><section data-ct274-history="episodes" class="home-section is-collapsed"><div class="panel-head"><h3>Histórico recente</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack"><div>ANTIGO</div><div>MAIS RECENTE</div></div></div></section><section class="home-section" id="series-next"><div class="panel-head"><h3>Assistir a seguir</h3></div><div>CONTINUE</div></section><section class="home-section"><h3>Juntando poeira</h3></section></div>'+
  '<div data-home-view="movies" class="hidden"><section data-ct274-history="movies" class="home-section is-collapsed"><div class="panel-head"><h3>Filmes vistos</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack"><div>ANTIGO M</div><div>MAIS RECENTE M</div></div></div></section><section class="home-section" id="movies-next"><div class="panel-head"><h3>Assistir a seguir / Watchlist</h3></div><div>NEXT MOVIES</div></section></div>'+
  '</div></div>';
 let scrollYValue=700,lastTop=-1;Object.defineProperty(window,'scrollY',{configurable:true,get:()=>scrollYValue});
 window.scrollTo=arg=>{lastTop=Number(arg?.top||0);scrollYValue=lastTop};
 window.scrollBy=arg=>{scrollYValue+=Number(arg?.top||0)};
 document.querySelector('#series-next').getBoundingClientRect=()=>({top:240,left:0,right:100,bottom:300,width:100,height:60});
 document.querySelector('#movies-next').getBoundingClientRect=()=>({top:310,left:0,right:100,bottom:370,width:100,height:60});
 X.normalizeHomeHistory();ok(!document.querySelector('[data-ct324-history-toggle]'),'Home history button survived');
 ok(document.querySelector('[data-ct274-history="episodes"] .ct274-history-stack').children[1].textContent==='MAIS RECENTE','Home history order changed');
 X.homeAnchor('series');ok(lastTop===932,'Series exact anchor wrong '+lastTop);
 document.querySelector('[data-home-view="series"]').classList.add('hidden');document.querySelector('[data-home-view="movies"]').classList.remove('hidden');
 X.homeAnchor('movies');ok(lastTop===1234,'Movies exact anchor wrong '+lastTop);
 ok(X.homeAnchorTarget('movies')?.id==='movies-next','Movies anchor target wrong');

 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><button data-ct319-filter>filter</button><div data-ct319-types hidden></div><div data-ct319-content></div></div></div>';
 if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou';
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[media(20,'movie','#Alive')],series:[media(21,'tv','11.22.63')],anime:[media(22,'tv','Akudama',{genre_ids:[16],original_language:'ja'})]},
  freshPools:{movie:[media(30,'movie','Movie Fresh')],series:[media(31,'tv','Series Fresh')],anime:[media(32,'tv','Anime Fresh',{genre_ids:[16],original_language:'ja'})]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[media(33,'movie','Daily')],dailyIndex:0,
  initial:{watch:{},fresh:{},daily:null},complete:true
 });
 X.ensureFilters();X.paintForYou();
 const types=document.querySelector('[data-ct319-types]');
 ok(types&&!types.hidden,'ForYou filters are hidden');
 ok(document.querySelectorAll('[data-ct328-fy-kind]').length===4,'ForYou filters missing');
 ok(document.querySelector('[data-ct319-filter]').hidden===true,'legacy filter icon still active on ForYou');
 const rows3=[...document.querySelectorAll('[data-ct328-foryou] .ct328-actions')];
 ok(rows3.length===7,'expected seven ForYou action rows, got '+rows3.length);
 for(const row of rows3){const buttons=[...row.querySelectorAll('.chip')];ok(buttons.length===3,'ForYou action count wrong');const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));ok(new Set(tops).size===1,'ForYou actions wrapped');}
 const cards=[...document.querySelectorAll('[data-ct328-foryou] .ct328-slot .ct288-card')];
 ok(cards.length===6,'ForYou six slot cards missing');
 const widths=cards.map(c=>Math.round(c.getBoundingClientRect().width));ok(Math.max(...widths)-Math.min(...widths)<=1,'ForYou card widths differ '+widths.join(','));
 document.querySelector('[data-ct328-fy-kind="movie"]').click();
 ok(!document.querySelector('[data-ct328-kind="movie"]').hidden,'movie filter hid movie');
 ok([...document.querySelectorAll('[data-ct328-kind="series"]')].every(x=>x.hidden),'movie filter failed to hide series');
 ok([...document.querySelectorAll('[data-ct328-kind="anime"]')].every(x=>x.hidden),'movie filter failed to hide anime');

 T.setTestBridge({
  source:async()=>[media(1,'movie','Seen'),media(2,'movie','Watchlist'),media(3,'movie','Free')],
  exact:async items=>({blocked_keys:items.filter(x=>x.tmdb_id===1||x.tmdb_id===2).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:['movie:2'],seen_keys:['movie:1'],not_interested_keys:[]})
 });
 T.setDiscover('trending','all');
 document.querySelector('[data-ct319-content]').innerHTML='';
 await window.__ctR321.loadPublic('trending',true);
 ok(!document.querySelector('[data-ct319-item="movie:1"]'),'seen item leaked into public Discover');
 ok(!document.querySelector('[data-ct319-item="movie:2"]'),'Watchlist item leaked into public Discover');
 ok(document.querySelector('[data-ct319-item="movie:3"]'),'eligible public item missing');

 const hp=new Set([671,672,673,674,675,767,12444,12445]);
 let pages=[];
 T.setTestBridge({
  topPage:async(provider,page)=>{pages.push(page);const base=(page-1)*20;return{
   movies:Array.from({length:20},(_,i)=>{const h=[671,672,673,674,675,767,12444,12445][base+i];return media(h||2000+base+i,'movie',h?'Harry Potter '+h:'Movie '+(base+i))}),
   series:Array.from({length:20},(_,i)=>media(5000+base+i,'tv','Series '+(base+i)))
  }},
  exact:async items=>({blocked_keys:items.filter(x=>hp.has(x.tmdb_id)).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:[],seen_keys:items.filter(x=>hp.has(x.tmdb_id)).map(x=>x.media_type+':'+x.tmdb_id),not_interested_keys:[]})
 });
 T.setDiscover('top10','all');pages=[];const top=await T.topRaw321(8,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not fill ten');
 ok(top.movies.every(x=>!hp.has(Number(x.tmdb_id))),'watched Harry Potter survived Top10');
 ok(pages.includes(1)&&pages.includes(2),'Top10 first pages not fetched');

 T.setTestBridge({
  topPage:async(provider,page)=>{pages.push(page);await new Promise(r=>setTimeout(r,15));return{movies:Array.from({length:20},(_,i)=>media(8000+page*100+i,'movie','M')),series:Array.from({length:20},(_,i)=>media(9000+page*100+i,'tv','S'))}},
  exact:async items=>({blocked_keys:items.map(x=>x.media_type+':'+x.tmdb_id),watch_keys:[],seen_keys:[],not_interested_keys:[]})
 });
 T.setDiscover('top10','all');pages=[];const stale=T.topRaw321(9,true);setTimeout(()=>T.setDiscover('trending','all'),3);await stale;
 ok(!pages.includes(3)&&!pages.includes(4)&&!pages.includes(5),'stale Top10 continued refilling after tab switch: '+pages.join(','));

 document.documentElement.dataset.ct328done='1';
}catch(e){document.documentElement.dataset.ct328probe='fail:'+String(e?.stack||e)}},250)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct328done="1"/.test(out)){const m=out.match(/data-ct328probe="([^"]*)"/);throw new Error('R328_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R328_BROWSER_OK exact Home anchor + owned ForYou + strict public/Top10 + stale-nav stop');
