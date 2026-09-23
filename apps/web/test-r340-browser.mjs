import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r340.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
execFileSync(process.execPath,['--check',resolve('dist/app-v340.js')],{stdio:'inherit'});
const dist=resolve('dist'),baseRaw=await readFile(resolve(dist,'index.html'),'utf8');
const bridge=`<script>
window.__ct340SyncCalls=[];window.__ct340Loads=[];window.__ct340Attempt=0;
window.__ctR340TestBridge={
 load:async force=>{window.__ct340Loads.push(!!force);return {ok:true,force:!!force}},
 sync:async(from,to,force)=>{window.__ct340SyncCalls.push({from,to,force});window.__ct340Attempt++;if(window.__ct340Attempt===1){const e=new Error('invalid session');e.status=401;throw e}return {ok:true}}
};
</script>`;
const diag='<script>window.__ctDiagErrors=[];window.addEventListener("error",e=>window.__ctDiagErrors.push(String((e.filename||"inline")+":"+(e.lineno||0)+":"+(e.colno||0)+":"+(e.error?.stack||e.message||e))));window.addEventListener("unhandledrejection",e=>window.__ctDiagErrors.push("PROMISE:"+String(e.reason?.stack||e.reason||e)))</script>';
const base=baseRaw.replace('</head>',bridge+diag+'</head>');
const discoverFixture=JSON.stringify(`<div data-ct319-discover><div data-ct319-content>
 <div class="ct319-item" data-ct319-item="movie:1" style="width:220px"><div class="ct288-card" style="width:142px;height:210px"></div><div class="ct319-actions" style="display:grid;grid-template-columns:1fr;width:230px"><button style="width:100%">Watchlist</button><button style="width:100%">Visto</button></div></div>
 <div class="ct336-slot"><div class="ct336-cardwrap"><div class="ct288-card" style="width:154px;height:230px"></div></div><div class="ct336-actions" style="display:grid;grid-template-columns:1fr;width:240px"><button>Watchlist</button><button style="position:absolute;left:0;width:100%">Visto</button><button>Trocar</button></div></div>
 <div class="ct329-slot"><div class="ct329-cardwrap"><div class="ct288-card" style="width:160px;height:230px"></div></div><div class="ct329-actions" style="width:260px"><button>Watchlist</button><button>Visto</button><button>Trocar</button></div></div>
</div></div>`);
const probe=`<script>setTimeout(async()=>{document.documentElement.dataset.ct340step='start';try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR340;
 ok(X&&window.__ctR339,'r340/r339 bridges unavailable '+(window.__ctDiagErrors||[]).join(' || '));
 ok(window.__ctOfficialVersion==='1.0.131','web version stale');

 /* Every-open Sports: first auth failure must retry, then both date windows complete and payload refreshes. */
 document.documentElement.dataset.ct340step='sports';
 const sportsOk=await X.syncSportsOnOpen();ok(sportsOk===true,'sports every-open sync failed');
 ok(window.__ct340SyncCalls.length===3,'sports retry/window calls='+window.__ct340SyncCalls.length);
 ok(window.__ct340SyncCalls.every(x=>x.force===true),'sports provider sync not forced');
 ok(window.__ct340Loads[0]===false&&window.__ct340Loads.at(-1)===true,'sports payload was not warm-then-refresh');
 ok(document.documentElement.dataset.ct340Sports==='synced','sports state not synced');

 /* Discover: public and ForYou hostile layouts must become one horizontal row exactly card-wide. */
 document.documentElement.dataset.ct340step='discover';
 history.replaceState({},'','/discover');
 document.querySelector('#app').innerHTML=${discoverFixture};
 X.bindDiscoverObserver();X.fixDiscoverActions();
 const check=(row,label)=>{
  ok(row,label+' row missing');const card=X.fixActionRow(row)&&window.__ctR340Test.cardForRow340(row);ok(card,label+' card missing');
  const cr=card.getBoundingClientRect(),rr=row.getBoundingClientRect(),buttons=[...row.querySelectorAll(':scope > button')],rects=buttons.map(b=>b.getBoundingClientRect()).sort((a,b)=>a.left-b.left);
  ok(Math.abs(rr.width-cr.width)<=0.6,label+' row/card width mismatch '+rr.width+'/'+cr.width);
  ok(Math.abs(rr.left-cr.left)<=0.6&&Math.abs(rr.right-cr.right)<=0.6,label+' row not aligned to card edges');
  ok(getComputedStyle(row).display==='flex'&&getComputedStyle(row).flexWrap==='nowrap',label+' not nowrap flex');
  ok(new Set(rects.map(x=>Math.round(x.top))).size===1,label+' buttons wrapped');
  for(let i=0;i<rects.length-1;i++)ok(rects[i].right<=rects[i+1].left+0.5,label+' buttons overlap '+i);
  ok(rects[0].left>=rr.left-0.5&&rects.at(-1).right<=rr.right+0.5,label+' buttons overflow row');
  const used=rects.reduce((a,r)=>a+r.width,0)+(rects.length-1)*parseFloat(getComputedStyle(row).columnGap||getComputedStyle(row).gap||'0');
  ok(Math.abs(used-rr.width)<=1.5,label+' unused/overflow width '+used+'/'+rr.width);
  const widths=rects.map(x=>x.width),spread=Math.max(...widths)-Math.min(...widths);ok(spread<=1.5,label+' buttons not equal width '+widths.join(','));
 };
 check(document.querySelector('.ct319-actions'),'public-mobile');
 check(document.querySelector('.ct336-actions'),'foryou-current');
 check(document.querySelector('.ct329-actions'),'foryou-legacy');

 /* Child-list repaint is automatically normalized by the scoped observer. */
 const content=document.querySelector('[data-ct319-content]');content.insertAdjacentHTML('beforeend','<div class="ct319-item" data-ct319-item="movie:2"><div class="ct288-card" style="width:136px;height:200px"></div><div class="ct319-actions" style="display:grid;grid-template-columns:1fr;width:260px"><button>Watchlist</button><button>Visto</button></div></div>');
 await new Promise(r=>setTimeout(r,120));check(content.lastElementChild.querySelector('.ct319-actions'),'public-after-repaint');
 document.documentElement.dataset.ct340step='done';document.documentElement.dataset.ct340done='1';
}catch(e){document.documentElement.dataset.ct340probe='fail:'+String(e?.stack||e)+' ERRORS='+(window.__ctDiagErrors||[]).join(' || ')}},1800)</script>`;
const html=base.replace('</body>',probe+'</body>'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--window-size=412,915','--virtual-time-budget=16000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1800));
if(!/data-ct340done="1"/.test(out)){const m=out.match(/data-ct340probe="([^"]*)"/),st=out.match(/data-ct340step="([^"]*)"/);throw new Error('R340_BROWSER '+(m?.[1]||('probe did not finish step='+(st?.[1]||'none'))))}
console.log('R340_BROWSER_OK Sports retries auth and syncs every open; all Discover action rows exactly fill card width without wrap/overflow/slack');
