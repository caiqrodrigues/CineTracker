import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r363.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v363.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;

const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR363&&window.__ctR362&&window.__ctR359&&window.__ctR309Test,'r363 lineage missing '+window.__ctDiagErrors.join(' || '));
 history.replaceState({},'','/discover?tab=foryou');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><div data-ct319-content></div></div>';

 const item=(id,type,title,g=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:g});
 const mk=(base,count,type,prefix,g=[])=>Array.from({length:count},(_,i)=>({...item(base+i,type,prefix+(i+1),g),...(g.includes(16)?{original_language:'ja',origin_country:['JP']}:{} )}));
 const wm=mk(100,3,'movie','WM'),ws=mk(200,3,'tv','WS'),wa=mk(300,3,'tv','WA',[16]);
 const fm=mk(400,4,'movie','FM'),fs=mk(500,3,'tv','FS'),fa=mk(600,3,'tv','FA',[16]),daily=mk(700,3,'movie','D');
 window.__ctR309Test.setForYouState({
  watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:daily,dailyIndex:0,complete:true,
  initial:{watch:{movie:wm[0],series:ws[0],anime:wa[0]},fresh:{movie:fm[0],series:fs[0],anime:fa[0]},daily:daily[0]}
 });

 const calls={watchlist:[],seen:[],swap:[],refill:[]};let slowAnime=false,seq=0;
 const refillItems=(name,count=12)=>{
  const kind=name==='daily'?'movie':String(name).split(':')[1],type=kind==='movie'?'movie':'tv',g=kind==='anime'?[16]:kind==='series'?[18]:[28];
  const base=9000+(++seq)*100;
  return mk(base,count,type,'R'+seq,g).map(x=>kind==='anime'?{...x,original_language:'ja',origin_country:['JP']}:x);
 };
 window.__ctR363.setTestBridge({
  refill:async(name,pages)=>{calls.refill.push(name+':'+pages.join(','));if(slowAnime&&name==='fresh:anime')await sleep(45);else await sleep(8);return refillItems(name,14)},
  watchlist:async(t,id)=>{calls.watchlist.push(t+':'+id);await sleep(5);return true},
  seen:async(t,id)=>{calls.seen.push(t+':'+id);await sleep(5);return true},
  swapMemory:async(t,id,s)=>{calls.swap.push(t+':'+id+':'+s);return true}
 });

 ok(window.__ctR336.paintForYou(),'paint failed');window.__ctR363.armAll();window.__ctR363.bind();
 ok(window.__ctR363.warmAll(),'warmAll did not start');await sleep(70);
 ok(window.__ctR363Test.poolFor(window.__ctR309Test.state,'fresh:movie').length>4,'fresh movie pool did not refill before exhaustion');
 ok(calls.refill.some(x=>x.startsWith('fresh:movie:')),'fresh movie refill never called');
 ok(window.__ctR358Early===window.__ctR363.early&&window.__ctR336EarlyHandle===window.__ctR363.early,'r363 does not own physical click path');

 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const key=n=>document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]')?.dataset?.ct288Card||document.querySelector('[data-ct336-slot="'+n+'"] [data-media]')?.dataset?.media||'';
 const snap=()=>Object.fromEntries(names.map(n=>[n,key(n)]));
 function click(sel){
  const b=document.querySelector(sel);ok(b,'missing '+sel);ok(!b.disabled,'disabled '+sel);
  b.scrollIntoView({block:'center',inline:'center',behavior:'auto'});const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);
  ok(hit&&(hit===b||b.contains(hit)),'not hit-testable '+sel+' hit='+(hit?.className||hit?.tagName||'none'));
  hit.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window,clientX:x,clientY:y}));
 }
 function onlyChanged(before,after,name,label){
  ok(after[name]&&after[name]!==before[name],label+' target did not change '+before[name]+' => '+after[name]);
  for(const n of names)if(n!==name)ok(after[n]===before[n],label+' changed other slot '+n+' '+before[n]+' => '+after[n]);
 }

 const slot='fresh:movie';
 const sequence=['swap','watchlist','swap','seen','watchlist','swap','seen','swap','watchlist','seen','swap','watchlist','seen','swap'];
 for(let i=0;i<sequence.length;i++){
  const action=sequence[i],before=snap();
  const sel=action==='swap'?'[data-ct336-slot="'+slot+'"] [data-ct336-swap-only]':'[data-ct336-slot="'+slot+'"] [data-ct336-action="'+action+'"]';
  click(sel);const after=snap();onlyChanged(before,after,slot,'step '+(i+1)+' '+action);
  await sleep(12);
  const row=document.querySelector('[data-ct336-slot="'+slot+'"] .ct336-actions');ok(row,'row vanished at step '+i);
  for(const b of row.querySelectorAll('button')){ok(getComputedStyle(b).pointerEvents!=='none','pointer dead at step '+i);ok(!b.hasAttribute('inert'),'inert at step '+i)}
 }
 ok(calls.watchlist.length===4,'watchlist persistence count '+calls.watchlist.length);
 ok(calls.seen.length===4,'seen persistence count '+calls.seen.length);
 ok(calls.swap.length>=6,'swap memory count '+calls.swap.length);
 ok(window.__ctR363Test.poolFor(window.__ctR309Test.state,slot).length>=2,'pool exhausted after long sequence');
 ok(/fresh:movie/.test(document.documentElement.dataset.ct363LastRefill||''),'no refill recorded for active slot');

 /* Worst case: consume the last item before refill completes. Persistence must still happen,
    the old slot remains local, then the same slot revives after targeted refill. */
 let st=window.__ctR363Test.cloneState(window.__ctR309Test.state);
 const lone={...item(8801,'tv','Lone Anime',[16]),original_language:'ja',origin_country:['JP']};
 st.freshPools.anime=[lone];st.freshIndex.anime=0;window.__ctR309Test.setForYouState(st);
 window.__ctR359.renderSlot('fresh:anime',{animate:false});window.__ctR363.armAll();slowAnime=true;
 const otherBefore=snap(),wlBefore=calls.watchlist.length;
 click('[data-ct336-slot="fresh:anime"] [data-ct336-action="watchlist"]');
 await sleep(12);
 ok(calls.watchlist.length===wlBefore+1,'last-item Watchlist did not persist while refill pending');
 ok(document.querySelector('[data-ct336-slot="fresh:anime"]')?.dataset?.ct363Refilling==='1','last-item slot not marked refilling');
 await sleep(75);
 const otherAfter=snap();ok(otherAfter['fresh:anime']&&otherAfter['fresh:anime']!=='tv:8801','last-item slot did not revive after refill');
 for(const n of names)if(n!=='fresh:anime')ok(otherAfter[n]===otherBefore[n],n+' changed during last-item refill');
 ok(!document.querySelector('[data-ct336-slot="fresh:anime"]')?.dataset?.ct363Refilling,'refill flag stuck');
 const revived=document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-action="watchlist"]');ok(revived&&!revived.disabled,'revived slot action dead');

 document.documentElement.dataset.ct363done='1';
}catch(e){document.documentElement.dataset.ct363probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700)</script>`;

const html=baseRaw.replace('</head>',bridge+'</head>').replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p.startsWith('/discover')){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const file=resolve(dist,p.startsWith('/')?p.slice(1):p);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=22000','--dump-dom','http://127.0.0.1:'+port+'/discover?tab=foryou'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1600));
if(!/data-ct363done="1"/.test(out)){const m=out.match(/data-ct363probe="([^"]*)"/);throw new Error('R363_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R363_BROWSER_OK pool starts short, survives 14 mixed actions, refills before exhaustion, and last-item persistence revives same slot');
