import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r324.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v324.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR324,XT=window.__ctR324Test,T=window.__ctR321Test;
 ok(window.__ctR324Marker,'r324 marker unavailable web='+String(window.__ctWebBuild)+' official='+String(window.__ctOfficialVersion)+' r323='+String(!!window.__ctR323)+' r321='+String(!!T));ok(X,'r324 main bridge unavailable marker='+String(window.__ctR324Marker));ok(XT,'r324 test bridge unavailable');ok(T,'r321 bridge unavailable');
 ok(window.__ctOfficialVersion==='1.0.115','web version stale');
 ok(X.version==='1.0.115','r324 API version stale');

 document.body.innerHTML='<div id="app"><div data-home>'+
  '<section class="home-section" data-ct274-history="episodes"><div class="panel-head"><h3>Histórico recente</h3><small>20</small></div><div class="stack ct274-history-stack"><div>EPISODE HISTORY LOADED</div></div></section>'+
  '<section class="home-section" data-ct274-history="movies"><div class="panel-head"><h3>Filmes vistos</h3><small>50</small></div><div class="stack ct274-history-stack"><div>MOVIE HISTORY LOADED</div></div></section>'+
  '</div></div>';
 X.decorateHomeHistory(true);
 const ep=document.querySelector('[data-ct274-history="episodes"]'),mv=document.querySelector('[data-ct274-history="movies"]');
 ok(ep.dataset.ct324History==='collapsed'&&mv.dataset.ct324History==='collapsed','Home histories not collapsed initially');
 ok(getComputedStyle(ep.querySelector('.ct274-history-stack')).display==='none','episode history visible initially');
 ok(getComputedStyle(mv.querySelector('.ct274-history-stack')).display==='none','movie history visible initially');
 ok(ep.textContent.includes('EPISODE HISTORY LOADED')&&mv.textContent.includes('MOVIE HISTORY LOADED'),'history content was not preloaded');
 ep.querySelector('[data-ct324-history-toggle]').click();
 ok(ep.dataset.ct324History==='open','episode history did not open');
 ok(getComputedStyle(ep.querySelector('.ct274-history-stack')).display!=='none','episode history remains hidden after toggle');
 ok(mv.dataset.ct324History==='collapsed','movie history opened together with episodes');

 const discover=document.createElement('div');
 discover.innerHTML='<div data-ct309-foryou style="width:176px"><div class="ct309-actions"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button><button class="chip ct309-swap">↻ Trocar</button></div></div><div class="ct319-actions" style="width:176px"><button class="chip">+ Watchlist</button><button class="chip">✓ Visto</button></div>';
 document.body.appendChild(discover);
 const fy=[...document.querySelectorAll('[data-ct309-foryou] .ct309-actions .chip')],pub=[...document.querySelectorAll('.ct319-actions .chip')];
 const fyTop=fy.map(b=>Math.round(b.getBoundingClientRect().top)),pubTop=pub.map(b=>Math.round(b.getBoundingClientRect().top));
 ok(new Set(fyTop).size===1,'Pra voce actions broke into multiple rows');
 ok(new Set(pubTop).size===1,'public actions broke into multiple rows');
 ok(fy.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'Pra voce action text may wrap');
 ok(pub.every(b=>getComputedStyle(b).whiteSpace==='nowrap'),'public action text may wrap');

 X.setTestBridge({watchPayload:async kind=>kind==='series'?{
   total:575,rows:[
    {media_id:1,media_type:'tv',tmdb_id:-9001,title:'Legacy Series',release_year:2001,added_at:'2026-09-20T10:00:00Z'},
    {media_id:2,media_type:'tv',tmdb_id:555,title:'Current Series',release_year:2024,added_at:'2026-09-21T00:00:00Z'}
   ]
  }:{
   total:1374,rows:[
    {media_id:3,media_type:'movie',tmdb_id:-8001,title:'Legacy Movie',release_year:1999,added_at:'2026-09-19T10:00:00Z'},
    {media_id:4,media_type:'movie',tmdb_id:777,title:'Current Movie',release_year:2025,added_at:'2026-09-20T10:00:00Z'}
   ]
  }});
 await X.openWatchlist('series');
 ok(document.querySelector('#ct324-watch-title')?.textContent==='Séries Watchlist · 575','series Watchlist count wrong');
 ok(document.querySelectorAll('[data-ct324-watch-list] .ct324-watch-row').length===2,'legacy series row was discarded');
 ok(document.querySelector('[data-ct324-legacy-media="1"]'),'negative-TMDB series not rendered');
 await X.openWatchlist('movie');
 ok(document.querySelector('#ct324-watch-title')?.textContent==='Filmes Watchlist · 1374','movie Watchlist count wrong');
 ok(document.querySelectorAll('[data-ct324-watch-list] .ct324-watch-row').length===2,'legacy movie row was discarded');
 ok(document.querySelector('[data-ct324-legacy-media="3"]'),'negative-TMDB movie not rendered');

 const hp=T.candidatePayload321([{media_type:'movie',tmdb_id:671,title:'Harry Potter e a Pedra Filosofal',original_title:"Harry Potter and the Philosopher's Stone",release_date:'2001-11-16',poster_path:'/hp.jpg'}])[0];
 ok(hp?.original_title==="Harry Potter and the Philosopher's Stone"&&hp?.release_year===2001,'Top10 candidate lost original-title alias');

 document.documentElement.dataset.ct324done='1';
}catch(e){document.documentElement.dataset.ct324probe='fail:'+String(e?.stack||e)}},4800)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'||p==='/profile'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=15000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct324done="1"/.test(out)){const m=out.match(/data-ct324probe="([^"]*)"/);throw new Error('R324_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R324_BROWSER_OK collapsed Home + one-row actions + exact Watchlist counts + legacy rows');
