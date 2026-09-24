import {readFile} from 'node:fs/promises';import {resolve,extname} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
await import('./build-r362.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v362.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover?tab=foryou');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><div data-ct319-content></div></div>';
 const item=(id,type,title,g=[])=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8,release_date:'2026-09-01',first_air_date:'2026-09-01',genre_ids:g});
 const mk=(base,type,prefix,g=[])=>Array.from({length:6},(_,i)=>({...item(base+i,type,prefix+(i+1),g),...(g.includes(16)?{original_language:'ja',origin_country:['JP']}:{} )}));
 const wm=mk(101,'movie','WM'),ws=mk(201,'tv','WS'),wa=mk(301,'tv','WA',[16]),fm=mk(401,'movie','FM'),fs=mk(501,'tv','FS'),fa=mk(601,'tv','FA',[16]),daily=mk(701,'movie','D');
 window.__ctR309Test.setForYouState({watchPools:{movie:wm,series:ws,anime:wa},freshPools:{movie:fm,series:fs,anime:fa},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:daily,dailyIndex:0,complete:true,initial:{watch:{movie:wm[0],series:ws[0],anime:wa[0]},fresh:{movie:fm[0],series:fs[0],anime:fa[0]},daily:daily[0]}});
 const calls={watchlist:[],seen:[],swap:[]};
 window.__ctR360.setTestBridge({watchlist:async(t,id)=>{calls.watchlist.push(t+':'+id);await sleep(10);return true},seen:async(t,id)=>{calls.seen.push(t+':'+id);await sleep(10);return true},swapMemory:async(t,id,s)=>{calls.swap.push(t+':'+id+':'+s);return true}});
 ok(window.__ctR336.paintForYou(),'paint failed');window.__ctR362.armAll();window.__ctR362.bind();await sleep(60);
 ok(window.__ctR358Early===window.__ctR362.early,'physical r358 pointer is not r362');
 ok(window.__ctR359Early===window.__ctR362.early,'physical r359 pointer is not r362');
 ok(window.__ctR336EarlyHandle===window.__ctR362.early,'legacy r336 pointer is not r362');

 const names=['watch:movie','watch:series','watch:anime','fresh:movie','fresh:series','fresh:anime','daily'];
 const key=n=>document.querySelector('[data-ct336-slot="'+n+'"] [data-ct288-card]')?.dataset?.ct288Card||document.querySelector('[data-ct336-slot="'+n+'"] [data-media]')?.dataset?.media||'';
 const snapshot=()=>Object.fromEntries(names.map(n=>[n,key(n)]));
 const changedOnly=(before,after,name)=>{for(const n of names){if(n===name)ok(after[n]&&after[n]!==before[n],name+' did not change');else ok(after[n]===before[n],n+' changed during '+name+' action '+before[n]+' => '+after[n])}};
 function realClick(sel){
  const b=document.querySelector(sel);ok(b,'missing '+sel);ok(!b.disabled,'disabled before click '+sel);
  b.scrollIntoView({block:'center',inline:'center',behavior:'auto'});const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y);
  ok(hit&&(hit===b||b.contains(hit)),'not hit-testable '+sel+' hit='+(hit?.className||hit?.tagName||'none'));
  hit.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window,clientX:x,clientY:y}));
 }

 /* Watchlist: remove the card key so the real click must recover it from data-media. */
 let slot=document.querySelector('[data-ct336-slot="fresh:movie"]'),card=slot.querySelector('[data-ct288-card]'),wl=slot.querySelector('[data-ct336-action="watchlist"]');
 const expectedMedia=slot.querySelector('[data-media]')?.dataset?.media;ok(expectedMedia,'data-media fallback missing');
 delete card.dataset.ct288Card;delete wl.dataset.ct336Media;
 let before=snapshot();before['fresh:movie']=expectedMedia;
 realClick('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 let after=snapshot();changedOnly(before,after,'fresh:movie');
 await sleep(30);ok(calls.watchlist.length===1,'watchlist backend call count '+calls.watchlist.length);

 /* Seen: real DOM click, only the clicked Watchlist slot may rotate. */
 before=snapshot();realClick('[data-ct336-slot="watch:series"] [data-ct336-action="seen"]');after=snapshot();changedOnly(before,after,'watch:series');
 await sleep(30);ok(calls.seen.length===1,'seen backend call count '+calls.seen.length);

 /* Trocar: simulate stale disabled state; armAll must revive it before the real click. */
 const sw=document.querySelector('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');sw.disabled=true;sw.setAttribute('aria-disabled','true');window.__ctR362.armAll();
 ok(!sw.disabled,'Trocar remained disabled after r362 arm');
 before=snapshot();realClick('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');after=snapshot();changedOnly(before,after,'fresh:anime');
 await sleep(30);ok(calls.swap.length===1,'swap memory count '+calls.swap.length);

 /* A second click after repaint must still work and affect only the same slot. */
 before=snapshot();realClick('[data-ct336-slot="fresh:anime"] [data-ct336-swap-only]');after=snapshot();changedOnly(before,after,'fresh:anime');
 await sleep(30);ok(calls.swap.length===2,'second swap not persisted');

 for(const b of document.querySelectorAll('[data-ct336-foryou] .ct336-actions button')){ok(getComputedStyle(b).pointerEvents!=='none','pointer events dead');ok(!b.hasAttribute('inert'),'button inert')}

 document.documentElement.dataset.ct362done='1';
}catch(e){document.documentElement.dataset.ct362probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700)</script>`;
const html=baseRaw.replace('</head>',bridge+'</head>').replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p.startsWith('/discover')){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const file=resolve(dist,p.startsWith('/')?p.slice(1):p);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/discover?tab=foryou'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));
if(!/data-ct362done="1"/.test(out)){const m=out.match(/data-ct362probe="([^"]*)"/);throw new Error('R362_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R362_BROWSER_OK physical real clicks work; DOM key fallback works; only clicked slot changes');
