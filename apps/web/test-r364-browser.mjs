import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r364.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v364.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};
window.__ctDiagErrors=[];
window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));
window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)));
</script>`;
const probe=`<script>
/* Install zero-network r363 bridge before any setTimeout(0) startup warm can run. */
window.__ctR363?.setTestBridge?.({
 refill:async(name)=>[],
 watchlist:async()=>true,
 seen:async()=>true,
 swapMemory:async()=>true
});
setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover?tab=foryou');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><div data-ct319-content></div></div>';
 const item=(id,type,title,g=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.4,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:g});
 const mk=(base,count,type,prefix,g=[])=>Array.from({length:count},(_,i)=>({...item(base+i,type,prefix+(i+1),g),...(g.includes(16)?{original_language:'ja',origin_country:['JP']}:{} )}));
 const wm=mk(100,12,'movie','WM'),ws=mk(200,12,'tv','WS'),wa=mk(300,12,'tv','WA',[16]);
 const fm=mk(400,12,'movie','FM'),fs=mk(500,12,'tv','FS'),fa=mk(600,12,'tv','FA',[16]),daily=mk(700,12,'movie','D');
 window.__ctR309Test.setForYouState({
  watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:daily,dailyIndex:0,complete:true,
  initial:{watch:{movie:wm[0],series:ws[0],anime:wa[0]},fresh:{movie:fm[0],series:fs[0],anime:fa[0]},daily:daily[0]}
 });
 ok(window.__ctR336.paintForYou(),'paint failed');
 window.__ctR364.armAll();await sleep(40);
 ok(window.__ctR358Early===window.__ctR364.early,'r358 pointer not r364');
 ok(window.__ctR359Early===window.__ctR364.early,'r359 pointer not r364');
 ok(window.__ctR336EarlyHandle===window.__ctR364.early,'r336 pointer not r364');

 const name='fresh:movie';
 const key=()=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const clickSwap=()=>{
  const b=document.querySelector('[data-ct336-slot="'+name+'"] [data-ct336-swap-only]');
  ok(b&&!b.disabled,'Trocar unavailable');
  const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);
  ok(hit&&(hit===b||b.contains(hit)),'Trocar not hit-testable');
  hit.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window,clientX:x,clientY:y}));
 };
 let heartbeat=0;const beat=setInterval(()=>heartbeat++,5),start=performance.now();
 let before=key();
 for(let i=0;i<40;i++){
  clickSwap();
  const after=key();ok(after&&after!==before,'Trocar stopped changing item at click '+i+' '+before+' => '+after);
  before=after;
  await sleep(3);
 }
 const elapsed=performance.now()-start;clearInterval(beat);
 ok(window.__ctR364.clicks===40,'r364 click count '+window.__ctR364.clicks);
 ok(heartbeat>=10,'event loop starved heartbeat='+heartbeat);
 ok(elapsed<2500,'40 swaps too slow/frozen '+elapsed+'ms');

 /* The rest of the page must still accept events after the stress sequence. */
 let outside=0;const x=document.createElement('button');x.id='outside';x.textContent='outside';x.onclick=()=>outside++;document.body.appendChild(x);x.click();
 ok(outside===1,'page interaction frozen after repeated Trocar');

 /* Visto/Watchlist still use the same single owner and only mutate the clicked slot. */
 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const snap=()=>Object.fromEntries(names.map(n=>[n,document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]')?.dataset?.ct288Card||'']));
 const click=(sel)=>{const b=document.querySelector(sel);ok(b,'missing '+sel);b.click()};
 let a=snap();click('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]');let b=snap();
 ok(b['watch:series']!==a['watch:series'],'Visto did not change clicked slot');
 for(const n of names)if(n!=='watch:series')ok(b[n]===a[n],'Visto changed '+n);
 a=snap();click('[data-ct336-slot="fresh:anime"] [data-ct336-action="watchlist"]');b=snap();
 ok(b['fresh:anime']!==a['fresh:anime'],'Watchlist did not change clicked slot');
 for(const n of names)if(n!=='fresh:anime')ok(b[n]===a[n],'Watchlist changed '+n);

 document.documentElement.dataset.ct364done='1';
}catch(e){document.documentElement.dataset.ct364probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700);
</script>`;
const html=baseRaw.replace('</head>',bridge+'</head>').replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p.startsWith('/discover')){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const file=resolve(dist,p.startsWith('/')?p.slice(1):p);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=7000','--dump-dom','http://127.0.0.1:'+port+'/discover?tab=foryou'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGKILL')}catch{}},14000);const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));
if(!/data-ct364done="1"/.test(out)){const m=out.match(/data-ct364probe="([^"]*)"/);throw new Error('R364_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R364_BROWSER_OK full bundle: 40 real Trocar clicks stay responsive; Visto/Watchlist remain single-slot');
