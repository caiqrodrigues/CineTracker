import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r349.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v349.js')],{stdio:'inherit'});

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
 ok(window.__ctR349&&window.__ctR348&&window.__ctR336&&window.__ctR336Test,'r349 lineage missing '+window.__ctDiagErrors.join(' || '));
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
 ok(window.__ctR336.paintForYou(),'r336 paint failed');
 window.__ctR348.fixAll();window.__ctR349.compact();window.__ctR349.bind();await sleep(80);

 /* Compact rails: slots equal poster width and sit close together. */
 const rail=document.querySelector('[data-ct336-section="watch"] .ct336-rail'),watchSlots=[...rail.querySelectorAll(':scope > .ct336-slot')];
 ok(watchSlots.length===3,'watch slots missing');
 const rects=watchSlots.map(slot=>({slot:slot.getBoundingClientRect(),poster:slot.querySelector('.ct288-poster,.ct288-empty-poster').getBoundingClientRect()}));
 rects.forEach((x,i)=>ok(Math.abs(x.slot.width-x.poster.width)<=1,'slot '+i+' wider than poster '+x.slot.width+'/'+x.poster.width));
 for(let i=0;i<rects.length-1;i++){
  const gap=rects[i+1].slot.left-rects[i].slot.right;
  ok(gap>=4&&gap<=8,'cover gap not compact '+gap);
 }

 /* Heart/watchlist control belongs inside poster bounds. */
 const heartSlot=watchSlots[0],card=heartSlot.querySelector('.ct288-card'),poster=heartSlot.querySelector('.ct288-poster,.ct288-empty-poster');
 let heart=heartSlot.querySelector('.ct288-state');
 if(!heart){heart=document.createElement('button');heart.className='ct288-state';heart.textContent='♡';card.appendChild(heart)}
 window.__ctR349.compact();await sleep(20);
 const hr=heart.getBoundingClientRect(),pr=poster.getBoundingClientRect();
 ok(hr.left>=pr.left-1&&hr.right<=pr.right+1&&hr.top>=pr.top-1&&hr.bottom<=pr.bottom+1,'heart is outside poster');

 /* Own persistence entry point in the test but use the real optimistic rotator.
    Static gate separately proves real persistForYou calls addWatchlist/markSeen. */
 const persisted=[];
 window.__ctR336.persistForYou=(btn)=>{
  const action=String(btn.dataset.ct336Action||''),media=String(btn.dataset.ct336Media||'');
  persisted.push(action+':'+media);
  const rotated=window.__ctR336Test.optimisticRotate336(action,media);
  return Promise.resolve(rotated);
 };

 const cardKey=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';

 /* Watchlist: card changes immediately, persistence path is invoked once. */
 let before=cardKey('fresh:movie');
 const wl=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 ok(wl,'Watchlist button missing');wl.click();
 let after=cardKey('fresh:movie');
 ok(after&&after!==before,'Watchlist did not replace recommendation immediately '+before+' => '+after);
 ok(persisted.filter(x=>x.startsWith('watchlist:')).length===1,'Watchlist persistence not called exactly once');
 await sleep(20);
 ok(document.querySelector('[data-ct336-slot="fresh:movie"]')?.classList.contains('ct349-enter'),'Watchlist replacement has no subtle enter');

 /* Seen: removes current Watchlist card immediately and calls seen persistence. */
 before=cardKey('watch:movie');
 const seen=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-action="seen"]');
 ok(seen,'Seen button missing');seen.click();
 after=cardKey('watch:movie');
 ok(after&&after!==before,'Seen did not replace recommendation immediately '+before+' => '+after);
 ok(persisted.filter(x=>x.startsWith('seen:')).length===1,'Seen persistence not called exactly once');

 /* Trocar: same slot changes immediately without persistence. */
 before=cardKey('fresh:series');
 const swap=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-swap-only]');
 ok(swap&&!swap.disabled,'Trocar button unavailable');swap.click();
 after=cardKey('fresh:series');
 ok(after&&after!==before,'Trocar did not replace recommendation immediately '+before+' => '+after);
 ok(persisted.length===2,'Trocar incorrectly used persistence');
 await sleep(20);
 ok(document.querySelector('[data-ct336-slot="fresh:series"]')?.classList.contains('ct349-enter'),'Trocar replacement has no subtle enter');

 /* Final action contract remains intact after all interactions. */
 window.__ctR348.fixAll();window.__ctR349.compact();await sleep(60);
 for(const slot of document.querySelectorAll('[data-ct336-foryou] .ct336-slot')){
  const name=String(slot.dataset.ct336Slot||''),row=slot.querySelector(':scope > .ct336-actions'),buttons=[...row.querySelectorAll(':scope > button')];
  const expected=name.startsWith('watch:')?2:3;
  ok(buttons.length===expected,name+' wrong button count '+buttons.length);
  const rr=row.getBoundingClientRect(),pp=slot.querySelector('.ct288-poster,.ct288-empty-poster').getBoundingClientRect();
  ok(Math.abs(rr.width-pp.width)<=1,name+' actions no longer match poster width');
 }

 document.documentElement.dataset.ct349done='1';
}catch(e){document.documentElement.dataset.ct349probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg+xml':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);
 if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct349done="1"/.test(out)){const m=out.match(/data-ct349probe="([^"]*)"/);throw new Error('R349_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R349_BROWSER_OK compact covers, heart inside poster, Watchlist/Seen/Trocar immediate and subtle');
