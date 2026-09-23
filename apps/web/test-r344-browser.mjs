import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r344.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v344.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div data-ct319-discover><div data-ct319-content></div></div>';
 const item=(id,type,title,genres)=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:genres});
 const m=item(101,'movie','Filme Watch',[27,53,18]),s=item(102,'tv','Série Watch',[80,18]),a={...item(103,'tv','Anime Watch',[16,10759]),original_language:'ja'};
 const fm=item(201,'movie','Filme Novo',[28,12]),fs=item(202,'tv','Série Nova',[18,9648]),fa={...item(203,'tv','Anime Novo',[16,35]),original_language:'ja'};
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m,item(111,'movie','Alt Filme',[35])],series:[s,item(112,'tv','Alt Série',[18])],anime:[a,item(113,'tv','Alt Anime',[16])]},
  freshPools:{movie:[fm,item(211,'movie','Alt Novo',[35])],series:[fs,item(212,'tv','Alt Série Nova',[53])],anime:[fa,item(213,'tv','Alt Anime Novo',[16])]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[item(301,'movie','Diário',[878,12]),item(302,'movie','Diário 2',[35])],dailyIndex:0,complete:true,
  initial:{watch:{movie:m,series:s,anime:a},fresh:{movie:fm,series:fs,anime:fa},daily:item(301,'movie','Diário',[878,12])}
 });
 ok(window.__ctR336.paintForYou(),'r336 paint failed');
 window.__ctR344.decorateForYou();
 const root=document.querySelector('[data-ct336-foryou]');ok(root,'Pra Você missing');
 const slots=[...root.querySelectorAll('.ct336-slot')];ok(slots.length>=7,'expected 7 Pra Você slots, got '+slots.length);
 for(const slot of slots){
  const genre=slot.querySelector('.ct344-primary-genre'),row=slot.querySelector(':scope > .ct336-actions'),swap=slot.querySelector('[data-ct336-swap-only]');
  ok(genre&&genre.textContent.trim(),'genre missing');
  ok(!genre.textContent.includes(','),'more than one genre: '+genre.textContent);
  ok(row&&swap,'canonical action row/Trocar missing');
  ok(getComputedStyle(swap).display!=='none'&&getComputedStyle(swap).visibility!=='hidden','Trocar hidden');
  const gr=genre.getBoundingClientRect(),rr=row.getBoundingClientRect();ok(rr.top>=gr.bottom-0.5,'actions overlap genre '+genre.textContent+' '+rr.top+'/'+gr.bottom);
  const bucket=String(slot.dataset.ct336Slot||'').split(':')[0],expected=bucket==='watch'?2:3;
  ok(row.querySelectorAll(':scope > button').length===expected,'wrong action count '+slot.dataset.ct336Slot);
 }
 const first=root.querySelector('.ct344-primary-genre');ok(first.textContent==='Ficção científica'||first.textContent==='Terror','unexpected primary genre '+first.textContent);
 const before=root.innerHTML;window.__ctV122MetadataRun?.();window.__ctV122MetadataSync?.();await sleep(1400);ok(root.innerHTML===before,'legacy metadata mutated Pra Você after 1.2s');

 const host=document.querySelector('[data-ct319-content]');
 host.innerHTML='<div data-ct321-top-content><section class="panel ct288-top-section"><div class="ct319-top-row">'+Array.from({length:10},(_,i)=>'<div class="ct319-item"><article class="ct288-card"><button class="ct288-open"><div class="ct288-poster" style="aspect-ratio:2/3"></div><span class="ct288-copy"><b>Item '+(i+1)+'</b><small>2026 · Filme</small></span></button></article><div class="ct319-actions"><button class="chip">Watchlist</button><button class="chip">Visto</button></div></div>').join('')+'</div></section></div>';
 window.__ctR344.fitTopTen();await sleep(60);
 const row=host.querySelector('.ct319-top-row'),items=[...row.children];ok(items.length===10,'Top10 item count');
 const rr=row.getBoundingClientRect(),last=items[9].getBoundingClientRect(),firstItem=items[0].getBoundingClientRect();
 ok(getComputedStyle(row).gridTemplateColumns.split(' ').length===10,'Top10 is not 10 columns');
 ok(firstItem.left>=rr.left-1&&last.right<=rr.right+1,'10th Top10 item outside viewport '+last.right+'/'+rr.right);
 ok(row.scrollWidth<=row.clientWidth+2,'Top10 still requires horizontal scroll '+row.scrollWidth+'/'+row.clientWidth);
 document.documentElement.dataset.ct344done='1';
}catch(e){document.documentElement.dataset.ct344probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1680,900','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct344done="1"/.test(out)){const m=out.match(/data-ct344probe="([^"]*)"/);throw new Error('R344_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R344_BROWSER_OK one primary genre, no genre/action overlap, Trocar present, legacy 1.2s pass retired, 10 Top10 cards fit viewport');
