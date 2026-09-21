import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r328.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist');execFileSync(process.execPath,['--check',resolve(dist,'app-v328.js')],{stdio:'inherit'});const base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},X=window.__ctR328,XT=window.__ctR328Test;
 ok(X&&XT,'r328 bridges unavailable');
 ok(window.__ctOfficialVersion==='1.0.119','web version stale');

 history.replaceState({},'','/home');
 const eps=Array.from({length:18},(_,i)=>({
  id:i+1,media_id:100+i,tmdb_id:0,media_title:i===17?'Newest Episode':'Episode '+(i+1),poster_path:null,
  season_number:1,episode_number:i+1,episode_title:'Ep '+(i+1),episode_rating:8.1,
  episode_air_date:i===17?'1988-01-01':null,
  watched_at:new Date(Date.UTC(2026,8,1+i,12,0,0)).toISOString(),plays:1
 }));
 const movies=[
  {id:31,media_id:301,tmdb_id:0,media_type:'movie',media_title:'Old Movie',title:'Old Movie',poster_path:null,watched_at:'2026-09-10T12:00:00Z',release_year:2020,runtime_minutes:100,genres:[],vote_average:7,plays:1},
  {id:32,media_id:302,tmdb_id:0,media_type:'movie',media_title:'New Movie',title:'New Movie',poster_path:null,watched_at:'2026-09-20T12:00:00Z',release_year:2025,runtime_minutes:110,genres:[],vote_average:8,plays:1}
 ];
 const payload={series:[],movie_watchlist:[],history_episodes:eps,history_movies:movies,__ctHistoryAuthoritative:true};
 XT.setHomeCache(payload);
 const t0=performance.now();await XT.renderNow();const elapsed=performance.now()-t0;
 ok(elapsed<500,'cached Home render too slow '+elapsed);
 ok(!document.querySelector('[data-home] .loader'),'cached Home left skeleton visible');

 const hs=document.querySelector('[data-ct274-history="episodes"]'),shell=hs?.querySelector('.ct275-history-shell'),stack=hs?.querySelector('.ct274-history-stack');
 ok(hs&&shell&&stack,'real history structure missing');
 XT.normalizeHistory328();
 ok(getComputedStyle(hs).overflowY==='visible','history section still scrolls internally');
 ok(getComputedStyle(shell).overflowY==='visible','history shell still scrolls internally');
 ok(getComputedStyle(stack).overflowY==='visible','history stack still scrolls internally');
 ok(getComputedStyle(stack).maxHeight==='none','history stack still capped');
 ok(!hs.querySelector('[data-ct275-history-toggle],[data-ct324-history-toggle]'),'legacy history button survived');

 XT.fixHistoryDates328();
 const cards=[...document.querySelectorAll('[data-ct274-history="episodes"] [data-ct274-episode-card]')];
 ok(cards.length===18,'episode history count mismatch');
 const lastMeta=cards.at(-1)?.querySelector('.ct274-meta')?.textContent||'';
 ok(lastMeta.includes('18/09/2026'),'history shows air date instead of watched date: '+lastMeta);
 ok(!lastMeta.includes('01/01/1988'),'1988 air date leaked into history');

 const movieCards=[...document.querySelectorAll('[data-ct274-history="movies"] [data-ct274-movie-card]')];
 ok(movieCards.at(-1)?.textContent.includes('Visto 20/09/2026'),'movie watched date missing');
 ok(cards.at(-1)?.textContent.includes('Newest Episode'),'newest history item is not nearest main content');

 XT.anchorHome328();
 const target=XT.anchorTarget328();
 ok(target,'Home anchor target missing');
 ok(Math.abs(target.getBoundingClientRect().top-10)<45,'initial Home anchor is not below history');

 XT.setTestBridge({homePayload:async()=>{await new Promise(r=>setTimeout(r,120));return payload}});
 XT.clearHomeCache();
 const firstStart=performance.now();const good=await XT.renderNow();const firstElapsed=performance.now()-firstStart;
 ok(good===true,'fresh Home render failed');
 ok(firstElapsed<1500,'single-RPC Home test flow too slow '+firstElapsed);

 document.documentElement.dataset.ct328done='1';
}catch(e){document.documentElement.dataset.ct328probe='fail:'+String(e?.stack||e)}},6200)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/home'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=19000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct328done="1"/.test(out)){const m=out.match(/data-ct328probe="([^"]*)"/);throw new Error('R328_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R328_BROWSER_OK natural history + watched date + cache-first Home');
