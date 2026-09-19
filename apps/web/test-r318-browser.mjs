import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';

await import('./build-r318.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const dist=resolve('dist'),base=await readFile(resolve(dist,'index.html'),'utf8');
const probe=`<script>setTimeout(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},T=window.__ctR318Test;ok(T,'r318 bridge unavailable');
 history.replaceState({},'','/discover');
 T.setDiscover('foryou','all');
 const shell=document.createElement('main');shell.innerHTML=T.shell318();document.body.appendChild(shell);
 ok(shell.querySelectorAll('[data-ct318-tab]').length===9,'nine tabs missing');
 const forYouFilters=T.filterMarkup318();ok(forYouFilters.includes('Todos')&&forYouFilters.includes('Filmes')&&forYouFilters.includes('Séries')&&forYouFilters.includes('Animes'),'Pra Você filters incomplete');

 const fy=document.createElement('div');fy.setAttribute('data-ct309-foryou','');fy.innerHTML='<section class="ct309-daily">Daily</section><section><div class="ct309-fy-grid"><div class="ct309-slot" data-ct309-slot="watch:movie">WM</div><div class="ct309-slot" data-ct309-slot="watch:series">WS</div><div class="ct309-slot" data-ct309-slot="watch:anime">WA</div></div></section>';document.body.appendChild(fy);
 T.state.fyKind='series';T.applyForYouFilter318();ok(fy.dataset.ct318FyFilter==='series','Pra Você filter state not applied');ok(getComputedStyle(fy.querySelector('[data-ct309-slot="watch:movie"]')).display==='none','movie slot survived series filter');ok(getComputedStyle(fy.querySelector('[data-ct309-slot="watch:series"]')).display!=='none','series slot hidden by series filter');ok(getComputedStyle(fy.querySelector('.ct309-daily')).display==='none','daily movie survived series filter');

 const media=(id,type,title)=>({id,tmdb_id:id,media_type:type,title,name:title,poster_path:'/p'+id+'.jpg',release_date:'2026-01-01',first_air_date:'2026-01-01'});
 T.setPersonal({blocked:['movie:1','tv:2'],aliases:['movie|duplicado|2026']});
 T.setDiscover('trending','all');
 let clean=T.strict318([media(1,'movie','Visto'),media(2,'tv','Watchlist'),media(3,'movie','Livre'),media(4,'movie','Duplicado')]);
 ok(clean.length===1&&clean[0].tmdb_id===3,'strict seen/watchlist/alias exclusion failed');
 T.setDiscover('trending','movie');clean=T.strict318([media(3,'movie','Livre'),media(5,'tv','Serie Livre')]);ok(clean.length===1&&clean[0].tmdb_id===3,'type filter must apply after exclusion');

 const host=document.createElement('div');host.setAttribute('data-ct318-content','');document.body.appendChild(host);T.paintPublic318([media(1,'movie','Visto'),media(3,'movie','Livre')],'trending',{blocked:new Set(['movie:1']),aliases:new Set()});ok(!host.textContent.includes('Visto')&&host.textContent.includes('Livre'),'blocked card reached public HTML');
 document.documentElement.dataset.ct318done='1';
}catch(e){document.documentElement.dataset.ct318probe='fail:'+String(e?.stack||e)}},4500)</script>`;
const html=base.replace('</body>',probe+'</body>');
const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://127.0.0.1'),p=u.pathname;if(p==='/'||p==='/discover'){res.writeHead(200,{'content-type':'text/html'});res.end(html);return}const safe=p.startsWith('/')?p.slice(1):p,file=resolve(dist,safe);if(!file.startsWith(dist)){res.writeHead(403);res.end();return}const body=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(body)}catch{res.writeHead(404);res.end('not found')}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=12000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const code=await new Promise(r=>child.on('close',r));await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium failed '+code+' '+err.slice(-1200));
if(!/data-ct318done="1"/.test(out)){const m=out.match(/data-ct318probe="([^"]*)"/);throw new Error('R318_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R318_BROWSER_OK Pra Você filters + strict public exclusion');
