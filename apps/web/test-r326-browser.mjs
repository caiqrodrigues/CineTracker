import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r326.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v326.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR326,XT=window.__ctR326Test,T=window.__ctR321Test;
 ok(X&&XT&&T,'r326 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.117','web version stale');
 ok(window.__ctR325?.version==='1.0.116','r325 episode-sync base unavailable');

 history.replaceState({},'','/home');
 document.body.innerHTML='<div id="app"><div data-home><section class="home-section ct275-history is-collapsed" data-ct274-history="episodes" data-ct324-history="collapsed"><div class="panel-head"><h3>Histórico recente</h3><button data-ct275-history-toggle>Ver Histórico</button><button data-ct324-history-toggle>Ver histórico</button></div><div class="ct275-history-shell" aria-hidden="true"><div class="ct274-history-stack" style="height:70px;overflow:auto"><div style="height:500px">OLD TO NEW</div></div></div></section></div></div>';
 X.restoreHomeHistory();
 const sec=document.querySelector('[data-ct274-history]'),shell=sec.querySelector('.ct275-history-shell'),stack=sec.querySelector('.ct274-history-stack');
 ok(getComputedStyle(sec.querySelector('[data-ct275-history-toggle]')).display==='none','r275 history button visible');
 ok(getComputedStyle(sec.querySelector('[data-ct324-history-toggle]')).display==='none','r324 history button visible');
 ok(getComputedStyle(shell).display!=='none'&&getComputedStyle(stack).display!=='none','Home history content hidden');
 ok(shell.getAttribute('aria-hidden')==='false','Home history shell remains aria-hidden');
 ok(stack.scrollTop>0,'Home history did not start at newest/bottom');

 history.replaceState({},'','/discover');
 const media=(id,type,kind='series')=>({id,tmdb_id:id,media_type:type,media_kind:kind,title:'T'+id,name:'T'+id,poster_path:'/p'+id+'.jpg',vote_average:8.4,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:kind==='anime'?[16]:[18],original_language:kind==='anime'?'ja':'en',origin_country:kind==='anime'?['JP']:['US']});
 const baseState={
  watchPools:{movie:[media(11,'movie','movie'),media(12,'movie','movie')],series:[media(21,'tv','series')],anime:[media(31,'tv','anime')]},
  freshPools:{
   movie:[media(101,'movie','movie'),media(102,'movie','movie'),media(103,'movie','movie'),media(104,'movie','movie'),media(105,'movie','movie'),media(106,'movie','movie')],
   series:[media(201,'tv','series'),media(202,'tv','series'),media(203,'tv','series')],
   anime:[media(301,'tv','anime'),media(302,'tv','anime'),media(303,'tv','anime')]
  },
  dailyPool:[media(104,'movie','movie'),media(105,'movie','movie'),media(106,'movie','movie')],
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0,
  initial:{watch:{},fresh:{},daily:null},complete:true
 };
 window.__ctR309Test.setForYouState(baseState);
 T.setTestBridge({exact:async items=>({
  blocked_keys:['movie:12','movie:101','tv:201','tv:301'],
  watch_keys:['movie:11','movie:12','tv:21','tv:31'],
  seen_keys:['movie:12','movie:101','tv:201','tv:301'],
  not_interested_keys:[]
 })});
 T.setDiscover('foryou','all');
 document.body.innerHTML='<div id="app"><div data-ct319-content data-ct315-content></div><div data-ct319-loadline hidden></div></div>';
 const good=await window.__ctR321.loadForYou(false);
 const st=window.__ctR309Test.state;
 const keys=x=>Object.values(x||{}).flat().map(v=>v?.media_type+':'+v?.tmdb_id);
 const watchKeys=['movie','series','anime'].flatMap(k=>(st.watchPools[k]||[]).map(x=>x.media_type+':'+x.tmdb_id));
 const freshKeys=['movie','series','anime'].flatMap(k=>(st.freshPools[k]||[]).map(x=>x.media_type+':'+x.tmdb_id));
 ok(good===true,'Pra voce did not produce a complete draft');
 ok(watchKeys.includes('movie:11')&&!watchKeys.includes('movie:12'),'seen Watchlist item survived Pra voce');
 ok(!freshKeys.includes('movie:101')&&!freshKeys.includes('tv:201')&&!freshKeys.includes('tv:301'),'blocked fresh item survived Pra voce');
 ok(st.initial.daily&&st.initial.daily.tmdb_id!==101,'blocked daily recommendation survived');

 X.compactDiscoverActions(document);
 const fy=[...document.querySelectorAll('[data-ct309-foryou] .ct309-actions .chip')];
 ok(fy.length>=3,'Pra voce action buttons missing');
 const tops=fy.slice(0,3).map(b=>Math.round(b.getBoundingClientRect().top));
 ok(new Set(tops).size===1,'Pra voce buttons are not on one row');
 ok(fy.slice(0,3).every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'Pra voce button text wraps');

 document.documentElement.dataset.ct326done='1';
}catch(e){document.documentElement.dataset.ct326probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=17000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct326done="1"/.test(out)){const m=out.match(/data-ct326probe="([^"]*)"/);throw new Error('R326_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R326_BROWSER_OK scroll-up Home + strict Pra voce + one-row actions');
