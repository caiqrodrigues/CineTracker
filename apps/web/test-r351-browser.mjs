import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r351.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v351.js')],{stdio:'inherit'});

const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};
window.__ctDiagErrors=[];
window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));
window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)));
</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR351&&window.__ctR350&&window.__ctR349&&window.__ctR348&&window.__ctR336Test,'r351 lineage missing '+window.__ctDiagErrors.join(' || '));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';

 const item=(id,type,title,genres=[],lang='en')=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:'/x.jpg',vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01',release_year:2026,genre_ids:genres,original_language:lang});
 const wm1=item(101,'movie','Watch Movie 1',[28]),wm2=item(102,'movie','Watch Movie 2',[35]);
 const ws1=item(201,'tv','Watch Series 1',[18]),ws2=item(202,'tv','Watch Series 2',[53]);
 const wa1=item(301,'tv','Watch Anime 1',[16],'ja'),wa2=item(302,'tv','Watch Anime 2',[16],'ja');
 const fm1=item(401,'movie','Fresh Movie 1',[12]),fm2=item(402,'movie','Fresh Movie 2',[35]);
 const fs1=item(501,'tv','Fresh Series 1',[18]),fs2=item(502,'tv','Fresh Series 2',[80]);
 const fa1=item(601,'tv','Fresh Anime 1',[16],'ja'),fa2=item(602,'tv','Fresh Anime 2',[16],'ja');
 const d1=item(701,'movie','Daily 1',[878]),d2=item(702,'movie','Daily 2',[35]);
 const watchRows=[wm1,wm2,ws1,ws2,wa1,wa2];

 /* Reproduce current user state: Pra Você loads with Watchlist section missing. */
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[],series:[],anime:[]},
  freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[d1,d2],dailyIndex:0,complete:false,
  initial:{watch:{},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 ok(window.__ctR336Test.paintForYou336(),'initial paint failed');
 ok(!document.querySelector('[data-ct336-section="watch"]'),'fixture unexpectedly has Watchlist section');

 const backendCalls=[],seenKeys=new Set(),addedKeys=new Set();
 const keyOf=x=>(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id;
 window.__ctR351.setTestBridge({
  watchRows:async()=>[...watchRows,...(addedKeys.has('movie:401')?[fm1]:[])],
  filter:async list=>list.filter(x=>!seenKeys.has(keyOf(x)))
 });
 window.__ctR350.setTestBridge({
  watchlist:(type,id)=>new Promise(r=>setTimeout(()=>{backendCalls.push('watchlist:'+type+':'+id);addedKeys.add(type+':'+id);r(true)},220)),
  seen:(type,id)=>new Promise(r=>setTimeout(()=>{backendCalls.push('seen:'+type+':'+id);seenKeys.add(type+':'+id);r(true)},220))
 });

 ok(await window.__ctR351.restoreWatchlist(true),'Watchlist restore failed');
 await sleep(60);
 const watchSection=document.querySelector('[data-ct336-section="watch"]');
 ok(watchSection,'Da sua Watchlist section not restored');
 ok(/Da sua Watchlist/.test(watchSection.textContent),'Watchlist heading missing');
 ok(watchSection.querySelectorAll(':scope .ct336-slot').length===3,'Watchlist trio not restored');

 const cardKey=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';

 /* Break the legacy dynamic handler deliberately. Patched earliest capture must still execute r351 first. */
 window.__ctR336EarlyHandle=()=>{throw new Error('legacy handler must never run for Pra Você actions')};

 /* Trocar: synchronous, no backend. */
 let before=cardKey('fresh:series');
 let btn=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-swap-only]');
 ok(btn&&!btn.disabled,'Trocar missing/disabled');btn.click();
 let after=cardKey('fresh:series');
 ok(after&&after!==before,'Trocar did not change card in same click '+before+' => '+after);
 ok(backendCalls.length===0,'Trocar called backend');

 /* +Watchlist: immediate recommendation replacement, one backend call later. */
 before=cardKey('fresh:movie');
 btn=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 ok(btn,'+ Watchlist missing');btn.click();
 after=cardKey('fresh:movie');
 ok(after&&after!==before,'Watchlist did not change card immediately '+before+' => '+after);
 ok(backendCalls.length===0,'Watchlist waited incorrectly / backend completed synchronously');
 await sleep(280);
 ok(backendCalls.filter(x=>x==='watchlist:movie:401').length===1,'Watchlist backend call count '+backendCalls.join(','));

 /* Visto: immediate Watchlist recommendation replacement, then one backend call. */
 before=cardKey('watch:movie');
 btn=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-action="seen"]');
 ok(btn,'Visto missing');btn.click();
 after=cardKey('watch:movie');
 ok(after&&after!==before,'Visto did not change card immediately '+before+' => '+after);
 await sleep(280);
 ok(backendCalls.filter(x=>x==='seen:movie:101').length===1,'Visto backend call count '+backendCalls.join(','));

 /* Authoritative restore after persistence must keep section and exclude the seen item. */
 await sleep(100);
 ok(document.querySelector('[data-ct336-section="watch"]'),'Watchlist section disappeared after actions');
 ok(cardKey('watch:movie')!=='movie:101','seen item returned to Watchlist recommendations');
 ok(backendCalls.length===2,'duplicate action persistence '+backendCalls.join(','));

 /* Buttons remain present and clickable after all repaints. */
 for(const slot of document.querySelectorAll('[data-ct336-foryou] .ct336-slot')){
  const row=slot.querySelector(':scope > .ct336-actions');if(!row)continue;
  for(const b of row.querySelectorAll(':scope > button')){
   ok(getComputedStyle(b).pointerEvents==='auto','button lost pointer events');
  }
 }
 document.documentElement.dataset.ct351done='1';
}catch(e){document.documentElement.dataset.ct351probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1600)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg': 'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=14000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct351done="1"/.test(out)){const m=out.match(/data-ct351probe="([^"]*)"/);throw new Error('R351_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R351_BROWSER_OK Watchlist section restored; Trocar/Visto/Watchlist work from patched earliest capture with single persistence');
