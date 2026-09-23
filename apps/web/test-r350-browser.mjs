import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r350.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v350.js')],{stdio:'inherit'});

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
 ok(window.__ctR350&&window.__ctR348&&window.__ctR349&&window.__ctR336Test,'r350 lineage missing '+window.__ctDiagErrors.join(' || '));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';

 const item=(id,type,title,genres=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:genres});
 const m1=item(101,'movie','Watch M1',[28]),m2=item(102,'movie','Watch M2',[35]);
 const s1=item(201,'tv','Watch S1',[18]),s2=item(202,'tv','Watch S2',[53]);
 const a1={...item(301,'tv','Watch A1',[16]),original_language:'ja'},a2={...item(302,'tv','Watch A2',[16]),original_language:'ja'};
 const fm1=item(401,'movie','Fresh M1',[12]),fm2=item(402,'movie','Fresh M2',[35]);
 const fs1=item(501,'tv','Fresh S1',[18]),fs2=item(502,'tv','Fresh S2',[80]);
 const fa1={...item(601,'tv','Fresh A1',[16]),original_language:'ja'},fa2={...item(602,'tv','Fresh A2',[16]),original_language:'ja'};
 const d1=item(701,'movie','Daily 1',[878]),d2=item(702,'movie','Daily 2',[35]);

 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m1,m2],series:[s1,s2],anime:[a1,a2]},
  freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[d1,d2],dailyIndex:0,complete:true,
  initial:{watch:{movie:m1,series:s1,anime:a1},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 ok(window.__ctR336Test.paintForYou336(),'initial paint failed');
 window.__ctR348.fixAll();window.__ctR349.compact();await sleep(50);

 const calls=[];
 window.__ctR350.setTestBridge({
  watchlist:(type,id)=>{calls.push('watchlist:'+type+':'+id);return new Promise(r=>setTimeout(()=>r(true),350))},
  seen:(type,id)=>{calls.push('seen:'+type+':'+id);return new Promise(r=>setTimeout(()=>r(true),350))}
 });
 const cardKey=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';

 /* Trocar must mutate synchronously on click. */
 let before=cardKey('fresh:series');
 const swap=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-swap-only]');
 ok(swap&&!swap.disabled,'swap missing/disabled');
 swap.click();
 let after=cardKey('fresh:series');
 ok(after&&after!==before,'Trocar did not change card in same click '+before+' => '+after);
 ok(calls.length===0,'Trocar incorrectly persisted');

 /* Watchlist must mutate synchronously while backend is still unresolved. */
 before=cardKey('fresh:movie');
 const wl=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 ok(wl,'watchlist button missing');
 wl.click();
 after=cardKey('fresh:movie');
 ok(after&&after!==before,'Watchlist waited for backend '+before+' => '+after);
 ok(calls.filter(x=>x==='watchlist:movie:401').length===1,'Watchlist backend not invoked once '+calls.join(','));

 /* Seen must mutate synchronously while backend is still unresolved. */
 before=cardKey('watch:movie');
 const seen=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-action="seen"]');
 ok(seen,'seen button missing');
 seen.click();
 after=cardKey('watch:movie');
 ok(after&&after!==before,'Seen waited for backend '+before+' => '+after);
 ok(calls.filter(x=>x==='seen:movie:101').length===1,'Seen backend not invoked once '+calls.join(','));

 /* Buttons are actually clickable, not covered by card overlay. */
 for(const b of document.querySelectorAll('[data-ct336-foryou] .ct336-actions>button')){
  const cs=getComputedStyle(b);ok(cs.pointerEvents==='auto','button pointer-events '+cs.pointerEvents);ok(Number(cs.zIndex)>=31,'button z-index '+cs.zIndex);
 }

 /* Delayed backend completion must not revert the optimistic replacement. */
 const snap={freshMovie:cardKey('fresh:movie'),watchMovie:cardKey('watch:movie'),freshSeries:cardKey('fresh:series')};
 await sleep(500);
 ok(cardKey('fresh:movie')===snap.freshMovie,'Watchlist card reverted after backend');
 ok(cardKey('watch:movie')===snap.watchMovie,'Seen card reverted after backend');
 ok(cardKey('fresh:series')===snap.freshSeries,'Trocar card reverted');

 /* Exactly one call per persistence action. */
 ok(calls.length===2,'unexpected backend call count '+calls.join(','));

 document.documentElement.dataset.ct350done='1';
}catch(e){document.documentElement.dataset.ct350probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1600)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg+xml':'image/svg+xml'};
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
if(!/data-ct350done="1"/.test(out)){const m=out.match(/data-ct350probe="([^"]*)"/);throw new Error('R350_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R350_BROWSER_OK Trocar/Watchlist/Visto mutate immediately, backend second, no overlay stealing clicks');
