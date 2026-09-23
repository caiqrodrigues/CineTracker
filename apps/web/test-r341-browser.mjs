import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r341.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v341.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const fixture=JSON.stringify(`<div data-ct319-discover><div data-ct319-content>
 <section class="ct336-slot" data-ct336-slot="fresh:movie" style="width:230px">
  <div class="ct336-cardwrap"><article class="ct288-card" style="width:176px"><button class="ct288-open"><img class="ct288-poster" style="width:154px!important;height:231px"></button></article></div>
  <div class="ct336-actions ct336-actions-three" style="display:grid;grid-template-columns:1fr;width:260px;position:relative">
   <button class="ct336-action" style="width:100%">+ Watchlist</button>
   <button class="ct336-action" style="position:absolute;left:0;width:100%;transform:translateX(-30px)">✓ Visto</button>
   <button class="ct336-action" disabled style="width:2px">↻ Trocar</button>
  </div>
 </section>
 <div class="ct319-item" data-ct319-item="movie:1" style="width:220px">
  <article class="ct288-card" style="width:176px"><button class="ct288-open"><img class="ct288-poster" style="width:142px!important;height:213px"></button></article>
  <div class="ct319-actions" style="display:grid;grid-template-columns:1fr;width:250px"><button style="width:100%">+ Watchlist</button><button style="position:absolute;width:100%">✓ Visto</button></div>
 </div>
 <div class="ct315-item" data-ct315-item="movie:2" style="width:220px">
  <article class="ct288-card" style="width:176px"><button class="ct288-open"><img class="ct288-poster" style="width:136px!important;height:204px"></button></article>
  <div class="ct315-actions" style="width:250px"><button>+ Watchlist</button><button>✓ Visto</button></div>
 </div>
</div></div>`);
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR341;
 ok(X&&window.__ctR340&&window.__ctR339,'r341 dependencies missing '+window.__ctDiagErrors.join(' || '));
 ok(window.__ctOfficialVersion==='1.0.132','version stale');
 history.replaceState({},'','/discover');document.querySelector('#app').innerHTML=${fixture};
 X.bindMutation();X.fixAll();

 const check=(row,label)=>{
  ok(row,label+' row missing');const p=X.poster(row);ok(p,label+' poster missing');
  const pr=p.getBoundingClientRect(),rr=row.getBoundingClientRect(),bs=[...row.querySelectorAll(':scope > button')],br=bs.map(b=>b.getBoundingClientRect());
  ok(Math.abs(rr.width-pr.width)<=0.65,label+' row '+rr.width+' != poster '+pr.width);
  ok(Math.abs(rr.left-pr.left)<=0.65,label+' row left '+rr.left+' != poster left '+pr.left);
  ok(getComputedStyle(row).display==='flex'&&getComputedStyle(row).flexWrap==='nowrap',label+' row not nowrap flex');
  ok(new Set(br.map(x=>Math.round(x.top))).size===1,label+' buttons wrapped');
  for(let i=0;i<br.length-1;i++)ok(br[i].right<=br[i+1].left+0.65,label+' button overlap '+i+' '+br[i].right+'/'+br[i+1].left);
  ok(br[0].left>=rr.left-0.65&&br.at(-1).right<=rr.right+0.65,label+' buttons outside poster-width row');
  const widths=br.map(x=>x.width),spread=Math.max(...widths)-Math.min(...widths);ok(spread<=0.8,label+' unequal widths '+widths.join(','));
  const gap=parseFloat(getComputedStyle(row).columnGap||getComputedStyle(row).gap||'0'),used=widths.reduce((a,v)=>a+v,0)+gap*Math.max(0,widths.length-1);
  ok(Math.abs(used-rr.width)<=1.3,label+' hidden/slack geometry '+used+'/'+rr.width);
  bs.forEach((b,i)=>{const cs=getComputedStyle(b);ok(cs.display!=='none'&&cs.visibility!=='hidden',label+' hidden button '+i);ok(cs.position==='relative',label+' stale position '+i+'='+cs.position);ok(Math.abs(parseFloat(cs.width)-widths[i])<1,label+' css/rect width mismatch '+i)});
 };

 const fy=document.querySelector('.ct336-actions'),pub=document.querySelector('.ct319-actions'),cal=document.querySelector('.ct315-actions');
 check(fy,'foryou');check(pub,'public');check(cal,'calendar');

 /* Explicitly let the old r339 writer run; r341 must reclaim geometry afterwards. */
 window.__ctR339.fixActions();X.settle();await new Promise(r=>setTimeout(r,650));check(fy,'after-r339-conflict');

 /* Poster width is the authority, not the card wrapper. ResizeObserver must follow it. */
 const pubPoster=X.poster(pub);pubPoster.style.setProperty('width','128px','important');X.fixAll();await new Promise(r=>setTimeout(r,80));check(pub,'public-after-poster-resize');

 /* New cards inserted after paint must be normalized too. */
 const host=document.querySelector('[data-ct319-content]');
 host.insertAdjacentHTML('beforeend','<div class="ct319-item" data-ct319-item="movie:3"><article class="ct288-card" style="width:176px"><button class="ct288-open"><img class="ct288-poster" style="width:132px!important;height:198px"></button></article><div class="ct319-actions" style="display:grid;width:280px"><button style="width:100%">+ Watchlist</button><button style="position:absolute;width:100%">✓ Visto</button></div></div>');
 await new Promise(r=>setTimeout(r,650));check(host.lastElementChild.querySelector('.ct319-actions'),'after-repaint');

 const owned=window.__ctR336?.paintForYou;ok(owned?.__ctR341Owned===true,'r341 did not own r336 paint');
 ok(!owned?.__ctR341Base?.__ctR339Wrapped&&!owned?.__ctR341Base?.__ctR338Wrapped,'legacy r338/r339 wrapper still underneath r341 owner');
 document.documentElement.dataset.ct341done='1';
}catch(e){document.documentElement.dataset.ct341probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},2200)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;

async function runViewport(width,height,label){
 const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking',`--window-size=${width},${height}`,'--virtual-time-budget=18000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
 let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));
 if(code!==0)throw new Error(label+' Chromium failed '+code+' '+err.slice(-1500));
 if(!/data-ct341done="1"/.test(out)){const m=out.match(/data-ct341probe="([^"]*)"/);throw new Error('R341_BROWSER_'+label+' '+(m?.[1]||'probe did not finish'))}
}
await runViewport(1680,900,'DESKTOP');
await runViewport(412,915,'MOBILE');
await new Promise(r=>server.close(r));
console.log('R341_BROWSER_OK desktop+mobile poster width authority, explicit equal pixel buttons, no hidden/overlap/slack, late conflict recovery');
