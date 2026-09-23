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
 ok(window.__ctR352&&window.__ctR351&&window.__ctR350&&window.__ctR336,'r352 lineage missing '+window.__ctDiagErrors.join(' || '));
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

 let watchCalls=0,seenCalls=0,restoreCalls=0;
 window.__ctR350Test.setTestBridge({
  watchlist:async()=>{watchCalls++;await sleep(80);return true},
  seen:async()=>{seenCalls++;await sleep(80);return true}
 });
 window.__ctR351Test.setTestBridge({
  watchRows:async()=>{restoreCalls++;return []},
  filter:async rows=>rows
 });

 ok(window.__ctR336.paintForYou(),'initial Pra Você paint failed');
 window.__ctR348?.fixAll?.();window.__ctR349?.compact?.();await sleep(60);

 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const keys=()=>Object.fromEntries(names.map(name=>[name,document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'']));
 const assertOnly=(before,after,changed,label)=>{
  for(const name of names){
   if(name===changed)ok(before[name]&&after[name]&&before[name]!==after[name],label+' clicked slot did not change '+before[name]+' => '+after[name]);
   else ok(before[name]===after[name],label+' changed unrelated '+name+' '+before[name]+' => '+after[name]);
  }
 };

 let before=keys();
 const wl=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 ok(wl,'Watchlist button missing');wl.click();
 let immediate=keys();
 assertOnly(before,immediate,'fresh:movie','Watchlist immediate');
 ok(watchCalls===1,'Watchlist backend not called exactly once immediately: '+watchCalls);
 await sleep(180);
 let settled=keys();
 assertOnly(before,settled,'fresh:movie','Watchlist after backend');
 ok(JSON.stringify(immediate)===JSON.stringify(settled),'Watchlist caused second/global repaint after persistence');
 ok(watchCalls===1,'Watchlist backend duplicate call '+watchCalls);
 ok(restoreCalls===0,'Watchlist triggered authoritative full restore '+restoreCalls);

 before=keys();
 const seen=document.querySelector('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]');
 ok(seen,'Seen button missing');seen.click();
 immediate=keys();
 assertOnly(before,immediate,'watch:series','Seen immediate');
 ok(seenCalls===1,'Seen backend not called exactly once immediately: '+seenCalls);
 await sleep(180);
 settled=keys();
 assertOnly(before,settled,'watch:series','Seen after backend');
 ok(JSON.stringify(immediate)===JSON.stringify(settled),'Seen caused second/global repaint after persistence');
 ok(seenCalls===1,'Seen backend duplicate call '+seenCalls);
 ok(restoreCalls===0,'Seen triggered authoritative full restore '+restoreCalls);

 before=keys();
 const swap=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-swap-only]');
 ok(swap&&!swap.disabled,'Trocar missing/disabled');swap.click();
 immediate=keys();
 assertOnly(before,immediate,'fresh:series','Trocar');
 ok(watchCalls===1&&seenCalls===1,'Trocar called persistence');
 await sleep(120);
 ok(JSON.stringify(immediate)===JSON.stringify(keys()),'Trocar changed unrelated items later');

 document.documentElement.dataset.ct352done='1';
}catch(e){document.documentElement.dataset.ct352probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1900)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
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
if(!/data-ct352done="1"/.test(out)){const m=out.match(/data-ct352probe="([^"]*)"/);throw new Error('R352_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R352_BROWSER_OK Watchlist/Seen change only clicked slot before and after backend; Trocar unchanged');
