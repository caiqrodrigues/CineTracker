import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r339.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v339.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',diag+'</head>');
const probe=`<script>setTimeout(async()=>{document.documentElement.dataset.ct339step='start';try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR339,R=window.__ctR336;
 if(!(X&&R&&window.__ctR309Test&&window.__ctR288R263))throw new Error('r338 bridges unavailable '+(window.__ctDiagErrors||[]).join(' || '));
 ok(window.__ctOfficialVersion==='1.0.130','web version stale');
 history.replaceState({},'','/discover');
 document.body.innerHTML='<div id="app"><div data-ct319-content></div></div>';
 const media=(id,type,title,extra={})=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.1,release_date:'2026-01-01',first_air_date:'2026-01-01',...extra});
 window.__ctR309Test.setForYouState({
  watchPools:{movie:[media(201,'movie','Watch A'),media(204,'movie','Watch B')],series:[media(202,'tv','Watch Series'),media(205,'tv','Watch Series B')],anime:[media(203,'tv','Watch Anime',{genre_ids:[16],origin_country:['JP']}),media(206,'tv','Watch Anime B',{genre_ids:[16],origin_country:['JP']})]},
  freshPools:{movie:[media(10,'movie','Fresh A'),media(11,'movie','Fresh B')],series:[media(20,'tv','Fresh Series'),media(21,'tv','Fresh Series B')],anime:[media(30,'tv','Fresh Anime',{genre_ids:[16],origin_country:['JP']}),media(31,'tv','Fresh Anime B',{genre_ids:[16],origin_country:['JP']})]},
  dailyPool:[media(40,'movie','Daily A'),media(41,'movie','Daily B')],
  watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0
 });
 window.__ctR288R263.discover263.tab='foryou';
 R.paintForYou();X.fixActions();

 const check=(slot,expected,label)=>{
  ok(slot,label+' slot missing');
  const card=slot.querySelector(':scope > .ct336-cardwrap .ct288-card')||slot.querySelector(':scope > .ct336-cardwrap');
  const row=slot.querySelector(':scope > .ct336-actions');
  ok(card&&row,label+' card/actions missing');
  const cr=card.getBoundingClientRect(),sr=slot.getBoundingClientRect(),rr=row.getBoundingClientRect();
  const buttons=[...row.querySelectorAll(':scope > button.ct336-action')];
  ok(buttons.length===expected,label+' button count '+buttons.length);
  ok(Math.abs(sr.width-cr.width)<=0.6,label+' slot wider than card: slot='+sr.width+' card='+cr.width);
  ok(Math.abs(rr.width-cr.width)<=0.6,label+' actions width differs from card: actions='+rr.width+' card='+cr.width);
  ok(Math.abs(rr.left-cr.left)<=0.6&&Math.abs(rr.right-cr.right)<=0.6,label+' actions not aligned to card edges');
  const rcs=getComputedStyle(row);ok(rcs.display==='flex',label+' row not flex');ok(rcs.flexWrap==='nowrap',label+' row wrapped');ok(rcs.overflow==='hidden',label+' row not contained');
  const rects=buttons.map(b=>b.getBoundingClientRect()).sort((a,b)=>a.left-b.left);
  const tops=new Set(rects.map(x=>Math.round(x.top)));ok(tops.size===1,label+' buttons not same row');
  for(let i=0;i<rects.length-1;i++)ok(rects[i].right<=rects[i+1].left+0.5,label+' buttons intersect '+i);
  ok(rects[0].left>=rr.left-0.5&&rects.at(-1).right<=rr.right+0.5,label+' buttons escape card-width row');
  buttons.forEach((b,i)=>{const cs=getComputedStyle(b),br=b.getBoundingClientRect();ok(cs.transform==='none',label+' transform '+i);ok(cs.position==='static',label+' position '+i);ok(br.width>25,label+' width '+i+'='+br.width)});
 };
 document.documentElement.dataset.ct339step='initial-geometry';
 check(document.querySelector('[data-ct336-section="watch"] [data-ct336-slot="watch:movie"]'),2,'watch-mobile');
 check(document.querySelector('[data-ct336-section="fresh"] [data-ct336-slot="fresh:movie"]'),3,'fresh-mobile');
 check(document.querySelector('.ct336-daily .ct336-slot'),3,'daily-mobile');

 document.documentElement.dataset.ct339step='hostile-reset';
 const hostileSlot=document.querySelector('[data-ct336-section="watch"] [data-ct336-slot="watch:movie"]');
 const hostile=hostileSlot.querySelector(':scope > .ct336-actions');
 const hb=[...hostile.querySelectorAll(':scope > button')];
 hostileSlot.style.setProperty('width','230px','important');hostile.style.setProperty('width','230px','important');
 hostile.style.setProperty('display','grid','important');hostile.style.setProperty('grid-template-columns','1fr','important');
 hb[1].style.setProperty('position','absolute','important');hb[1].style.setProperty('left','0','important');hb[1].style.setProperty('transform','translateX(-28px)','important');hb[1].style.setProperty('width','100%','important');
 X.fixActions();check(hostileSlot,2,'watch-reset-mobile');

 document.documentElement.dataset.ct339step='repaint';
 const before=document.querySelector('[data-ct336-slot="fresh:movie"]').textContent;
 R.swapForYou('fresh:movie');await new Promise(r=>setTimeout(r,140));
 const after=document.querySelector('[data-ct336-slot="fresh:movie"]').textContent;
 ok(after!==before,'swap did not repaint');
 check(document.querySelector('[data-ct336-section="fresh"] [data-ct336-slot="fresh:movie"]'),3,'fresh-after-swap-mobile');

 document.documentElement.dataset.ct339step='done';document.documentElement.dataset.ct339done='1';
}catch(e){document.documentElement.dataset.ct339probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},5600)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=412,915','--virtual-time-budget=20000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct339done="1"/.test(out)){const m=out.match(/data-ct339probe="([^"]*)"/),st=out.match(/data-ct339step="([^"]*)"/);throw new Error('R339_BROWSER '+(m?.[1]||('probe did not finish step='+(st?.[1]||'none'))))}
console.log('R339_BROWSER_OK mobile Pra Você actions equal the card width, stay side-by-side and never overlap after hostile styles and repaint');
