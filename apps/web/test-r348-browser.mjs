import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r348.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v348.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML='<div class="app"><aside class="sidebar"></aside><main class="content"><div data-ct319-discover><div data-ct319-content></div></div></main></div>';
 const item=(id,type,title)=>({tmdb_id:id,id,media_type:type,title,name:title,poster_path:null,vote_average:8,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 const m=item(101,'movie','Filme Watch'),s=item(102,'tv','Série Watch'),a={...item(103,'tv','Anime Watch'),genre_ids:[16],original_language:'ja'};
 const fm=item(201,'movie','Filme Novo'),fs=item(202,'tv','Série Nova'),fa={...item(203,'tv','Anime Novo'),genre_ids:[16],original_language:'ja'};
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[m,item(111,'movie','Alt Filme')],series:[s,item(112,'tv','Alt Série')],anime:[a,{...item(113,'tv','Alt Anime'),genre_ids:[16],original_language:'ja'}]},
  freshPools:{movie:[fm,item(211,'movie','Alt Novo')],series:[fs,item(212,'tv','Alt Série Nova')],anime:[fa,{...item(213,'tv','Alt Anime Novo'),genre_ids:[16],original_language:'ja'}]},
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},
  dailyPool:[item(301,'movie','Diário'),item(302,'movie','Diário 2')],dailyIndex:0,complete:true,
  initial:{watch:{movie:m,series:s,anime:a},fresh:{movie:fm,series:fs,anime:fa},daily:item(301,'movie','Diário')}
 });
 ok(window.__ctR336.paintForYou(),'r336 paint failed');
 window.__ctR348.fixAll();window.__ctR348.bind();await sleep(50);

 const inspect=()=>{
  const root=document.querySelector('[data-ct336-foryou]');ok(root,'Pra Você missing');
  const slots=[...root.querySelectorAll('.ct336-slot')];ok(slots.length===7,'expected 7 slots got '+slots.length);
  const sig=[];
  for(const slot of slots){
   const name=slot.dataset.ct336Slot,row=slot.querySelector(':scope > .ct336-actions'),poster=slot.querySelector('.ct288-poster,.ct288-empty-poster');
   ok(row&&poster,'row/poster missing '+name);
   const buttons=[...row.querySelectorAll(':scope > button.ct336-action')],expected=name.startsWith('watch:')?2:3;
   ok(buttons.length===expected,name+' direct button count '+buttons.length+' expected '+expected);
   const labels=buttons.map(b=>b.textContent.trim());
   const want=expected===2?['✓ Visto','↻ Trocar']:['+ Watchlist','✓ Visto','↻ Trocar'];
   ok(JSON.stringify(labels)===JSON.stringify(want),name+' labels '+labels.join('|'));
   const swap=slot.querySelector('[data-ct336-swap-only]');
   ok(swap&&swap.parentElement===row,name+' Trocar is not direct child');
   ok(slot.querySelectorAll('[data-ct336-swap-only]').length===1,name+' stray Trocar exists');
   ok([...slot.querySelectorAll('.ct336-action')].every(b=>b.parentElement===row),name+' stray action outside row');
   const rr=row.getBoundingClientRect(),pr=poster.getBoundingClientRect(),br=buttons.map(b=>b.getBoundingClientRect());
   ok(Math.abs(rr.width-pr.width)<=1,name+' row width '+rr.width+' != poster '+pr.width);
   ok(br.every(r=>r.width>28),name+' collapsed button '+br.map(r=>r.width).join(','));
   ok(new Set(br.map(r=>Math.round(r.top))).size===1,name+' button wrap');
   for(let i=0;i<br.length-1;i++)ok(br[i].right<=br[i+1].left+1,name+' overlap '+i);
   ok(br[0].left>=rr.left-1&&br.at(-1).right<=rr.right+1,name+' overflow');
   sig.push(name+':'+labels.join('|')+':'+br.map(r=>Math.round(r.width*10)/10).join(','));
  }
  return sig.join('||');
 };
 const before=inspect();

 window.__ctR336.swapForYou('fresh:movie');
 await sleep(60);
 const afterSwap=inspect();
 ok(afterSwap.includes('fresh:movie:+ Watchlist|✓ Visto|↻ Trocar'),'fresh movie contract lost after Trocar');

 const seen=document.querySelector('[data-ct336-slot="watch:movie"] [data-ct336-action="seen"]');
 seen.click();await sleep(80);inspect();

 const stable=inspect();await sleep(1000);const stable2=inspect();
 ok(stable===stable2,'buttons changed after idle '+stable+' => '+stable2);
 ok(!document.querySelector('[data-ct336-foryou] .ct336-slot > [data-ct336-swap-only]'),'stray swap below rows');

 document.documentElement.dataset.ct348done='1';
}catch(e){document.documentElement.dataset.ct348probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1700)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=1664,936','--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1600));
if(!/data-ct348done="1"/.test(out)){const m=out.match(/data-ct348probe="([^"]*)"/);throw new Error('R348_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R348_BROWSER_OK exact 2/3 direct action children, Trocar in-row, no stray controls, stable after swap/seen/1s');
