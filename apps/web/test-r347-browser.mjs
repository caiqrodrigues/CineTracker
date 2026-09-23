import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r347.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v347.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(window.__ctR347&&window.__ctR346&&window.__ctR345&&window.__ctR336,'lineage missing '+window.__ctDiagErrors.join(' || '));

 /* Home reproduction from the user's 1664x936 video: content must not become a 34px+rest grid. */
 history.replaceState({},'','/');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content ct345-search-row" style="display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;column-gap:8px!important;width:100%!important"><div class="search-global"><span>⌕</span><input type="search" placeholder="Buscar filmes, séries, episódios e atores..."></div><div class="page" data-home><div class="home-tabs"><button>Séries</button><button>Filmes</button></div><section class="panel" style="width:100%"><div class="home-list">HOME</div></section></div></main></div>';
 window.__ctR347.settle();await sleep(100);
 const content=document.querySelector('.content'),home=document.querySelector('[data-home]');
 const cs=getComputedStyle(content),inner=content.clientWidth-parseFloat(cs.paddingLeft||'0')-parseFloat(cs.paddingRight||'0');
 ok(!content.classList.contains('ct345-search-row'),'ct345-search-row survived');
 ok(cs.display==='block','content still grid '+cs.display);
 ok(home.getBoundingClientRect().width>=inner-2,'Home still squeezed '+home.getBoundingClientRect().width+'/'+inner);

 /* Real Pra Você renderer with the legacy r338 stylesheet present in the bundle. r347 must physically remove it. */
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div class="search-global"><span>⌕</span><input type="search" placeholder="Buscar filmes, séries, episódios e atores..."></div><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title,genres)=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01',genre_ids:genres});
 const m=item(101,'movie','Filme Watch',[27]),s=item(102,'tv','Série Watch',[18]),a={...item(103,'tv','Anime Watch',[16]),original_language:'ja'};
 const fm=item(201,'movie','Filme Novo',[28]),fs=item(202,'tv','Série Nova',[18]),fa={...item(203,'tv','Anime Novo',[16]),original_language:'ja'};
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m,item(111,'movie','Alt Filme',[35])],series:[s,item(112,'tv','Alt Série',[18])],anime:[a,item(113,'tv','Alt Anime',[16])]},
  freshPools:{movie:[fm,item(211,'movie','Alt Novo',[35])],series:[fs,item(212,'tv','Alt Série Nova',[53])],anime:[fa,item(213,'tv','Alt Anime Novo',[16])]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[item(301,'movie','Diário',[878]),item(302,'movie','Diário 2',[35])],dailyIndex:0,complete:true,
  initial:{watch:{movie:m,series:s,anime:a},fresh:{movie:fm,series:fs,anime:fa},daily:item(301,'movie','Diário',[878])}
 });
 ok(window.__ctR336.paintForYou(),'r336 paint failed');
 window.__ctR347.settle();await sleep(120);
 ok(!document.getElementById('ct-web-r338'),'r338 zero-width stylesheet still mounted');
 ok(!document.getElementById('ct-web-r339'),'r339 legacy stylesheet still mounted');
 const root=document.querySelector('[data-ct336-foryou]'),slots=[...root.querySelectorAll('.ct336-slot')];
 ok(slots.length>=7,'Pra Você slots missing');
 for(const slot of slots){
  const poster=slot.querySelector('.ct288-poster,.ct288-empty-poster'),row=slot.querySelector(':scope > .ct336-actions'),buttons=[...row.querySelectorAll(':scope > button.ct336-action')],swap=slot.querySelector('[data-ct336-swap-only]');
  ok(poster&&row&&buttons.length>=2&&swap,'Pra Você structure missing');
  const pr=poster.getBoundingClientRect(),rr=row.getBoundingClientRect(),br=buttons.map(b=>b.getBoundingClientRect());
  ok(Math.abs(rr.width-pr.width)<=1,'row width != poster '+rr.width+'/'+pr.width);
  br.forEach((r,i)=>ok(r.width>24,'button collapsed '+i+' width='+r.width));
  ok(br[0].left>=rr.left-1&&br.at(-1).right<=rr.right+1,'buttons overflow row');
  ok(new Set(br.map(r=>Math.round(r.top))).size===1,'buttons wrapped');
  for(let i=0;i<br.length-1;i++)ok(br[i].right<=br[i+1].left+1,'buttons overlap');
  ok(getComputedStyle(swap).display!=='none'&&getComputedStyle(swap).visibility!=='hidden','Trocar hidden');
  ok(/Trocar/.test(swap.textContent),'Trocar label missing');
 }
 const before=slots.map(s=>[...s.querySelectorAll(':scope > .ct336-actions > button')].map(b=>Math.round(b.getBoundingClientRect().width)).join(',')).join('|');
 await sleep(1000);window.__ctR347.repairForYou();await sleep(50);
 const after=slots.map(s=>[...s.querySelectorAll(':scope > .ct336-actions > button')].map(b=>Math.round(b.getBoundingClientRect().width)).join(',')).join('|');
 ok(before===after,'button widths changed after idle '+before+' => '+after);

 document.documentElement.dataset.ct347done='1';
}catch(e){document.documentElement.dataset.ct347probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=17000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct347done="1"/.test(out)){const m=out.match(/data-ct347probe="([^"]*)"/);throw new Error('R347_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R347_BROWSER_OK 1664x936 Home full width + Pra Você buttons nonzero/stable/Trocar visible');
