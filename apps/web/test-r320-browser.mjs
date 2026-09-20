import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r320.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR320Test;ok(T,'r320 bridge unavailable');
 history.replaceState({},'','/discover');
 T.setTestBridge({exact:async items=>({blocked_keys:items.filter(x=>x.tmdb_id===10||x.tmdb_id===20).map(x=>x.media_type+':'+x.tmdb_id),watch_keys:['movie:20'],seen_keys:['movie:10'],not_interested_keys:[]})});
 const host=document.createElement('main');host.innerHTML='<div data-ct319-content><section class="panel"><div class="panel-head"><h2>Em alta</h2><small>3</small></div><div class="ct319-rail"><div class="ct319-item" data-ct319-item="movie:10"><div class="ct288-card"><div class="card-body"><b>Visto</b><small>2026</small></div></div></div><div class="ct319-item" data-ct319-item="movie:20"><div class="ct288-card"><div class="card-body"><b>Watchlist</b><small>2026</small></div></div></div><div class="ct319-item" data-ct319-item="movie:30"><div class="ct288-card"><div class="card-body"><b>Livre</b><small>2026</small></div></div></div></div></section></div>';document.body.appendChild(host);
 await window.__ctR320.validatePublic(host);
 ok(!host.querySelector('[data-ct319-item="movie:10"]'),'seen candidate survived');
 ok(!host.querySelector('[data-ct319-item="movie:20"]'),'Watchlist candidate survived');
 ok(host.querySelector('[data-ct319-item="movie:30"][data-ct320-validated="1"]'),'eligible candidate missing validation');
 const fy={watchPools:{movie:[{media_type:'movie',tmdb_id:20}],series:[{media_type:'tv',tmdb_id:40}],anime:[]},freshPools:{movie:[{media_type:'movie',tmdb_id:10},{media_type:'movie',tmdb_id:30}],series:[],anime:[]},dailyPool:[{media_type:'movie',tmdb_id:10},{media_type:'movie',tmdb_id:30}],watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyIndex:0};
 const clean=T.sanitizeState(fy,{blocked_keys:['movie:10','movie:20'],watch_keys:['movie:20'],seen_keys:['movie:10'],not_interested_keys:[]});
 ok(clean.watchPools.movie.length===1&&clean.watchPools.movie[0].tmdb_id===20,'valid Watchlist item lost');
 ok(clean.freshPools.movie.length===1&&clean.freshPools.movie[0].tmdb_id===30,'blocked fresh item survived');
 const html=T.activityItemHtml320({item_type:'episode',media_type:'tv',tmdb_id:99,media_title:'Série Teste',title:'Capítulo',season_number:2,episode_number:3,vote_average:8.1,watched_at:'2026-09-20T12:00:00Z',remaining_episodes:4,plays:2});
 ok(html.includes('S02E03')&&html.includes('Ep: Capítulo')&&html.includes('★ 8.1')&&html.includes('4 episódios disponíveis para ver')&&html.includes('2x'),'Profile history metadata incomplete');
 document.documentElement.dataset.ct320done='1';
}catch(e){document.documentElement.dataset.ct320probe='fail:'+String(e?.stack||e)}},4600)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'||p==='/profile'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12500','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct320done="1"/.test(out)){const m=out.match(/data-ct320probe="([^"]*)"/);throw new Error('R320_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R320_BROWSER_OK exact candidate filtering + Home-parity history metadata');
