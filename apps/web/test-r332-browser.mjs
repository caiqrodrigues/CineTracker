import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r332.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v332.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR332,T=window.__ctR321Test;
 ok(X&&T,'r332 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.123','web version stale');
 ok(window.__ctR325?.version==='1.0.116','r325 episode-sync base missing');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home><div data-home-view="movies"><section class="home-section" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack" style="height:80px;overflow:auto"><div style="height:300px">MAIS ANTIGO ... MAIS RECENTE</div></div></div></section><section class="home-section" id="watchlist"><h3>Assistir a seguir / Watchlist</h3></section></div></div></div>';
 X.normalizeHomeHistory();
 const hist=document.querySelector('[data-ct274-history]'),stack=hist.querySelector('.ct274-history-stack');
 ok(!hist.querySelector('[data-ct324-history-toggle]'),'Home history toggle survived');
 ok(getComputedStyle(stack).overflowY==='visible','Home history still has nested scroll');
 ok(X.homeAnchorTarget()?.id==='watchlist','Home initial anchor is not after hidden history');

 history.replaceState({},'','/discover');
 const media=(id,type,kind='series')=>({id,tmdb_id:id,media_type:type,media_kind:kind,title:'T'+id,name:'T'+id,original_title:'T'+id,original_name:'T'+id,poster_path:'/p'+id+'.jpg',vote_average:8.5,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:kind==='anime'?[16]:[18],original_language:kind==='anime'?'ja':'en',origin_country:kind==='anime'?['JP']:['US']});
 const watchRows=[media(11,'movie','movie'),media(12,'movie','movie'),media(21,'tv','series'),media(31,'tv','anime')];
 const freshPage=async page=>[
  Array.from({length:8},(_,i)=>media(100+page*20+i,'movie','movie')),
  Array.from({length:5},(_,i)=>media(200+page*20+i,'tv','series')),
  Array.from({length:5},(_,i)=>media(300+page*20+i,'tv','anime'))
 ];
 T.setTestBridge({
  watchRows:async()=>({rows:watchRows}),
  freshPage,
  exact:async items=>({
   blocked_keys:items.filter(x=>x.tmdb_id===12||x.tmdb_id===121||x.tmdb_id===221||x.tmdb_id===321).map(x=>x.media_type+':'+x.tmdb_id),
   watch_keys:['movie:11','movie:12','tv:21','tv:31'],
   seen_keys:['movie:12'],
   not_interested_keys:[]
  })
 });
 T.setDiscover('foryou','all');
 document.body.innerHTML='<div id="app"><div data-ct319-discover><button data-ct319-filter></button><div data-ct319-types hidden></div><div data-ct319-content data-ct315-content data-ct263-discover-content></div><div data-ct319-loadline hidden></div></div></div>';
 const good=await window.__ctR321.loadForYou(true);
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 ok(good===true,'Pra voce did not complete');
 X.settleForYou();
 const filters=[...document.querySelectorAll('[data-ct332-fy-kind]')];
 ok(filters.length===4,'Pra voce visible filters missing');
 const actions=[...document.querySelectorAll('[data-ct309-foryou] .ct309-actions')];
 ok(actions.length>=4,'Pra voce action rows missing');
 for(const row of actions){
  const buttons=[...row.querySelectorAll(':scope > .chip')];
  if(buttons.length<3)continue;
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));
  ok(new Set(tops).size===1,'Pra voce buttons broke line');
  ok(row.getBoundingClientRect().width<=160,'Pra voce buttons exceed card width');
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'Pra voce button wraps');
 }
 filters.find(b=>b.dataset.ct332FyKind==='movie').click();
 ok(document.querySelector('[data-ct309-foryou]').dataset.ct332FyFilter==='movie','Pra voce movie filter not applied');
 ok([...document.querySelectorAll('[data-ct309-slot$=":series"],[data-ct309-slot$=":anime"]')].every(x=>x.hidden||getComputedStyle(x).display==='none'),'Pra voce non-movie slots visible');

 const providers=X.filterProviders([{provider_name:'HBO Max'},{provider_name:'Looke'},{provider_name:'Mubi'},{provider_name:'Netflix'}]);
 ok(providers.length===2&&providers.every(x=>!['Looke','Mubi'].includes(x.provider_name)),'Looke/Mubi survived');

 const top=document.createElement('div');top.className='ct319-top-row';top.innerHTML=Array.from({length:10},(_,i)=>'<div class="ct319-item"><article class="ct288-card"><button class="ct288-open"><div class="ct288-poster"></div></button><div class="ct319-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button></div></article></div>').join('');document.body.appendChild(top);
 const cols=getComputedStyle(top).gridTemplateColumns.trim().split(/\\s+/).filter(Boolean);
 ok(cols.length===10,'Top10 desktop grid is not ten columns: '+cols.length);
 ok(top.scrollWidth<=top.clientWidth+2,'Top10 still requires horizontal scrolling');

 document.documentElement.dataset.ct332done='1';
}catch(e){document.documentElement.dataset.ct332probe='fail:'+String(e?.stack||e)}},5400)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1600,1000','--virtual-time-budget=19000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct332done="1"/.test(out)){const m=out.match(/data-ct332probe="([^"]*)"/);throw new Error('R332_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R332_BROWSER_OK Home sync/history + Pra voce layout/filter + Top10 grid/providers');
