import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r345.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v345.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="content"><div class="header"><div class="search"><span>⌕</span><input type="search" placeholder="Buscar filmes, séries, episódios e atores..."></div></div><button type="button">‹ Voltar</button><div data-ct319-discover><button data-ct318-filter>☷</button><div data-ct318-types><button>Todos</button><button>Filmes</button><button>Séries</button><button>Animes</button></div><div data-ct319-content></div></div></div>';
 const item=(id,type,title,genres)=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:genres});
 const m=item(101,'movie','Filme Watch',[27,53]),s=item(102,'tv','Série Watch',[80,18]),a={...item(103,'tv','Anime Watch',[16]),original_language:'ja'};
 const fm=item(201,'movie','Filme Novo',[28,12]),fs=item(202,'tv','Série Nova',[18]),fa={...item(203,'tv','Anime Novo',[16]),original_language:'ja'};
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m,item(111,'movie','Alt Filme',[35])],series:[s,item(112,'tv','Alt Série',[18])],anime:[a,item(113,'tv','Alt Anime',[16])]},
  freshPools:{movie:[fm,item(211,'movie','Alt Novo',[35])],series:[fs,item(212,'tv','Alt Série Nova',[53])],anime:[fa,item(213,'tv','Alt Anime Novo',[16])]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[item(301,'movie','Diário',[878]),item(302,'movie','Diário 2',[35])],dailyIndex:0,complete:true,
  initial:{watch:{movie:m,series:s,anime:a},fresh:{movie:fm,series:fs,anime:fa},daily:item(301,'movie','Diário',[878])}
 });
 if(window.__ctR319Test?.state){window.__ctR319Test.state.fyKind='movie';window.__ctR319Test.state.filterOpen=true}
 ok(window.__ctR336.paintForYou(),'paint failed');
 window.__ctR345.normalizeForYou();window.__ctR345.syncHeader();await sleep(100);
 const root=document.querySelector('[data-ct336-foryou]');ok(root,'Pra Você missing');
 ok(!document.querySelector('[data-ct318-filter],[data-ct318-types],[data-ct336-filters]'),'filter UI remains');
 const slots=[...root.querySelectorAll('.ct336-slot')];ok(slots.length>=7,'not all slots visible in forced-all mode');
 ok(slots.every(x=>!x.hidden),'some Pra Você slot remains filtered');
 for(const slot of slots){
  const row=slot.querySelector(':scope > .ct336-actions'),poster=slot.querySelector('.ct288-poster,.ct288-empty-poster'),genre=slot.querySelector('.ct344-primary-genre'),swap=slot.querySelector('[data-ct336-swap-only]');
  ok(row&&poster&&genre&&swap,'row/poster/genre/Trocar missing');
  ok(window.__ctR342.lockRow(row)===false,'r342 still modifies Pra Você');
  const rr=row.getBoundingClientRect(),pr=poster.getBoundingClientRect(),gr=genre.getBoundingClientRect();
  ok(Math.abs(rr.width-pr.width)<=1,'actions width != poster '+rr.width+'/'+pr.width);
  ok(rr.top>=gr.bottom-0.5,'actions overlap text/genre');
  ok(getComputedStyle(row).display==='grid','actions not grid');
  const count=row.querySelectorAll(':scope > button').length,bucket=String(slot.dataset.ct336Slot||'').split(':')[0];
  ok(count===(bucket==='watch'?2:3),'wrong action count '+slot.dataset.ct336Slot+' '+count);
  ok(getComputedStyle(swap).display!=='none'&&getComputedStyle(swap).visibility!=='hidden','Trocar hidden');
 }
 const sig=slots.map(s=>{const r=s.querySelector(':scope > .ct336-actions').getBoundingClientRect();return [r.left,r.top,r.width,r.height].map(v=>Math.round(v*10)/10).join(':')}).join('|');
 await sleep(900);
 window.__ctR345.normalizeForYou();
 const sig2=slots.map(s=>{const r=s.querySelector(':scope > .ct336-actions').getBoundingClientRect();return [r.left,r.top,r.width,r.height].map(v=>Math.round(v*10)/10).join(':')}).join('|');
 ok(sig===sig2,'Pra Você actions moved');

 const back=document.querySelector('[data-ct169-back]'),search=document.querySelector('.search');
 ok(back&&search,'back/search missing');
 ok(!/voltar/i.test(back.textContent),'back contains text');
 ok(back.textContent.trim()==='‹','back is not icon-only');
 const br=back.getBoundingClientRect(),sr=search.getBoundingClientRect();
 ok(br.right<=sr.left+1,'back not left of search');
 ok(Math.abs(br.top-sr.top)<=4,'back/search not same row');
 ok(![...document.querySelectorAll('button,a')].some(x=>/voltar/i.test(x.textContent)),'textual Voltar remains');
 document.documentElement.dataset.ct345done='1';
}catch(e){document.documentElement.dataset.ct345probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1365,768','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct345done="1"/.test(out)){const m=out.match(/data-ct345probe="([^"]*)"/);throw new Error('R345_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R345_BROWSER_OK Pra Você stable grid buttons/Trocar, filters absent, icon-only back beside search');
