import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r342.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v342.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>window.__ctR340TestBridge={load:async()=>({ok:true}),sync:async()=>({ok:true})};window.__ctDiagErrors=[];window.addEventListener('error',e=>window.__ctDiagErrors.push(String(e.error?.stack||e.message||e)));window.addEventListener('unhandledrejection',e=>window.__ctDiagErrors.push('PROMISE:'+String(e.reason?.stack||e.reason||e)))</script>`;
const base=baseRaw.replace('</head>',bridge+'</head>');
const fixture=JSON.stringify(`<div data-ct319-discover><div data-ct319-content>
 <section class="ct336-slot" data-ct336-slot="fresh:movie" style="width:230px">
  <div class="ct336-cardwrap"><article class="ct288-card" style="width:176px"><button class="ct288-open"><img class="ct288-poster" style="width:154px!important;height:231px"></button></article></div>
  <div class="ct336-actions ct336-actions-three" style="display:grid;grid-template-columns:1fr;width:280px;position:absolute;left:22px;transition:all .4s ease">
   <button class="ct336-action" style="width:100%;transform:translateX(8px)">+ Watchlist</button>
   <button class="ct336-action" style="position:absolute;left:0;width:100%;transition:all .5s">✓ Visto</button>
   <button class="ct336-action" disabled style="width:3px">↻ Trocar</button>
  </div>
 </section>
 <div class="ct319-item" data-ct319-item="movie:1" style="width:220px">
  <article class="ct288-card"><button class="ct288-open"><img class="ct288-poster" style="width:142px!important;height:213px"></button></article>
  <div class="ct319-actions" style="display:grid;grid-template-columns:1fr;width:260px;transition:width .7s"><button style="width:100%">+ Watchlist</button><button style="position:absolute;width:100%">✓ Visto</button></div>
 </div>
 <div class="ct315-item" data-ct315-item="movie:2" style="width:220px">
  <article class="ct288-card"><button class="ct288-open"><img class="ct288-poster" style="width:136px!important;height:204px"></button></article>
  <div class="ct315-actions" style="width:250px"><button>+ Watchlist</button><button>✓ Visto</button></div>
 </div>
</div></div>`);
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR342,sleep=ms=>new Promise(r=>setTimeout(r,ms));
 ok(X&&window.__ctR341&&window.__ctR340&&window.__ctR339&&window.__ctR338,'r342 lineage missing '+window.__ctDiagErrors.join(' || '));
 ok(window.__ctOfficialVersion==='1.0.133','version stale');
 history.replaceState({},'','/discover');document.querySelector('#app').innerHTML=${fixture};
 X.bind();await sleep(80);X.lockAll();

 const signature=row=>{
  const rr=row.getBoundingClientRect(),br=[...row.querySelectorAll(':scope > button')].map(b=>b.getBoundingClientRect());
  return [rr.left,rr.top,rr.width,rr.height,...br.flatMap(r=>[r.left,r.top,r.width,r.height])].map(v=>Math.round(v*100)/100).join('|');
 };
 const check=(row,label)=>{
  ok(row,label+' missing');const p=X.poster(row),pr=p?.getBoundingClientRect(),rr=row.getBoundingClientRect(),bs=[...row.querySelectorAll(':scope > button')],br=bs.map(b=>b.getBoundingClientRect());
  ok(row.dataset.ct342Locked==='1',label+' not locked');
  ok(Math.abs(rr.width-pr.width)<=0.7,label+' row/poster mismatch '+rr.width+'/'+pr.width);
  ok(getComputedStyle(row).visibility==='visible',label+' hidden after lock');
  ok(getComputedStyle(row).transitionDuration==='0s',label+' row transition active');
  ok(new Set(br.map(x=>Math.round(x.top))).size===1,label+' wrapped');
  for(let i=0;i<br.length-1;i++)ok(br[i].right<=br[i+1].left+0.7,label+' overlap '+i);
  ok(br[0].left>=rr.left-0.7&&br.at(-1).right<=rr.right+0.7,label+' overflow');
  bs.forEach((b,i)=>{const cs=getComputedStyle(b);ok(cs.transitionDuration==='0s',label+' button transition active '+i);ok(cs.animationName==='none',label+' animation active '+i)});
 };
 const fy=document.querySelector('.ct336-actions'),pub=document.querySelector('.ct319-actions'),cal=document.querySelector('.ct315-actions');
 check(fy,'foryou');check(pub,'public');check(cal,'calendar');

 /* Continuously invoke every retired writer during the idle period. Geometry must not move by even one CSS pixel. */
 const rows=[fy,pub,cal],before=rows.map(signature);
 for(let tick=0;tick<12;tick++){
  window.__ctR338?.fixActions?.();window.__ctR339?.fixActions?.();window.__ctR340?.fixDiscoverActions?.();window.__ctR341?.fixAll?.();
  await sleep(80);
  rows.forEach((row,i)=>ok(signature(row)===before[i],'jitter detected '+i+' tick='+tick+' before='+before[i]+' after='+signature(row)));
 }
 rows.forEach((row,i)=>check(row,'idle-stable-'+i));

 /* A real DOM repaint creates hidden actions, then the single r342 owner reveals them once after paint. */
 const host=document.querySelector('[data-ct319-content]');
 host.insertAdjacentHTML('beforeend','<div class="ct319-item" data-ct319-item="movie:3"><article class="ct288-card"><button class="ct288-open"><img class="ct288-poster" style="width:132px!important;height:198px"></button></article><div class="ct319-actions" style="width:290px;transition:all .8s"><button>+ Watchlist</button><button style="position:absolute;width:100%">✓ Visto</button></div></div>');
 const fresh=host.lastElementChild.querySelector('.ct319-actions');
 ok(getComputedStyle(fresh).visibility==='hidden','fresh row flashed before lock');
 await sleep(100);check(fresh,'fresh-row');
 const stable=signature(fresh);await sleep(700);ok(signature(fresh)===stable,'fresh row moved after becoming visible');

 document.documentElement.dataset.ct342done='1';
}catch(e){document.documentElement.dataset.ct342probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;

async function runViewport(width,height,label){
 const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking',`--window-size=${width},${height}`,'--virtual-time-budget=20000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
 let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));
 if(code!==0)throw new Error(label+' Chromium failed '+code+' '+err.slice(-1600));
 if(!/data-ct342done="1"/.test(out)){const m=out.match(/data-ct342probe="([^"]*)"/);throw new Error('R342_BROWSER_'+label+' '+(m?.[1]||'probe did not finish'))}
}
await runViewport(1680,900,'DESKTOP');
await runViewport(412,915,'MOBILE');
await new Promise(r=>server.close(r));
console.log('R342_BROWSER_OK desktop+mobile no jitter under legacy writer pressure; new rows hidden until one stable lock');
