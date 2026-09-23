import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r352.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v352.js')],{stdio:'inherit'});

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
 ok(window.__ctR352&&window.__ctR351&&window.__ctR348&&window.__ctR336Test,'r352 lineage missing '+window.__ctDiagErrors.join(' || '));
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
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[wm1,wm2],series:[ws1,ws2],anime:[wa1,wa2]},
  freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[d1,d2],dailyIndex:0,complete:true,
  initial:{watch:{movie:wm1,series:ws1,anime:wa1},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 ok(window.__ctR336Test.paintForYou336(),'initial paint failed');
 window.__ctR348.fixAll();await sleep(60);

 const root=document.querySelector('[data-ct336-foryou]');
 const untouched=document.querySelector('[data-ct336-slot="fresh:anime"]');
 const target=document.querySelector('[data-ct336-slot="fresh:movie"]');
 ok(root&&untouched&&target,'fixture slots missing');
 const rootRef=root,untouchedRef=untouched,targetRef=target;
 const untouchedKey=()=>untouched.querySelector('[data-ct288-card]')?.dataset?.ct288Card||'';
 const cardKey=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const untouchedBefore=untouchedKey(),pathBefore=location.pathname;
 let bubbled=0;document.querySelector('[data-ct319-content]').addEventListener('click',()=>bubbled++);

 /* Any legacy global repaint/refetch becomes a test failure if r352 accidentally reaches it. */
 window.__ctR351.restoreWatchlist=()=>{throw new Error('global restore forbidden on card action')};
 window.__ctR350.repaint=()=>{throw new Error('global repaint forbidden on card action')};
 window.__ctR350.action=()=>{throw new Error('legacy action forbidden')};
 window.__ctR350.swap=()=>{throw new Error('legacy swap forbidden')};

 const backend=[];
 window.__ctR352.setTestBridge({
  watchlist:(type,id)=>new Promise(res=>setTimeout(()=>{backend.push('watchlist:'+type+':'+id);res(true)},220)),
  seen:(type,id)=>new Promise(res=>setTimeout(()=>{backend.push('seen:'+type+':'+id);res(true)},220))
 });

 /* +Watchlist swaps only the clicked card synchronously, persistence finishes later. */
 let before=cardKey('fresh:movie');
 let btn=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 ok(btn,'Watchlist button missing');btn.click();
 let after=cardKey('fresh:movie');
 ok(after&&after!==before,'Watchlist did not swap clicked card synchronously '+before+' => '+after);
 ok(backend.length===0,'Watchlist blocked on backend');
 ok(document.querySelector('[data-ct336-foryou]')===rootRef,'Pra Você root was replaced');
 ok(document.querySelector('[data-ct336-slot="fresh:movie"]')===targetRef,'clicked slot node was replaced');
 ok(document.querySelector('[data-ct336-slot="fresh:anime"]')===untouchedRef,'untouched slot node was replaced');
 ok(untouchedKey()===untouchedBefore,'untouched card changed');
 ok(location.pathname===pathBefore,'route changed');
 ok(bubbled===0,'action click propagated to content');
 ok(target.classList.contains('transition-opacity')&&target.classList.contains('duration-300')&&target.classList.contains('ease-in-out'),'transition utility classes missing');
 await sleep(260);
 ok(backend.filter(x=>x==='watchlist:movie:401').length===1,'Watchlist persistence count '+backend.join(','));
 ok(document.querySelector('[data-ct336-foryou]')===rootRef,'backend completion repainted root');

 /* Visto also swaps only its own slot immediately. */
 const seenTarget=document.querySelector('[data-ct336-slot="watch:movie"]'),seenTargetRef=seenTarget;
 before=cardKey('watch:movie');
 btn=seenTarget.querySelector('[data-ct336-action="seen"]');ok(btn,'Visto missing');btn.click();
 after=cardKey('watch:movie');
 ok(after&&after!==before,'Visto did not swap clicked card synchronously '+before+' => '+after);
 ok(document.querySelector('[data-ct336-slot="watch:movie"]')===seenTargetRef,'Visto replaced slot node');
 ok(document.querySelector('[data-ct336-slot="fresh:anime"]')===untouchedRef&&untouchedKey()===untouchedBefore,'Visto changed unrelated card');
 await sleep(260);
 ok(backend.filter(x=>x==='seen:movie:101').length===1,'Visto persistence count '+backend.join(','));

 /* Trocar is local-only and never calls backend. */
 const swapTarget=document.querySelector('[data-ct336-slot="fresh:series"]'),swapRef=swapTarget;
 before=cardKey('fresh:series');
 btn=swapTarget.querySelector('[data-ct336-swap-only]');ok(btn&&!btn.disabled,'Trocar missing/disabled');btn.click();
 after=cardKey('fresh:series');
 ok(after&&after!==before,'Trocar did not swap same slot '+before+' => '+after);
 ok(document.querySelector('[data-ct336-slot="fresh:series"]')===swapRef,'Trocar replaced slot node');
 ok(backend.length===2,'Trocar called backend');
 ok(document.querySelector('[data-ct336-foryou]')===rootRef,'Trocar repainted root');

 /* Public tabs: Watchlist toggles only button state and does not replace/remove its card. */
 const publicWrap=document.createElement('div');
 publicWrap.innerHTML='<div class="ct319-item" data-ct319-item="movie:901"><div class="marker">PUBLIC CARD</div><div class="ct319-actions"><button type="button" class="chip" data-ct319-action="watchlist" data-media="movie:901">+ Watchlist</button><button type="button" class="chip" data-ct319-action="seen" data-media="movie:901">✓ Visto</button></div></div>';
 document.querySelector('[data-ct319-content]').appendChild(publicWrap);
 const pubCard=publicWrap.querySelector('.ct319-item'),pubRef=pubCard;
 btn=publicWrap.querySelector('[data-ct319-action="watchlist"]');btn.click();
 ok(pubCard===pubRef&&pubCard.isConnected,'public Watchlist replaced card');
 ok(btn.textContent.trim()==='✓ Salvo'&&btn.disabled,'public Watchlist did not toggle instantly');
 await sleep(260);
 ok(backend.filter(x=>x==='watchlist:movie:901').length===1,'public Watchlist persistence count');

 /* Failure rolls back only the affected slot, still without section/page repaint. */
 window.__ctR352.setTestBridge({
  watchlist:async()=>true,
  seen:()=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('offline')),120))
 });
 const failSlot=document.querySelector('[data-ct336-slot="watch:series"]'),failRef=failSlot,failBefore=cardKey('watch:series');
 btn=failSlot.querySelector('[data-ct336-action="seen"]');btn.click();
 const failOptimistic=cardKey('watch:series');
 ok(failOptimistic&&failOptimistic!==failBefore,'failure case did not optimistically swap');
 await sleep(170);
 ok(cardKey('watch:series')===failBefore,'failure did not roll back clicked slot');
 ok(document.querySelector('[data-ct336-slot="watch:series"]')===failRef,'failure rollback replaced slot node');
 ok(document.querySelector('[data-ct336-foryou]')===rootRef,'failure rollback repainted root');

 document.documentElement.dataset.ct352done='1';
}catch(e){document.documentElement.dataset.ct352probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1500)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct352done="1"/.test(out)){const m=out.match(/data-ct352probe="([^"]*)"/);throw new Error('R352_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R352_BROWSER_OK local-only swap for Watchlist/Visto/Trocar, no root repaint/refetch, public Watchlist toggles in place, local rollback on failure');
