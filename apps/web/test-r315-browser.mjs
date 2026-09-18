import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r315.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR315Test;ok(T,'r315 test bridge unavailable');
 history.replaceState({},'','/discover');T.setDiscover('trending','all');
 const shell=document.createElement('main');shell.innerHTML=T.shellHtml315();document.body.appendChild(shell);
 ok(shell.querySelectorAll('[data-ct315-tab]').length===9,'nine Discover tabs missing');
 ok([...shell.querySelectorAll('[data-ct315-tab]')].some(x=>x.textContent.trim()==='Lançamentos'),'Lançamentos missing');
 T.setPersonal({blocked:['movie:1','tv:2'],aliases:[]});
 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',vote_average:8.2,release_date:'2026-01-01',first_air_date:'2026-01-01'});
 const clean=T.filterStrict315([media(1,'movie','Visto'),media(2,'tv','Watchlist'),media(3,'movie','Livre')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'strict seen/watchlist exclusion failed');
 const holder=document.createElement('div');holder.innerHTML=T.publicCard315(clean[0]);document.body.appendChild(holder);
 ok(holder.querySelector('[data-ct315-action="watchlist"]')?.textContent.includes('Watchlist'),'Watchlist action missing');
 ok(holder.querySelector('[data-ct315-action="seen"]')?.textContent.includes('Visto'),'Visto action missing');
 ok(!holder.querySelector('.ct314-minimal-plus'),'r314 single-plus contract leaked into r315 public card');
 ok(window.__ctR309&&typeof window.__ctR309.buildForYou==='function','r309 Pra Voce owner unavailable');
 ok(window.__ctR288Test&&typeof window.__ctR288Test.loadTop10==='function','r288 Top10 owner unavailable');
 const legacy=document.createElement('section');legacy.dataset.ct263F1WatchPanel='1';legacy.innerHTML='<small>Seu registro</small><b>Fórmula 1 assistida</b>';document.body.appendChild(legacy);T.removeLegacyF1315();ok(!document.querySelector('[data-ct263-f1-watch-panel]'),'legacy F1 panel survived cleanup');
 history.replaceState({},'','/profile');
 const p=document.createElement('main');p.innerHTML='<div data-profile><section class="panel ct-r180-stats-panel"><div class="panel-head"><h2>Estatísticas</h2><button data-ct-r180-stats-toggle aria-expanded="true">Recolher</button></div><div data-ct-r180-stats-body><div class="stats"><div class="stat" data-ct117-watchlist-stat="series"><small>Séries Watchlist</small><b>12</b><span class="ct117-stat-chevron">›</span></div><div class="stat"><small>Filmes Watchlist</small><b>8</b></div></div></div></section><section class="panel" data-profile-sports-panel><div class="panel-head"><h2>Esportes assistidos</h2></div><div class="stats"><div class="stat"><small>Tempo assistido</small><b>149h 00min</b></div><div class="stat"><small>Eventos assistidos</small><b>68</b></div></div></section></div>';document.body.appendChild(p);
 const root=p.querySelector('[data-profile]');T.ensureStadium315(root,1);T.staticizeWatchlist315(root);
 ok([...root.querySelectorAll('.stat')].some(x=>x.textContent.includes('Jogos no Estádio')&&x.textContent.includes('1')),'stadium stat missing');
 const wl=[...root.querySelectorAll('.stat')].find(x=>x.textContent.includes('Séries Watchlist'));ok(wl.classList.contains('ct315-watchlist-static')&&!wl.querySelector('.ct117-stat-chevron'),'Watchlist counter is not static');
 try{window.__ctV114SyncStats?.()}catch{};const sports=root.querySelector('[data-profile-sports-panel]');ok(sports?.dataset.ct114StatsGroup==='sports','sports stats not grouped with Recolher');
 ok(document.documentElement.dataset.ct315probe!=='fail','probe flag');
 document.documentElement.dataset.ct315done='1';
}catch(e){document.documentElement.dataset.ct315probe='fail:'+String(e?.stack||e)}},4300)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'||p==='/profile'||p==='/sports'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const file=resolve(dist,p.replace(/^\\/+/,''));if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=11000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct315done="1"/.test(out)){const m=out.match(/data-ct315probe="([^"]*)"/);throw new Error('R315_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R315_BROWSER_OK Discover actions/exclusion + Top10 owner + F1 cleanup + Profile contract');
