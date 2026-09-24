import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r355.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v355.js')],{stdio:'inherit'});

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
 ok(window.__ctR355&&window.__ctR352&&window.__ctR348&&window.__ctR336Test,'r355 lineage missing '+window.__ctDiagErrors.join(' || '));

 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title,genres=[],lang='en')=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:'/x.jpg',vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01',release_year:2026,genre_ids:genres,original_language:lang});
 const wm1=item(101,'movie','Watch M1',[28]),wm2=item(102,'movie','Watch M2',[35]);
 const ws1=item(201,'tv','Watch S1',[18]),ws2=item(202,'tv','Watch S2',[53]);
 const wa1={...item(301,'tv','Watch A1',[16],'ja')},wa2={...item(302,'tv','Watch A2',[16],'ja')};
 const fm1=item(401,'movie','Fresh M1',[12]),fm2=item(402,'movie','Fresh M2',[35]);
 const fs1=item(501,'tv','Fresh S1',[18]),fs2=item(502,'tv','Fresh S2',[80]);
 const fa1={...item(601,'tv','Fresh A1',[16],'ja')},fa2={...item(602,'tv','Fresh A2',[16],'ja')};
 const d1=item(701,'movie','Daily 1',[878]),d2=item(702,'movie','Daily 2',[35]);
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[wm1,wm2],series:[ws1,ws2],anime:[wa1,wa2]},
  freshPools:{movie:[fm1,fm2],series:[fs1,fs2],anime:[fa1,fa2]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[d1,d2],dailyIndex:0,complete:true,
  initial:{watch:{movie:wm1,series:ws1,anime:wa1},fresh:{movie:fm1,series:fs1,anime:fa1},daily:d1}
 });
 ok(window.__ctR336Test.paintForYou336(),'initial paint failed');window.__ctR348.fixAll();await sleep(50);

 const backend=[];
 window.__ctR355.setTestBridge({
  watchlist:(type,id)=>new Promise(res=>setTimeout(()=>{backend.push('watchlist:'+type+':'+id);res(true)},80)),
  seen:(type,id)=>new Promise(res=>setTimeout(()=>{backend.push('seen:'+type+':'+id);res(true)},80))
 });
 const key=name=>document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]')?.dataset?.ct288Card||'';
 const root=document.querySelector('[data-ct336-foryou]'),rootIdentity=root;
 const untouched=document.querySelector('[data-ct336-slot="fresh:anime"]'),untouchedKey=key('fresh:anime');

 let before=key('fresh:movie');
 let btn=document.querySelector('[data-ct336-slot="fresh:movie"] [data-ct336-action="watchlist"]');
 delete btn.dataset.ct336Media;delete btn.dataset.ct336Swap;
 btn.click();
 let after=key('fresh:movie');
 ok(after&&after!==before,'Watchlist did not change clicked slot immediately '+before+' => '+after);
 ok(document.querySelector('[data-ct336-foryou]')===rootIdentity,'Watchlist repainted whole Pra Voce root');
 ok(document.querySelector('[data-ct336-slot="fresh:anime"]')===untouched&&key('fresh:anime')===untouchedKey,'Watchlist changed unrelated slot');
 await sleep(110);ok(backend.filter(x=>x==='watchlist:movie:401').length===1,'Watchlist backend missing/duplicate '+backend.join(','));

 before=key('watch:movie');
 btn=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-action="seen"]');
 delete btn.dataset.ct336Media;delete btn.dataset.ct336Swap;
 btn.click();after=key('watch:movie');
 ok(after&&after!==before,'Visto did not change clicked slot immediately '+before+' => '+after);
 ok(document.querySelector('[data-ct336-foryou]')===rootIdentity,'Visto repainted whole Pra Voce root');
 await sleep(110);ok(backend.filter(x=>x==='seen:movie:101').length===1,'Visto backend missing/duplicate '+backend.join(','));

 before=key('fresh:series');
 btn=document.querySelector('[data-ct336-slot="fresh:series"] [data-ct336-swap-only]');
 delete btn.dataset.ct336SwapOnly;
 btn.click();after=key('fresh:series');
 ok(after&&after!==before,'Trocar did not change clicked slot immediately '+before+' => '+after);
 ok(backend.length===2,'Trocar called persistence '+backend.join(','));

 history.replaceState({},'','/sports');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div class="search-global"><input type="search"></div><div class="page" data-sports data-ct255-sports></div></main></div>';
 const syncs=[];let loads=0,paints=0;
 window.__ctR354.setTestBridge({
  sync:async(from,to,force)=>{syncs.push([from,to,force]);return{ok:true}},
  load:async()=>{loads++;return{events:[{id:1}]}},
  paint:()=>{paints++;return true}
 });
 ok(window.__ctR355.ensureSportsButton(),'r355 Sports button not created without header');
 const sb=document.querySelector('[data-ct355-sports-sync]');
 ok(sb&&/Sincronizar/.test(sb.textContent),'r355 Sports sync label missing');
 ok(sb.closest('.ct355-sports-toolbar'),'r355 Sports button not in dedicated toolbar');
 sb.click();await sleep(90);
 ok(syncs.length===4,'Sports sync ranges '+syncs.length);
 ok(loads===1,'Sports payload not reloaded '+loads);
 ok(paints>=1,'Sports page not repainted '+paints);
 ok(!sb.disabled&&/Sincronizar/.test(sb.textContent),'Sports sync button not restored');

 document.documentElement.dataset.ct355done='1';
}catch(e){document.documentElement.dataset.ct355probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1500)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{
 const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;
 if(p==='/'||p==='/discover'||p==='/sports'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}
 const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}
 const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)
}catch{res.writeHead(404);res.end('not found')}});

await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct355done="1"/.test(out)){const m=out.match(/data-ct355probe="([^"]*)"/);throw new Error('R355_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R355_BROWSER_OK Watchlist/Visto/Trocar local-only + Sports sync always visible');
