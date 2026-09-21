import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r330.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR330,XT=window.__ctR330Test,R=window.__ctR319Test,T=window.__ctR321Test,N=window.__ctR329;
 ok(X&&XT&&R&&T&&N,'r330 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.121','version stale');

 /* Home: loaded rows stay in an internal viewport, no button, newest initially at bottom. */
 history.replaceState({},'','/home');
 const home=document.createElement('div');home.id='ct330-home-probe';
 home.innerHTML='<div data-home><div data-home-view="series"><section data-ct274-history="episodes" class="home-section is-collapsed"><div class="panel-head"><h3>Histórico recente</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell"><div class="ct274-history-stack">'+Array.from({length:36},(_,i)=>'<div style="height:32px">E'+i+'</div>').join('')+'</div></div></section></div></div>';
 document.body.appendChild(home);X.normalizeHomeHistory();await new Promise(r=>requestAnimationFrame(r));
 const sec=home.querySelector('[data-ct274-history]'),stack=home.querySelector('.ct274-history-stack');
 ok(!home.querySelector('[data-ct324-history-toggle]'),'Home history toggle survived');
 ok(getComputedStyle(stack).overflowY==='auto','Home history is not internally scrollable');
 ok(getComputedStyle(stack).maxHeight!=='none','Home history lost bounded viewport');
 ok(stack.scrollHeight>stack.clientHeight,'Home history probe did not overflow');
 ok(stack.scrollTop>0,'Home history did not start at newest/bottom');
 ok(sec.dataset.ct324History===undefined,'legacy collapsed state survived');

 /* Pra voce: stale r310 ownership + missing rows must be repaired. */
 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app">'+R.shell319()+'</div>';
 const h=document.querySelector('[data-ct319-content]');h.dataset.ct310Owned='browse';
 h.innerHTML='<div data-ct309-foryou>'+
  '<section class="panel ct309-daily"><div class="ct309-daily-card"><div class="ct288-card" data-ct288-card="movie:900"><b>Daily</b></div></div></section>'+
  '<section class="panel"><div class="ct309-fy-grid">'+
   '<section class="ct309-slot" data-ct309-slot="watch:movie"><div class="ct288-card" data-ct288-card="movie:901"><b>Watch</b></div></section>'+
   '<section class="ct309-slot" data-ct309-slot="fresh:series"><div class="ct288-card" data-ct288-card="tv:902"><b>Series</b></div></section>'+
   '<section class="ct309-slot" data-ct309-slot="fresh:anime"><div class="ct288-card" data-ct288-card="tv:903"><b>Anime</b></div></section>'+
  '</div></section></div>';
 try{discover.tab='foryou'}catch{}
 R.state.fyKind='all';X.settleDiscover();
 ok(!h.hasAttribute('data-ct310-owned'),'stale r310 owner not removed');
 const containers=[...h.querySelectorAll('.ct309-daily-card,.ct309-slot')];
 ok(containers.length===4,'ForYou probe incomplete');
 for(const c of containers){
  const row=c.querySelector(':scope > .ct309-actions'),buttons=[...(row?.querySelectorAll('.chip')||[])];
  ok(row&&buttons.length===3,'ForYou buttons were not rebuilt');
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));ok(new Set(tops).size===1,'ForYou buttons wrap');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'ForYou button text wraps');
 }
 ok(h.querySelector('[data-ct309-slot="watch:movie"] [data-ct309-action="watchlist"]')?.disabled===true,'Watchlist recommendation lost saved state');
 const types=document.querySelector('[data-ct319-types]');
 ok(types&&!types.hidden,'Pra voce filters are not visible');
 ok(types.textContent.includes('Todos')&&types.textContent.includes('Filmes')&&types.textContent.includes('Séries')&&types.textContent.includes('Animes'),'Pra voce filters incomplete');
 R.state.fyKind='movie';N.applyForYouFilter();
 ok(h.querySelector('[data-ct309-slot="watch:movie"]').hidden===false,'movie filter hid movie');
 ok(h.querySelector('[data-ct309-slot="fresh:series"]').hidden===true,'movie filter did not hide series');

 /* Top10: first wave is concurrent and fills ten after exclusions, with <=2 exact calls. */
 let exactCalls=0,pageCalls=0;
 const media=(id,type)=>({id,tmdb_id:id,media_type:type,title:(type==='movie'?'M':'S')+id,original_title:(type==='movie'?'M':'S')+id,original_name:(type==='movie'?'M':'S')+id,poster_path:'/p'+id+'.jpg',release_date:'2024-01-01',first_air_date:'2024-01-01'});
 T.setTestBridge({
  topPage:async(provider,page)=>{pageCalls++;return{movies:Array.from({length:10},(_,i)=>media((page-1)*10+i+1,'movie')),series:Array.from({length:10},(_,i)=>media(100+(page-1)*10+i+1,'tv'))}},
  exact:async items=>{exactCalls++;return{blocked_keys:items.filter(x=>(x.tmdb_id>=1&&x.tmdb_id<=7)||(x.tmdb_id>=101&&x.tmdb_id<=107)).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:[],seen_keys:[],not_interested_keys:[]}}
 });
 const top=await T.topRaw321(9,true);
 ok(top.movies.length===10&&top.series.length===10,'Top10 did not fill 10+10');
 ok(top.movies[0].tmdb_id===8&&top.series[0].tmdb_id===108,'Top10 ranking/filter mismatch');
 ok(exactCalls<=2,'Top10 used too many personal-filter RPC waves: '+exactCalls);
 ok(pageCalls<=5,'Top10 requested too many pages: '+pageCalls);

 /* Cached tab return must not launch background source prefetch. */
 let sourceCalls=0;
 N.clearCache();h.innerHTML='<div data-ct309-foryou><div class="ct309-daily-card"><div class="ct288-card" data-ct288-card="movie:999"></div></div></div>';
 try{discover.tab='foryou'}catch{};X.settleDiscover();N.cacheCurrent();
 N.setTestBridge({source:async()=>{sourceCalls++;return[]},loadDiscover:async()=>true});
 await N.loadTab('foryou');await new Promise(r=>setTimeout(r,450));
 ok(sourceCalls===0,'cached navigation started background prefetch: '+sourceCalls);

 document.documentElement.dataset.ct330done='1';
}catch(e){document.documentElement.dataset.ct330probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct330done="1"/.test(out)){const m=out.match(/data-ct330probe="([^"]*)"/);throw new Error('R330_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R330_BROWSER_OK Home scroll + ForYou action ownership + demand-only navigation + Top10 waves');
