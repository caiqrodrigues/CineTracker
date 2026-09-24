import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r353.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v353.js')],{stdio:'inherit'});

const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR353&&window.__ctR353Test&&window.__ctR352&&window.__ctR309Test,'r353 lineage missing '+window.__ctDiagErrors.join(' || '));

 const item=(id,title,genres,vote=8)=>({tmdb_id:id,id,media_type:'movie',title,name:title,poster_path:'/x.jpg',vote_average:vote,release_date:'2026-01-01',genre_ids:genres});
 const pokemon=item(101,'Pokemon',[16,12],7.1),digimon=item(102,'Digimon',[16,10759],7.0),dragon=item(103,'Dragon Ball',[16,28],8.5),naruto=item(104,'Naruto',[16,28],8.8);
 const romance=item(105,'Romance',[10749],9.0),action=item(106,'Action',[28],7.5);
 const authority={raw:{history:[item(900,'Hist Action 1',[28]),item(901,'Hist Action 2',[28]),item(902,'Hist Action 3',[28]),item(903,'Hist Adventure',[12])]},watchRows:[pokemon,digimon,dragon,naruto,action,romance]};
 ok(window.__ctR353.score(action,authority,[action,romance])>window.__ctR353.score(romance,authority,[action,romance]),'history affinity does not raise relevant genre score');

 window.__ctR353.clearRecent();
 window.__ctR353Test.setRandom(()=>0);
 const pool=[pokemon,digimon,dragon,naruto];
 const first=window.__ctR353.pickIndex(pool,'movie',2,{authority});
 ok(first===0,'smart pick followed list order; expected non-sequential index 0, got '+first);
 ok(first!==3,'smart pick equals index+1');
 const second=window.__ctR353.pickIndex(pool,'movie',0,{authority});
 ok(second!==0,'smart pick repeated current');
 ok(second!==first,'recent-memory failed');

 window.__ctR353.clearRecent();
 window.__ctR353Test.setRandom(()=>0.42);
 const draft={watchPools:{movie:[pokemon,digimon,dragon,naruto],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},initial:{watch:{movie:pokemon,series:null,anime:null}}};
 window.__ctR353.prepare(draft,authority);
 ok(draft.initial.watch.movie===draft.watchPools.movie[draft.watchIndex.movie],'initial card not aligned to smart index');

 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const tv=(id,title,genres=[])=>({tmdb_id:id,id,media_type:'tv',title,name:title,poster_path:'/x.jpg',vote_average:8,first_air_date:'2026-01-01',genre_ids:genres});
 const st={
  watchPools:{movie:[pokemon,digimon,dragon,naruto],series:[tv(201,'S1',[18]),tv(202,'S2',[53])],anime:[tv(301,'A1',[16]),tv(302,'A2',[16])]},
  freshPools:{movie:[item(401,'F1',[35]),item(402,'F2',[28])],series:[tv(501,'FS1',[18]),tv(502,'FS2',[80])],anime:[tv(601,'FA1',[16]),tv(602,'FA2',[16])]},
  watchIndex:{movie:2,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[item(701,'D1',[35]),item(702,'D2',[28])],dailyIndex:0,
  initial:{watch:{movie:dragon,series:tv(201,'S1',[18]),anime:tv(301,'A1',[16])},fresh:{movie:item(401,'F1',[35]),series:tv(501,'FS1',[18]),anime:tv(601,'FA1',[16])},daily:item(701,'D1',[35])},complete:true
 };
 window.__ctR309Test.setForYouState(st);window.__ctR336.paintForYou();window.__ctR348?.fixAll?.();await sleep(60);
 window.__ctR353.clearRecent();window.__ctR353Test.setRandom(()=>0);
 const swap=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-swap-only]');
 ok(swap&&!swap.disabled,'watch movie Trocar unavailable');
 const before=window.__ctR309Test.state.watchIndex.movie;
 ok(before===2,'fixture index');
 window.__ctR352.swap(swap);await sleep(40);
 const after=window.__ctR309Test.state.watchIndex.movie;
 ok(after===0,'real r352 watch swap did not use smart picker: '+before+' => '+after);
 ok(after!==(before+1)%4,'real r352 swap is still sequential');
 const key=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct288-card]')?.dataset?.ct288Card||'';
 ok(key==='movie:101','rendered card does not match smart-selected Pokemon: '+key);

 document.documentElement.dataset.ct353done='1';
}catch(e){document.documentElement.dataset.ct353probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700)</script>`;

const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=17000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct353done="1"/.test(out)){const m=out.match(/data-ct353probe="([^"]*)"/);throw new Error('R353_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R353_BROWSER_OK weighted history affinity + non-sequential Watchlist swap + recent-memory + smart initial');
