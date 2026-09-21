import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r329.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR329,XT=window.__ctR329Test,R=window.__ctR319Test;
 ok(X&&XT&&R,'r329 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.120','version stale');
 history.replaceState({},'','/discover');

 document.body.innerHTML='<div id="app">'+R.shell319()+'</div>';
 const h=document.querySelector('[data-ct319-content]');
 h.innerHTML='<div data-ct309-foryou><section class="panel ct309-daily"><div class="ct309-daily-card"><div class="ct288-card">Daily</div><div class="ct309-actions"><button class="chip" data-ct309-action="watchlist">+ Watchlist</button><button class="chip" data-ct309-action="seen">✓ Visto</button><button class="chip" data-ct309-swap="daily">↻ Trocar</button></div></div></section><section class="panel"><div class="ct309-fy-grid">'+
 ['movie','series','anime'].map(k=>'<section class="ct309-slot" data-ct309-slot="fresh:'+k+'"><div class="ct288-card">'+k+'</div><div class="ct309-actions"><button class="chip" data-ct309-action="watchlist">+ Watchlist</button><button class="chip" data-ct309-action="seen">✓ Visto</button><button class="chip" data-ct309-swap="fresh:'+k+'">↻ Trocar</button></div></section>').join('')+
 '</div></section></div>';
 XT.compactForYou329(document);
 const slots=[...document.querySelectorAll('.ct309-slot')],xs=slots.map(x=>Math.round(x.getBoundingClientRect().left));
 ok(xs.length===3&&xs[1]-xs[0]<=175&&xs[2]-xs[1]<=175,'ForYou cards are still spread apart: '+xs.join(','));
 for(const row of document.querySelectorAll('[data-ct309-foryou] .ct309-actions')){
  const tops=[...row.querySelectorAll('.chip')].map(b=>Math.round(b.getBoundingClientRect().top));
  ok(new Set(tops).size===1,'ForYou buttons wrapped');
  ok([...row.querySelectorAll('.chip')].every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'ForYou button text can wrap');
 }

 R.state.fyKind='movie';XT.applyForYouFilter329();
 ok(document.querySelector('[data-ct309-slot="fresh:movie"]').hidden===false,'movie filter hid movie');
 ok(document.querySelector('[data-ct309-slot="fresh:series"]').hidden===true,'movie filter did not hide series');
 ok(document.querySelector('[data-ct309-slot="fresh:anime"]').hidden===true,'movie filter did not hide anime');

 R.state.fyKind='all';XT.applyForYouFilter329();XT.cacheCurrent329();
 ok(X.cacheSize()>=1,'DOM cache not populated');
 let calls=0;
 X.setTestBridge({
  loadDiscover:async tab=>{calls++;await new Promise(r=>setTimeout(r,180));h.innerHTML='<div class="ct319-public">loaded '+tab+'</div>';return true},
  source:async()=>{await new Promise(r=>setTimeout(r,5));return[]}
 });
 const t0=performance.now();await X.loadTab('foryou');const cachedMs=performance.now()-t0;
 ok(cachedMs<80,'cached tab switch too slow '+cachedMs);
 ok(calls===0,'cached tab triggered network loader');

 const before=h.innerHTML;await XT.prefetchSources329();
 ok(h.innerHTML===before,'source prefetch changed visible DOM');

 document.documentElement.dataset.ct329done='1';
}catch(e){document.documentElement.dataset.ct329probe='fail:'+String(e?.stack||e)}},5200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=15000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct329done="1"/.test(out)){const m=out.match(/data-ct329probe="([^"]*)"/);throw new Error('R329_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R329_BROWSER_OK cache-first tabs + compact ForYou + local filters');
