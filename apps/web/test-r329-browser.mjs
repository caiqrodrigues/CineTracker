import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r329.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR329,T=window.__ctR321Test;
 ok(X&&T,'r329 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.120','web version stale');
 history.replaceState({},'','/discover');

 document.body.innerHTML='<div id="app"><div data-ct319-discover style="width:300px;max-width:300px;box-sizing:border-box"><button data-ct319-filter>Filtro</button><div data-ct319-types hidden></div><div data-ct319-content></div></div></div>';
 if(window.__ctR288R263?.discover263)window.__ctR288R263.discover263.tab='foryou';
 if(window.__ctR319Test?.state)window.__ctR319Test.state.fyKind='all';
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[media(20,'movie','#Alive'),media(120,'movie','Movie W2')],series:[media(21,'tv','11.22.63'),media(121,'tv','Series W2')],anime:[media(22,'tv','Akudama',{genre_ids:[16],original_language:'ja'}),media(122,'tv','Anime W2',{genre_ids:[16],original_language:'ja'})]},
  freshPools:{movie:[media(30,'movie','Movie Fresh'),media(130,'movie','Movie F2')],series:[media(31,'tv','Series Fresh'),media(131,'tv','Series F2')],anime:[media(32,'tv','Anime Fresh',{genre_ids:[16],original_language:'ja'}),media(132,'tv','Anime F2',{genre_ids:[16],original_language:'ja'})]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[media(33,'movie','Daily'),media(133,'movie','Daily 2')],dailyIndex:0,
  initial:{watch:{},fresh:{},daily:null},complete:true
 });
 ok(X.paintForYou(),'ForYou paint failed');
 const root=document.querySelector('[data-ct329-foryou]');ok(root,'r329 ForYou root missing');
 ok(root.hasAttribute('data-ct328-foryou'),'r328 compatibility marker missing');
 ok(!root.querySelector('.ct328-actions')&&!root.querySelector('.ct309-actions'),'legacy action rows survived');

 const rails=[...root.querySelectorAll('.ct329-rail')];ok(rails.length===2,'expected two ForYou rails');
 const slots=[...root.querySelectorAll('.ct329-slot:not(.ct329-daily-slot)')];ok(slots.length===6,'expected six regular slots');
 const widths=slots.map(x=>Math.round(x.getBoundingClientRect().width));
 ok(widths.every(w=>Math.abs(w-154)<=1),'mobile slot width is not 154px: '+widths.join(','));
 const cards=[...root.querySelectorAll('.ct329-cardwrap>.ct288-card')];ok(cards.length>=6,'media cards missing');
 const cardWidths=cards.map(x=>Math.round(x.getBoundingClientRect().width));
 ok(cardWidths.every(w=>Math.abs(w-154)<=1),'card width is not 154px: '+cardWidths.join(','));
 ok(rails.every(r=>r.scrollWidth>r.clientWidth),'ForYou categories should scroll inside their own rails');
 ok(document.documentElement.scrollWidth<=window.innerWidth+1,'Discover caused document horizontal overflow '+document.documentElement.scrollWidth+'>'+window.innerWidth);

 const actionRows=[...root.querySelectorAll('.ct329-actions')];ok(actionRows.length===7,'expected seven action rows');
 for(const row of actionRows){
  const buttons=[...row.querySelectorAll('.ct329-action')];ok(buttons.length===3,'three-button row incomplete');
  const tops=buttons.map(b=>Math.round(b.getBoundingClientRect().top));ok(new Set(tops).size===1,'buttons wrapped vertically');
  const pos=buttons.map(b=>getComputedStyle(b).position);ok(pos.every(p=>p==='static'),'button inherited non-static position '+pos.join(','));
  ok(buttons.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'button text may wrap');
  ok(Math.round(row.getBoundingClientRect().height)===26,'action row height changed');
  ok(buttons.every(b=>!b.classList.contains('swap')&&!b.classList.contains('watch')&&!b.classList.contains('seen')),'generic legacy action class leaked');
 }
 const blocks=[...root.querySelectorAll('.ct329-block')].filter(x=>!x.hidden);
 for(let i=1;i<blocks.length;i++)ok(blocks[i].getBoundingClientRect().top>=blocks[i-1].getBoundingClientRect().bottom-1,'ForYou blocks overlap');

 const types=document.querySelector('[data-ct319-types]');ok(types&&!types.hidden,'ForYou filters hidden');
 ok(document.querySelectorAll('[data-ct328-fy-kind]').length===4,'ForYou filter buttons missing');
 document.querySelector('[data-ct328-fy-kind="movie"]').click();
 await new Promise(r=>setTimeout(r,20));
 ok([...root.querySelectorAll('[data-ct329-kind="series"]')].every(x=>x.hidden),'movie filter did not hide series');
 ok([...root.querySelectorAll('[data-ct329-kind="anime"]')].every(x=>x.hidden),'movie filter did not hide anime');
 ok([...root.querySelectorAll('[data-ct329-kind="movie"]')].some(x=>!x.hidden),'movie filter hid every movie');

 T.setTestBridge({
  source:async()=>[media(1,'movie','Seen'),media(2,'movie','Watchlist'),media(3,'movie','Free'),media(4,'movie','Free 2')],
  exact:async items=>({blocked_keys:items.filter(x=>x.tmdb_id===1||x.tmdb_id===2).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:['movie:2'],seen_keys:['movie:1'],not_interested_keys:[]})
 });
 T.setDiscover('trending','all');
 document.querySelector('[data-ct319-content]').innerHTML='';
 await window.__ctR321.loadPublic('trending',true);
 ok(!document.querySelector('[data-ct319-item="movie:1"]'),'seen item leaked into public Discover');
 ok(!document.querySelector('[data-ct319-item="movie:2"]'),'Watchlist item leaked into public Discover');
 const publicItems=[...document.querySelectorAll('.ct319-item')];ok(publicItems.length===2,'eligible public cards missing');
 const pwidths=publicItems.map(x=>Math.round(x.getBoundingClientRect().width));ok(pwidths.every(w=>Math.abs(w-154)<=1),'public card width is not 154px');
 for(const row of document.querySelectorAll('.ct319-actions')){const bs=[...row.querySelectorAll('.chip')],tops=bs.map(b=>Math.round(b.getBoundingClientRect().top));ok(bs.length===2&&new Set(tops).size===1,'public actions wrapped')}
 ok(document.documentElement.scrollWidth<=window.innerWidth+1,'public Discover caused document horizontal overflow');

 document.documentElement.dataset.ct329done='1';
}catch(e){document.documentElement.dataset.ct329probe='fail:'+String(e?.stack||e)}},350)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=390,844','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct329done="1"/.test(out)){const m=out.match(/data-ct329probe="([^"]*)"/);throw new Error('R329_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R329_BROWSER_OK 154px rails + one-line actions + no document overflow + strict public rules');
